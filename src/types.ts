export interface FamilyMember {
  role: string;
  name: string;
  note?: string;
}

export interface FamilyInfo {
  familyName: string;
  parents: string;
  grandparents?: string;
  residence: string;
  welcomeMessage: string;
  additionalMembers?: FamilyMember[];
}

export interface CouplePerson {
  fullName: string;
  callingName: string;
  title: string; // e.g. "The Groom"
  bio: string;
  parents: string;
  educationOrProfession?: string;
  photoUrl: string;
  instagramOrContact?: string;
}

export interface StoryMilestone {
  id: string;
  yearOrPhase: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  dressCode?: string;
  description: string;
  badge?: string;
  iconType: 'ring' | 'heart' | 'sparkles' | 'music' | 'camera' | 'palace';
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category?: string;
}

export interface ThemeColors {
  primaryMaroon: string;
  accentGold: string;
  creamBg: string;
  darkMaroon: string;
  softCream: string;
  textColor: string;
  goldShimmer: string;
}

export type FontFamilyChoice = 'cormorant' | 'playfair' | 'cinzel' | 'amiri';

export interface ThemeConfig {
  presetName: string;
  colors: ThemeColors;
  fontFamily: FontFamilyChoice;
  enableBismillah: boolean;
  enableIslamicVerse: boolean;
  enableFloralBorders: boolean;
  bismillahText: string;
  verseTextArabic: string;
  verseTranslation: string;
  verseReference: string;
}

export interface RsvpResponse {
  id: string;
  name: string;
  emailOrPhone: string;
  attendingStatus: 'attending' | 'declined';
  guestsCount: number;
  attendingEvents: string[];
  dietaryOrNotes?: string;
  duaOrMessage?: string;
  submittedAt: string;
}

export interface BankAccountDetail {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  branchName?: string;
  ifscOrSwiftCode?: string;
  iban?: string;
  routingOrSortCode?: string;
  upiOrZelleId?: string;
  accountType?: string; // e.g. "Savings Account" or "Joint Checking"
  note?: string;
}

export interface RegistryLink {
  id: string;
  title: string;
  platform: string; // e.g. "Amazon", "Crate & Barrel", "Target", "Charity: Islamic Relief"
  url: string;
  registryNumber?: string;
  description?: string;
  badge?: string; // e.g. "Most Popular", "Home Essentials", "Charity Fund"
}

export interface GiftRegistryConfig {
  enabled: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  blessingMessage: string;
  enableBankTransfer: boolean;
  bankDetails: BankAccountDetail;
  enableRegistryLinks: boolean;
  registryLinks: RegistryLink[];
  enableCharityOption: boolean;
  charityName?: string;
  charityUrl?: string;
  charityDescription?: string;
}

export interface WeddingData {
  groom: CouplePerson;
  bride: CouplePerson;
  weddingDate: string; // ISO format e.g. "2026-11-20T18:00:00"
  weddingDateFormatted: string; // e.g. "Friday, 20th November 2026"
  weddingTime: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  googleMapsUrl: string;
  heroHashtag: string;
  heroSubtitle: string;
  groomFamily: FamilyInfo;
  brideFamily: FamilyInfo;
  events: WeddingEvent[];
  storyMilestones: StoryMilestone[];
  gallery: GalleryPhoto[];
  giftRegistry: GiftRegistryConfig;
  theme: ThemeConfig;
  rsvpDeadline: string;
  contactPhones: string[];
  contactEmail: string;
}
