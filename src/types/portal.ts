import type { ListingMode, PropertyCategory } from '../data/properties';
import type { ApplicationStatus, ApplicationType } from '../utils/applications';

export interface SavedSearchRecord {
  id: string;
  userId: string;
  name: string;
  query: string;
  category: 'All' | PropertyCategory;
  listingMode: 'All' | ListingMode;
  minBeds: number;
  maxPriceNgn: number;
  createdAtLabel: string;
}

export interface SavedPropertyRecord {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  location: string;
  priceNgn: number;
  createdAtLabel: string;
}

export interface ApplicationRecord {
  id: string;
  userId: string;
  propertyId: string;
  propertyTitle: string;
  agentId: string;
  agentName: string;
  applicationType: ApplicationType;
  status: ApplicationStatus;
  downPaymentPercent: number;
  estimatedMonthlyNgn: number;
  notes: string;
  createdAtLabel: string;
  updatedAtLabel: string;
}

export interface ConversationRecord {
  id: string;
  userId: string;
  agentId: string;
  agentName: string;
  propertyTitle: string;
  lastMessage: string;
  updatedAtLabel: string;
}

export interface ChatMessageRecord {
  id: string;
  userId: string;
  senderRole: 'client' | 'agent';
  senderName: string;
  body: string;
  createdAtLabel: string;
}
