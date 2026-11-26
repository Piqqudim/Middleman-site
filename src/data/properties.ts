export type PropertyCategory =
  | 'Luxury Apartment'
  | 'Villa & Home'
  | 'Shortlet Suite'
  | 'Commercial Land';

export type ListingMode = 'For Sale' | 'Shortlet' | 'Investment';

export interface PropertyListing {
  id: string;
  title: string;
  subtitle: string;
  category: PropertyCategory;
  listingMode: ListingMode;
  location: string;
  district: string;
  priceNgn: number;
  priceLabel: string;
  beds: number;
  baths: number;
  sqm: number;
  annualYieldPercent: number;
  image: string;
  featuredRank?: 1 | 2 | 3;
  lat: number;
  lng: number;
  agentId: string;
  amenities: string[];
  description: string;
  titleDocument: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  specialty: string;
  locationFocus: string;
  activeListings: number;
  responseTime: string;
  yearsExperience: number;
  avatar: string;
  bio: string;
  verifiedLicense: string;
}

export interface InsightArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  excerpt: string;
  paragraphs: string[];
}

export const HERO_INTERIOR_IMAGE = '/src/assets/images/hero_luxury_interior_1795670873129.jpg';

export const AGENTS: AgentProfile[] = [
  {
    id: 'agent-emeka',
    name: 'Emeka Okafor',
    role: 'Principal Broker & Investment Lead',
    specialty: 'Luxury Villas & Institutional Acquisitions',
    locationFocus: 'GRA Benin & Ikoyi Lagos',
    activeListings: 14,
    responseTime: 'Under 10 mins',
    yearsExperience: 11,
    avatar: '/src/assets/images/agent_principal_emeka_1795670875021.jpg',
    bio: 'Advises private wealth buyers and diaspora investors on verified title acquisitions, off-plan structuring, and high-yield residential portfolios across Edo and Lagos states.',
    verifiedLicense: 'REDAN-EDO-0419',
  },
  {
    id: 'agent-amara',
    name: 'Amara Nwosu',
    role: 'Head of Luxury Shortlets & Suites',
    specialty: "D'ORVANE Suites & Serviced Apartments",
    locationFocus: 'GRA Benin & Victoria Island',
    activeListings: 19,
    responseTime: 'Under 5 mins',
    yearsExperience: 8,
    avatar: '/src/assets/images/agent_advisor_amara_1795670875460.jpg',
    bio: "Curates turnkey serviced residences and corporate shortlet yields for executives, managing occupancy optimization and D'ORVANE hospitality standards.",
    verifiedLicense: 'LASRERA-0892',
  },
  {
    id: 'agent-tunde',
    name: 'Tunde Adeyemi',
    role: 'Senior Land & Commercial Advisor',
    specialty: 'Titled Commercial Plots & Mixed-Use',
    locationFocus: 'Uselu Benin & Maitama Abuja',
    activeListings: 11,
    responseTime: 'Under 15 mins',
    yearsExperience: 9,
    avatar: '/src/assets/images/agent_principal_emeka_1795670875021.jpg',
    bio: 'Specializes in Governor Consent & Certificate of Occupancy verification, land banking feasibility, and commercial retail joint ventures.',
    verifiedLicense: 'NIESV-3104',
  },
  {
    id: 'agent-chidinma',
    name: 'Chidinma Eze',
    role: 'Mortgage & Title Structuring Advisor',
    specialty: 'Flexible Payment Plans & Diaspora Mortgages',
    locationFocus: 'Benin City, Lagos & Abuja',
    activeListings: 8,
    responseTime: 'Under 12 mins',
    yearsExperience: 7,
    avatar: '/src/assets/images/agent_advisor_amara_1795670875460.jpg',
    bio: 'Guides buyers through pre-qualification, NHF and commercial mortgage structuring, escrow milestones, and closing documentation.',
    verifiedLicense: 'MBAN-1178',
  },
];

