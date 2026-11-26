import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AgentsAndMessaging } from './components/AgentsAndMessaging';
import { BrandsAndInsights } from './components/BrandsAndInsights';
import { ClientDashboard } from './components/ClientDashboard';
import { FeaturedShowcase } from './components/FeaturedShowcase';
import { HeroSection } from './components/HeroSection';
import { ListingsExplorer } from './components/ListingsExplorer';
import { MortgageCalculator } from './components/MortgageCalculator';
import { Navbar, type NavSectionId } from './components/Navbar';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AGENTS, type AgentProfile, PROPERTIES, type PropertyListing } from './data/properties';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from './lib/firebase';
import type {
  ApplicationRecord,
  ChatMessageRecord,
  ConversationRecord,
  SavedPropertyRecord,
  SavedSearchRecord,
} from './types/portal';
import { type ApplicationType, getNextApplicationStage } from './utils/applications';
import { DEFAULT_FILTERS, type SearchFilters } from './utils/filters';
import { type CurrencyCode, type MortgageInput } from './utils/mortgage';

function formatTimestamp(value: unknown): string {
  if (
    value &&
    typeof value === 'object' &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
  return 'Just now';
}

const INITIAL_GUEST_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'guest-app-1',
    userId: 'guest',
    propertyId: 'prop-dorvane-residences',
    propertyTitle: "D'ORVANE Residences",
    agentId: 'agent-emeka',
    agentName: 'Emeka Okafor',
    applicationType: 'Purchase Financing',
    status: 'Inspection Scheduled',
    downPaymentPercent: 25,
    estimatedMonthlyNgn: 1_080_151,
    notes: 'Private walkthrough scheduled for Friday at 2:00 PM; EdoGIS title copy shared.',
    createdAtLabel: 'Nov 20',
    updatedAtLabel: 'Nov 24',
  },
];

const INITIAL_GUEST_SEARCHES: SavedSearchRecord[] = [
  {
    id: 'guest-search-1',
    userId: 'guest',
    name: 'Benin GRA · 3+ Bed Luxury',
    query: 'Benin',
    category: 'Luxury Apartment',
    listingMode: 'All',
    minBeds: 3,
    maxPriceNgn: 150_000_000,
    createdAtLabel: 'Nov 22',
  },
];

const INITIAL_GUEST_SAVED_PROPERTIES: SavedPropertyRecord[] = [
  {
    id: 'guest-saved-1',
    userId: 'guest',
    propertyId: 'prop-dorvane-residences',
    propertyTitle: "D'ORVANE Residences",
    location: 'GRA, Benin City',
    priceNgn: 120_000_000,
    createdAtLabel: 'Nov 22',
  },
];

const INITIAL_GUEST_CONVERSATIONS: ConversationRecord[] = [
  {
    id: 'guest-conv-emeka',
    userId: 'guest',
    agentId: 'agent-emeka',
    agentName: 'Emeka Okafor',
    propertyTitle: "D'ORVANE Residences",
    lastMessage: 'Welcome to ASK MIDDLEMAN. Would you like to review the GRA inspection slots?',
    updatedAtLabel: 'Today',
  },
];

