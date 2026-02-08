export interface PrayerTime {
  id: number | string;
  name: string;
  time: string;
  isActive: boolean;
}

export interface Event {
  id: number | string;
  title: string;
  date: string;
  time: string;
  description: string;
  image?: string;
}

export interface AboutContent {
  history: string;
  vision: string;
  mission: string;
  image?: string;
}

export interface Transaction {
  id: number | string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category?: string;
}

export interface DonationInfo {
  id?: number | string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  qrisImage?: string;
  confirmationPhone: string;
}

export interface ContactInfo {
  address: string;
  mapEmbedLink: string;
  phone: string;
  email: string;
  operationalHours: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface User {
  id?: number | string;
  email: string;
  name: string;
}

export interface AppState {
  prayerTimes: PrayerTime[];
  events: Event[];
  about: AboutContent;
  transactions: Transaction[];
  donationInfo: DonationInfo;
  contactInfo: ContactInfo;
}