export const PROPERTIES: PropertyListing[] = [
  {
    id: 'prop-dorvane-residences',
    title: "D'ORVANE Residences",
    subtitle: 'Luxury Apartments · Benin',
    category: 'Luxury Apartment',
    listingMode: 'For Sale',
    location: 'GRA, Benin City',
    district: 'Benin City',
    priceNgn: 120_000_000,
    priceLabel: 'From ₦120M',
    beds: 4,
    baths: 5,
    sqm: 480,
    annualYieldPercent: 11.4,
    image: '/src/assets/images/prop_dorvane_residences_1795670873958.jpg',
    featuredRank: 1,
    lat: 6.3176,
    lng: 5.6145,
    agentId: 'agent-emeka',
    amenities: ['Infinity Pool', 'Smart Home', '24/7 Power', 'Gated Security'],
    description:
      "Flagship D'ORVANE glass-and-concrete residences in Benin City's most secluded GRA enclave. Designed for generational living and strong capital appreciation with private pool deck, double-volume living gallery, and automated climate control.",
    titleDocument: 'Certificate of Occupancy (C of O)',
  },
  {
    id: 'prop-emmg-apartments',
    title: 'EMMG Luxury Apartments',
    subtitle: 'GRA, Benin',
    category: 'Luxury Apartment',
    listingMode: 'Investment',
    location: 'GRA, Benin City',
    district: 'Benin City',
    priceNgn: 85_000_000,
    priceLabel: 'From ₦85M',
    beds: 3,
    baths: 3,
    sqm: 265,
    annualYieldPercent: 13.2,
    image: '/src/assets/images/prop_emmg_apartments_1795670873687.jpg',
    featuredRank: 2,
    lat: 6.3265,
    lng: 5.6295,
    agentId: 'agent-amara',
    amenities: ['Concierge', '24/7 Power', 'Gated Security', 'Private Terrace'],
    description:
      'Boutique four-story stone residences curated by EMMG with deep Juliet balconies, dedicated 24-hour power microgrid, and turnkey corporate leasing management.',
    titleDocument: 'Governor Consent & Registered Deed',
  },
  {
    id: 'prop-premium-homes',
    title: 'Premium Homes',
    subtitle: 'Uselu, Benin',
    category: 'Villa & Home',
    listingMode: 'For Sale',
    location: 'Uselu, Benin City',
    district: 'Benin City',
    priceNgn: 96_000_000,
    priceLabel: '₦96M',
    beds: 4,
    baths: 4,
    sqm: 390,
    annualYieldPercent: 9.8,
    image: '/src/assets/images/prop_premium_homes_1795670874568.jpg',
    featuredRank: 3,
    lat: 6.3642,
    lng: 5.6114,
    agentId: 'agent-tunde',
    amenities: ['Smart Home', 'Gated Security', 'Private Terrace', 'Solar Hybrid'],
    description:
      'Architectural stone-clad duplexes featuring cantilevered glass terraces, landscaped stone courtyard, and family-ready layout minutes from Benin City commercial corridors.',
    titleDocument: 'Certificate of Occupancy (C of O)',
  },
  {
    id: 'prop-dorvane-suites-vi',
    title: "D'ORVANE Penthouse Suite",
    subtitle: 'Serviced Shortlet · Victoria Island',
    category: 'Shortlet Suite',
    listingMode: 'Shortlet',
    location: 'Victoria Island, Lagos',
    district: 'Lagos',
    priceNgn: 145_000_000,
    priceLabel: '₦145M',
    beds: 3,
    baths: 4,
    sqm: 310,
    annualYieldPercent: 15.6,
    image: '/src/assets/images/prop_penthouse_suite_1795670874589.jpg',
    lat: 6.4281,
    lng: 3.4219,
    agentId: 'agent-amara',
    amenities: ['Concierge', 'Smart Home', '24/7 Power', 'Private Terrace'],
    description:
      "Turnkey D'ORVANE Suites sky-lounge residence featuring travertine fireplace, bespoke walnut millwork, and verified 78% annual executive shortlet occupancy.",
    titleDocument: 'Governor Consent',
  },
  {
    id: 'prop-emmg-ikoyi-terrace',
    title: 'EMMG Courtyard Residences',
    subtitle: 'Ikoyi, Lagos',
    category: 'Villa & Home',
    listingMode: 'For Sale',
    location: 'Old Ikoyi, Lagos',
    district: 'Lagos',
    priceNgn: 260_000_000,
    priceLabel: '₦260M',
    beds: 5,
    baths: 6,
    sqm: 610,
    annualYieldPercent: 10.5,
    image: '/src/assets/images/hero_luxury_interior_1795670873129.jpg',
    lat: 6.4549,
    lng: 3.4346,
    agentId: 'agent-emeka',
    amenities: ['Infinity Pool', 'Smart Home', '24/7 Power', 'Gated Security'],
    description:
      'Private compound residence in Old Ikoyi engineered with acoustic glazing, private cinema lounge, staff quarters, and institutional-grade security perimeter.',
    titleDocument: 'Federal Certificate of Occupancy',
  },
  {
    id: 'prop-maitama-skyline',
    title: 'Middleman Commercial Axis',
    subtitle: 'Mixed-Use Tower · Maitama',
    category: 'Commercial Land',
    listingMode: 'Investment',
    location: 'Maitama, Abuja',
    district: 'Abuja',
    priceNgn: 190_000_000,
    priceLabel: '₦190M',
    beds: 2,
    baths: 3,
    sqm: 850,
    annualYieldPercent: 14.1,
    image: '/src/assets/images/prop_commercial_tower_1795670875257.jpg',
    lat: 9.0882,
    lng: 7.4934,
    agentId: 'agent-tunde',
    amenities: ['24/7 Power', 'Gated Security', 'Concierge'],
    description:
      'Prime corner mixed-use investment allocation in Maitama with pre-approved commercial floor plates, embassy-corridor access, and flexible 24-month milestone structure.',
    titleDocument: 'FCDA Right of Occupancy & Building Plan',
  },
  {
    id: 'prop-ihama-shortlet',
    title: "D'ORVANE Garden Studios",
    subtitle: 'Shortlet Suites · Ihama GRA',
    category: 'Shortlet Suite',
    listingMode: 'Shortlet',
    location: 'Ihama Road, GRA Benin',
    district: 'Benin City',
    priceNgn: 58_000_000,
    priceLabel: '₦58M',
    beds: 2,
    baths: 2,
    sqm: 155,
    annualYieldPercent: 14.8,
    image: '/src/assets/images/prop_emmg_apartments_1795670873687.jpg',
    lat: 6.3045,
    lng: 5.6248,
    agentId: 'agent-chidinma',
    amenities: ['24/7 Power', 'Gated Security', 'Solar Hybrid'],
    description:
      'High-yield two-bedroom serviced apartments along Ihama Road tailored for diaspora investors seeking passive monthly cashflow and hassle-free hospitality management.',
    titleDocument: 'Certificate of Occupancy (C of O)',
  },
  {
    id: 'prop-airport-corridor-land',
    title: 'Airport Road Estate Plot',
    subtitle: 'Titled Investment Land · Benin',
    category: 'Commercial Land',
    listingMode: 'Investment',
    location: 'Airport Road, Benin City',
    district: 'Benin City',
    priceNgn: 45_000_000,
    priceLabel: '₦45M',
    beds: 0,
    baths: 0,
    sqm: 1000,
    annualYieldPercent: 16.5,
    image: '/src/assets/images/prop_commercial_tower_1795670875257.jpg',
    lat: 6.3185,
    lng: 5.5925,
    agentId: 'agent-tunde',
    amenities: ['Gated Security'],
    description:
      'Dry, perimeter-fenced 1,000 sqm corner plot inside a serviced luxury gated layout five minutes from Benin Airport, cleared for immediate residential or boutique commercial development.',
    titleDocument: 'Survey Plan & Certificate of Occupancy',
  },
];