const INITIAL_GUEST_MESSAGES: Record<string, ChatMessageRecord[]> = {
  'guest-conv-emeka': [
    {
      id: 'guest-msg-1',
      userId: 'guest',
      senderRole: 'agent',
      senderName: 'Emeka Okafor',
      body: "Welcome to ASK MIDDLEMAN. I oversee D'ORVANE Residences and EMMG acquisitions—let me know if you want a private tour or C of O title verification.",
      createdAtLabel: 'Today',
    },
  ],
};

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('am-theme') === 'dark';
  });

  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [activeSection, setActiveSection] = useState<NavSectionId>('home');
  const [currency, setCurrency] = useState<CurrencyCode>('NGN');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [explorerViewMode, setExplorerViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [modalProperty, setModalProperty] = useState<PropertyListing | null>(null);

  const [calcProperty, setCalcProperty] = useState<PropertyListing>(PROPERTIES[0]);
  const [calcInput, setCalcInput] = useState<MortgageInput>({
    propertyPriceNgn: PROPERTIES[0].priceNgn,
    downPaymentPercent: 25,
    annualInterestRate: 12,
    loanTermYears: 15,
    annualYieldPercent: PROPERTIES[0].annualYieldPercent,
    annualMaintenancePercent: 1.5,
  });

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Guest / Cloud Portal State
  const [guestApplications, setGuestApplications] =
    useState<ApplicationRecord[]>(INITIAL_GUEST_APPLICATIONS);
  const [guestSearches, setGuestSearches] =
    useState<SavedSearchRecord[]>(INITIAL_GUEST_SEARCHES);
  const [guestSavedProperties, setGuestSavedProperties] = useState<SavedPropertyRecord[]>(
    INITIAL_GUEST_SAVED_PROPERTIES
  );
  const [guestConversations, setGuestConversations] = useState<ConversationRecord[]>(
    INITIAL_GUEST_CONVERSATIONS
  );
  const [guestMessages, setGuestMessages] =
    useState<Record<string, ChatMessageRecord[]>>(INITIAL_GUEST_MESSAGES);

  const [cloudApplications, setCloudApplications] = useState<ApplicationRecord[]>([]);
  const [cloudSearches, setCloudSearches] = useState<SavedSearchRecord[]>([]);
  const [cloudSavedProperties, setCloudSavedProperties] = useState<SavedPropertyRecord[]>([]);
  const [cloudConversations, setCloudConversations] = useState<ConversationRecord[]>([]);
  const [cloudMessages, setCloudMessages] = useState<ChatMessageRecord[]>([]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    'guest-conv-emeka'
  );

  // Sync Dark Mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('am-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Google Maps Quota listener
  useEffect(() => {
    const onQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  // Scroll-spy for top navigation underline
  useEffect(() => {
    const sectionIds: NavSectionId[] = ['home', 'listings', 'mortgage', 'agents', 'dashboard'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id as NavSectionId);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.35] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auth listener & User Profile sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);

      if (nextUser && nextUser.email) {
        const userRef = doc(db, 'users', nextUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: nextUser.uid,
              displayName: nextUser.displayName || 'Client',
              email: nextUser.email,
              preferredCurrency: currency,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${nextUser.uid}`);
        }
      }
    });
    return () => unsubscribe();
  }, [currency]);

  // Firestore real-time subscriptions when authenticated
  useEffect(() => {
    if (!authReady || !user) return;

    const searchesQ = query(
      collection(db, 'savedSearches'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubSearches = onSnapshot(
      searchesQ,
      (snap) => {
        setCloudSearches(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              userId: String(data.userId),
              name: String(data.name),
              query: String(data.query ?? ''),
              category: data.category,
              listingMode: data.listingMode,
              minBeds: Number(data.minBeds ?? 0),
              maxPriceNgn: Number(data.maxPriceNgn ?? 300_000_000),
              createdAtLabel: formatTimestamp(data.createdAt),
            };
          })
        );
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'savedSearches')
    );

    const savedPropsQ = query(
      collection(db, 'savedProperties'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubSavedProps = onSnapshot(
      savedPropsQ,
      (snap) => {
        setCloudSavedProperties(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              userId: String(data.userId),
              propertyId: String(data.propertyId),
              propertyTitle: String(data.propertyTitle),
              location: String(data.location),
              priceNgn: Number(data.priceNgn ?? 0),
              createdAtLabel: formatTimestamp(data.createdAt),
            };
          })
        );
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'savedProperties')
    );

    const appsQ = query(
      collection(db, 'applications'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
    const unsubApps = onSnapshot(
      appsQ,
      (snap) => {
        setCloudApplications(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              userId: String(data.userId),
              propertyId: String(data.propertyId),
              propertyTitle: String(data.propertyTitle),
              agentId: String(data.agentId),
              agentName: String(data.agentName),
              applicationType: data.applicationType,
              status: data.status,
              downPaymentPercent: Number(data.downPaymentPercent ?? 25),
              estimatedMonthlyNgn: Number(data.estimatedMonthlyNgn ?? 0),
              notes: String(data.notes ?? ''),
              createdAtLabel: formatTimestamp(data.createdAt),
              updatedAtLabel: formatTimestamp(data.updatedAt),
            };
          })
        );
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'applications')
    );

    const convsQ = query(
      collection(db, 'conversations'),
      where('userId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );
    const unsubConvs = onSnapshot(
      convsQ,
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            userId: String(data.userId),
            agentId: String(data.agentId),
            agentName: String(data.agentName),
            propertyTitle: String(data.propertyTitle ?? ''),
            lastMessage: String(data.lastMessage ?? ''),
            updatedAtLabel: formatTimestamp(data.updatedAt),
          };
        });
        setCloudConversations(list);
        if (list.length > 0) {
          setActiveConversationId((prev) =>
            prev && list.some((c) => c.id === prev) ? prev : list[0].id
          );
        }
      },
      (error) => handleFirestoreError(error, OperationType.LIST, 'conversations')
    );

    return () => {
      unsubSearches();
      unsubSavedProps();
      unsubApps();
      unsubConvs();
    };
  }, [authReady, user]);

  // Active conversation messages listener when authenticated
  useEffect(() => {
    if (!authReady || !user || !activeConversationId || activeConversationId.startsWith('guest-')) {
      return;
    }

    const msgQ = query(
      collection(db, 'conversations', activeConversationId, 'messages'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );

    const unsubMsgs = onSnapshot(
      msgQ,
      (snap) => {
        setCloudMessages(
          snap.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              userId: String(data.userId),
              senderRole: data.senderRole,
              senderName: String(data.senderName),
              body: String(data.body),
              createdAtLabel: formatTimestamp(data.createdAt),
            };
          })
        );
      },
      (error) =>
        handleFirestoreError(
          error,
          OperationType.LIST,
          `conversations/${activeConversationId}/messages`
        )
    );

    return () => unsubMsgs();
  }, [authReady, user, activeConversationId]);

  const applications = user ? cloudApplications : guestApplications;
  const savedSearches = user ? cloudSearches : guestSearches;
  const savedProperties = user ? cloudSavedProperties : guestSavedProperties;
  const conversations = user ? cloudConversations : guestConversations;
  const activeMessages = user
    ? cloudMessages
    : (activeConversationId ? guestMessages[activeConversationId] : []) ?? [];

  const scrollToSection = useCallback((sectionId: NavSectionId) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSignIn = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In error:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setActiveConversationId(guestConversations[0]?.id ?? null);
  };

  const handleToggleSaveProperty = async (property: PropertyListing) => {
    if (!user) {
      setGuestSavedProperties((prev) => {
        const exists = prev.find((p) => p.propertyId === property.id);
        if (exists) return prev.filter((p) => p.propertyId !== property.id);
        return [
          {
            id: `guest-saved-${property.id}`,
            userId: 'guest',
            propertyId: property.id,
            propertyTitle: property.title,
            location: property.location,
            priceNgn: property.priceNgn,
            createdAtLabel: 'Just now',
          },
          ...prev,
        ];
      });
      return;
    }

    const existing = cloudSavedProperties.find((p) => p.propertyId === property.id);
    if (existing) {
      try {
        await deleteDoc(doc(db, 'savedProperties', existing.id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `savedProperties/${existing.id}`);
      }
      return;
    }

    try {
      await addDoc(collection(db, 'savedProperties'), {
        userId: user.uid,
        propertyId: property.id,
        propertyTitle: property.title,
        location: property.location,
        priceNgn: property.priceNgn,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'savedProperties');
    }
  };

  const handleSaveSearch = async (name: string, activeFilters: SearchFilters) => {
    if (!user) {
      setGuestSearches((prev) => [
        {
          id: `guest-search-${Date.now()}`,
          userId: 'guest',
          name: name.slice(0, 100),
          query: activeFilters.query.slice(0, 120),
          category: activeFilters.category,
          listingMode: activeFilters.listingMode,
          minBeds: activeFilters.minBeds,
          maxPriceNgn: activeFilters.maxPriceNgn,
          createdAtLabel: 'Just now',
        },
        ...prev,
      ]);
      return;
    }

    try {
      await addDoc(collection(db, 'savedSearches'), {
        userId: user.uid,
        name: name.slice(0, 100),
        query: activeFilters.query.slice(0, 120),
        category: activeFilters.category,
        listingMode: activeFilters.listingMode,
        minBeds: activeFilters.minBeds,
        maxPriceNgn: activeFilters.maxPriceNgn,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'savedSearches');
    }
  };

  const handleDeleteSavedSearch = async (searchId: string) => {
    if (!user) {
      setGuestSearches((prev) => prev.filter((s) => s.id !== searchId));
      return;
    }
    try {
      await deleteDoc(doc(db, 'savedSearches', searchId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `savedSearches/${searchId}`);
    }
  };

  const handleSubmitApplication = async (payload: {
    property: PropertyListing;
    agent: AgentProfile;
    applicationType: ApplicationType;
    downPaymentPercent: number;
    estimatedMonthlyNgn: number;
    notes: string;
  }) => {
    if (!user) {
      setGuestApplications((prev) => [
        {
          id: `guest-app-${Date.now()}`,
          userId: 'guest',
          propertyId: payload.property.id,
          propertyTitle: payload.property.title,
          agentId: payload.agent.id,
          agentName: payload.agent.name,
          applicationType: payload.applicationType,
          status: 'Submitted',
          downPaymentPercent: payload.downPaymentPercent,
          estimatedMonthlyNgn: payload.estimatedMonthlyNgn,
          notes: payload.notes.slice(0, 600),
          createdAtLabel: 'Just now',
          updatedAtLabel: 'Just now',
        },
        ...prev,
      ]);
      return;
    }

    try {
      await addDoc(collection(db, 'applications'), {
        userId: user.uid,
        propertyId: payload.property.id,
        propertyTitle: payload.property.title,
        agentId: payload.agent.id,
        agentName: payload.agent.name,
        applicationType: payload.applicationType,
        status: 'Submitted',
        downPaymentPercent: payload.downPaymentPercent,
        estimatedMonthlyNgn: payload.estimatedMonthlyNgn,
        notes: payload.notes.slice(0, 600),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'applications');
    }
  };

  const handleAdvanceApplication = async (appId: string) => {
    const target = applications.find((a) => a.id === appId);
    if (!target) return;
    const nextStatus = getNextApplicationStage(target.status);
    if (!nextStatus) return;

    if (!user) {
      setGuestApplications((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status: nextStatus, updatedAtLabel: 'Just now' } : a
        )
      );
      return;
    }

    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${appId}`);
    }
  };

  const handleWithdrawApplication = async (appId: string) => {
    if (!user) {
      setGuestApplications((prev) =>
        prev.map((a) =>
          a.id === appId ? { ...a, status: 'Withdrawn', updatedAtLabel: 'Just now' } : a
        )
      );
      return;
    }

    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: 'Withdrawn',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${appId}`);
    }
  };

  const handleStartChatWithAgent = async (
    agent: AgentProfile,
    property?: PropertyListing
  ) => {
    const propertyTitle = property?.title ?? `${agent.specialty}`;

    if (!user) {
      const existing = guestConversations.find((c) => c.agentId === agent.id);
      if (existing) {
        setActiveConversationId(existing.id);
      } else {
        const newId = `guest-conv-${agent.id}`;
        setGuestConversations((prev) => [
          {
            id: newId,
            userId: 'guest',
            agentId: agent.id,
            agentName: agent.name,
            propertyTitle,
            lastMessage: `Connected with ${agent.name}.`,
            updatedAtLabel: 'Just now',
          },
          ...prev,
        ]);
        setGuestMessages((prev) => ({
          ...prev,
          [newId]: [
            {
              id: `guest-msg-init-${Date.now()}`,
              userId: 'guest',
              senderRole: 'agent',
              senderName: agent.name,
              body: `Hello, I'm ${agent.name} (${agent.role}). How can I assist you with ${propertyTitle}?`,
              createdAtLabel: 'Just now',
            },
          ],
        }));
        setActiveConversationId(newId);
      }
      setModalProperty(null);
      scrollToSection('agents');
      setTimeout(() => {
        document.getElementById('messaging-workspace')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }

    const existingCloud = cloudConversations.find((c) => c.agentId === agent.id);
    if (existingCloud) {
      setActiveConversationId(existingCloud.id);
    } else {
      try {
        const convRef = await addDoc(collection(db, 'conversations'), {
          userId: user.uid,
          agentId: agent.id,
          agentName: agent.name,
          propertyTitle,
          lastMessage: `Connected with ${agent.name}.`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        await addDoc(collection(db, 'conversations', convRef.id, 'messages'), {
          userId: user.uid,
          senderRole: 'agent',
          senderName: agent.name,
          body: `Hello, I'm ${agent.name}. Ask me anything about ${propertyTitle}, title verification, or viewings.`,
          createdAt: serverTimestamp(),
        });
        setActiveConversationId(convRef.id);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'conversations');
      }
    }

    setModalProperty(null);
    scrollToSection('agents');
  };

  const handleSendMessage = async (conversationId: string, body: string) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const replyBody = `Thanks for reaching out about ${conv.propertyTitle}. I have logged your request ("${body.slice(0, 60)}${body.length > 60 ? '...' : ''}") and can confirm viewing slots and title documents are ready for review.`;

    if (!user) {
      const clientMsg: ChatMessageRecord = {
        id: `guest-msg-${Date.now()}`,
        userId: 'guest',
        senderRole: 'client',
        senderName: 'You',
        body,
        createdAtLabel: 'Just now',
      };
      setGuestMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] ?? []), clientMsg],
      }));
      setGuestConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, lastMessage: body, updatedAtLabel: 'Just now' } : c
        )
      );

      setTimeout(() => {
        const agentMsg: ChatMessageRecord = {
          id: `guest-reply-${Date.now()}`,
          userId: 'guest',
          senderRole: 'agent',
          senderName: conv.agentName,
          body: replyBody,
          createdAtLabel: 'Just now',
        };
        setGuestMessages((prev) => ({
          ...prev,
          [conversationId]: [...(prev[conversationId] ?? []), agentMsg],
        }));
        setGuestConversations((prev) =>
          prev.map((c) =>
            c.id === conversationId
              ? { ...c, lastMessage: replyBody.slice(0, 120), updatedAtLabel: 'Just now' }
              : c
          )
        );
      }, 450);
      return;
    }

    try {
      await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
        userId: user.uid,
        senderRole: 'client',
        senderName: user.displayName || 'Client',
        body: body.slice(0, 1000),
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: body.slice(0, 300),
        updatedAt: serverTimestamp(),
      });
      setTimeout(async () => {
        try {
          await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
            userId: user.uid,
            senderRole: 'agent',
            senderName: conv.agentName,
            body: replyBody.slice(0, 1000),
            createdAt: serverTimestamp(),
          });
        } catch {
          // Ignore delayed auto-reply if user signed out
        }
      }, 500);
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.CREATE,
        `conversations/${conversationId}/messages`
      );
    }
  };

  const handleOpenCalculatorForProperty = (property: PropertyListing) => {
    setModalProperty(null);
    setCalcProperty(property);
    setCalcInput((prev) => ({
      ...prev,
      propertyPriceNgn: property.priceNgn,
      annualYieldPercent: property.annualYieldPercent,
    }));
    scrollToSection('mortgage');
  };

  const savedPropertyIds = savedProperties.map((p) => p.propertyId);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f1ec] dark:bg-[#0e0d0b] text-[#141210] dark:text-[#f4f1ec]">
      {/* Demo Key Quota Banner (Google Maps Platform Case A) */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenTalk={() => handleStartChatWithAgent(AGENTS[0], PROPERTIES[0])}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
      />

      <main className="flex-1">
        <HeroSection
          onExploreListings={() => scrollToSection('listings')}
          onOpenMapView={() => {
            setExplorerViewMode('map');
            scrollToSection('listings');
          }}
          onOpenCalculator={() => scrollToSection('mortgage')}
          onOpenDashboard={() => scrollToSection('dashboard')}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          userDisplayName={user?.displayName ?? null}
        />

        <FeaturedShowcase
          properties={PROPERTIES}
          currency={currency}
          onSelectProperty={(p) => setModalProperty(p)}
          onViewAll={() => {
            setExplorerViewMode('split');
            scrollToSection('listings');
          }}
        />

        <ListingsExplorer
          properties={PROPERTIES}
          filters={filters}
          onFiltersChange={setFilters}
          currency={currency}
          onCurrencyChange={setCurrency}
          savedPropertyIds={savedPropertyIds}
          onToggleSaveProperty={handleToggleSaveProperty}
          onSelectProperty={(p) => setModalProperty(p)}
          onCalculateProperty={handleOpenCalculatorForProperty}
          onSaveSearch={handleSaveSearch}
          viewMode={explorerViewMode}
          onViewModeChange={setExplorerViewMode}
          quotaExceeded={quotaExceeded}
        />

        <MortgageCalculator
          properties={PROPERTIES}
          selectedProperty={calcProperty}
          onSelectProperty={(property) => {
            setCalcProperty(property);
            setCalcInput((prev) => ({
              ...prev,
              propertyPriceNgn: property.priceNgn,
              annualYieldPercent: property.annualYieldPercent,
            }));
          }}
          input={calcInput}
          onChangeInput={setCalcInput}
          currency={currency}
          onCurrencyChange={setCurrency}
          onApplyWithTerms={async ({ property, downPaymentPercent, estimatedMonthlyNgn }) => {
            const agent = AGENTS.find((a) => a.id === property.agentId) ?? AGENTS[0];
            await handleSubmitApplication({
              property,
              agent,
              applicationType: 'Purchase Financing',
              downPaymentPercent,
              estimatedMonthlyNgn,
              notes: `Submitted via Mortgage Planner (${downPaymentPercent}% down, ${calcInput.loanTermYears}yr term at ${calcInput.annualInterestRate}% p.a.).`,
            });
            scrollToSection('dashboard');
          }}
        />

        <AgentsAndMessaging
          agents={AGENTS}
          conversations={conversations}
          activeConversationId={activeConversationId}
          messages={activeMessages}
          onSelectConversation={setActiveConversationId}
          onStartChatWithAgent={(agent) => handleStartChatWithAgent(agent)}
          onSendMessage={handleSendMessage}
        />

        <ClientDashboard
          user={
            user
              ? { uid: user.uid, displayName: user.displayName, email: user.email }
              : null
          }
          authLoading={authLoading}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          applications={applications}
          savedSearches={savedSearches}
          savedProperties={savedProperties}
          properties={PROPERTIES}
          currency={currency}
          onAdvanceApplication={handleAdvanceApplication}
          onWithdrawApplication={handleWithdrawApplication}
          onApplySavedSearch={(saved) => {
            setFilters({
              ...DEFAULT_FILTERS,
              query: saved.query,
              category: saved.category,
              listingMode: saved.listingMode,
              minBeds: saved.minBeds,
              maxPriceNgn: saved.maxPriceNgn,
            });
            scrollToSection('listings');
          }}
          onDeleteSavedSearch={handleDeleteSavedSearch}
          onOpenPropertyById={(id) => {
            const found = PROPERTIES.find((p) => p.id === id);
            if (found) setModalProperty(found);
          }}
          onRemoveSavedProperty={async (savedId) => {
            if (!user) {
              setGuestSavedProperties((prev) => prev.filter((p) => p.id !== savedId));
              return;
            }
            try {
              await deleteDoc(doc(db, 'savedProperties', savedId));
            } catch (error) {
              handleFirestoreError(error, OperationType.DELETE, `savedProperties/${savedId}`);
            }
          }}
        />

        <BrandsAndInsights
          onExploreListings={() => {
            setFilters(DEFAULT_FILTERS);
            scrollToSection('listings');
          }}
          onFilterShortlets={() => {
            setFilters({ ...DEFAULT_FILTERS, category: 'Shortlet Suite' });
            scrollToSection('listings');
          }}
          onOpenTalk={() => handleStartChatWithAgent(AGENTS[0], PROPERTIES[0])}
        />
      </main>

      <PropertyDetailModal
        property={modalProperty}
        agent={AGENTS.find((a) => a.id === modalProperty?.agentId)}
        currency={currency}
        isSaved={modalProperty ? savedPropertyIds.includes(modalProperty.id) : false}
        onClose={() => setModalProperty(null)}
        onToggleSave={handleToggleSaveProperty}
        onOpenCalculator={handleOpenCalculatorForProperty}
        onMessageAgent={(agent, property) => handleStartChatWithAgent(agent, property)}
        onSubmitApplication={handleSubmitApplication}
      />
    </div>
  );
}