export const INSIGHTS: InsightArticle[] = [
  {
    id: 'insight-land-benin',
    title: '5 Things to Check Before Buying Land in Benin',
    date: 'Nov 14, 2025',
    category: 'Due Diligence',
    readTime: '4 min read',
    image: '/src/assets/images/prop_commercial_tower_1795670875257.jpg',
    excerpt:
      'From EdoGIS survey charting to verifying Community Development Association (CDA) clearances, here is the checklist that protects capital.',
    paragraphs: [
      'Acquiring prime land in Benin City—whether in GRA, Ihama, Uselu, or the Airport Road corridor—rewards disciplined due diligence long before a deposit is wired. Always begin by requesting the registered survey plan coordinates and running an independent charting check at the Edo State Geographic Information Service (EdoGIS) to confirm the parcel sits outside government acquisition or setback corridors.',
      'Second, verify root of title and family or community lineage consent. Even where a Certificate of Occupancy is presented, confirming there are no pending encumbrances, caveats, or overlapping allocations eliminates post-closing friction.',
      'Finally, align physical inspection with drainage topography during peak rainfall, confirm power transformer proximity, and route every tranche through a documented milestone escrow agreement backed by a verified broker.',
    ],
  },
  {
    id: 'insight-new-luxury',
    title: 'The New Luxury: Space, Privacy, Class',
    date: 'Nov 10, 2025',
    category: 'Architecture & Living',
    readTime: '5 min read',
    image: '/src/assets/images/prop_penthouse_suite_1795670874589.jpg',
    excerpt:
      'Why discerning homeowners are trading ornate excess for acoustic serenity, travertine warmth, and self-sustaining smart infrastructure.',
    paragraphs: [
      'Modern luxury real estate across West Africa has quietly shifted away from ostentatious facades toward architectural calm. Discerning buyers now prioritize spatial proportion, natural cross-ventilation, solar-hybrid energy independence, and double-glazed acoustic privacy.',
      "Across D'ORVANE Residences and EMMG developments, every floor plan balances entertaining volume with private sanctuary suites—combining warm natural stone, matte bronze hardware, and discreet home automation that endures across decades.",
    ],
  },
  {
    id: 'insight-smart-apartments',
    title: 'Why Apartments are the Smart Investment',
    date: 'Nov 05, 2025',
    category: 'Wealth Strategy',
    readTime: '4 min read',
    image: '/src/assets/images/prop_emmg_apartments_1795670873687.jpg',
    excerpt:
      'Comparing net rental yields, maintenance ratios, and shortlet occupancy between boutique apartment blocks and standalone estates.',
    paragraphs: [
      'For investors prioritizing predictable cashflow alongside capital appreciation, well-located 2- and 3-bedroom luxury apartments consistently outperform oversized single dwellings on net annual yield. Lower shared facility overhead, stronger corporate tenant demand, and shortlet flexibility keep occupancy resilient year-round.',
      'By pairing mortgage leverage with a 30%–40% equity down payment in growth districts like GRA Benin or Victoria Island, investors capture both rental yield coverage and long-term inflation-hedged asset appreciation.',
    ],
  },
];
