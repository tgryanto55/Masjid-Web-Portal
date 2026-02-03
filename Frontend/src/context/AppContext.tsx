import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppState, PrayerTime, Event, AboutContent, Transaction, DonationInfo, ContactInfo } from '../types';
import { prayerTimeService, eventService, financeService, donationService, contactService } from '../services/api';

interface AppContextType {
  state: AppState;
  updatePrayerTime: (id: string | number, time: string) => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string | number) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string | number) => Promise<void>;
  updateDonationInfo: (info: DonationInfo) => Promise<void>;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
  updateAbout: (content: AboutContent) => void;
  isLoading: boolean;
}

const defaultDonationInfo: DonationInfo = {
  bankName: 'Bank Syariah Indonesia (BSI)',
  accountNumber: '1234 5678 90',
  accountName: 'DKM Masjid Raya',
  confirmationPhone: '+62 812-3456-7890',
  qrisImage: ''
};

const defaultContactInfo: ContactInfo = {
    address: 'Jl. Ahmad Yani No. 123, Kota Sejahtera, Indonesia 40123',
    mapEmbedLink: '',
    phone: '+62 812-3456-7890',
    email: 'info@masjidraya.com',
    operationalHours: 'Senin - Minggu: 08:00 - 20:00 WIB',
    facebook: '',
    instagram: '',
    youtube: ''
};

const defaultState: AppState = {
  prayerTimes: [],
  events: [],
  transactions: [],
  donationInfo: defaultDonationInfo,
  contactInfo: defaultContactInfo,
  about: {
    history: 'Masjid Raya didirikan pada tahun 1990 sebagai pusat kegiatan ibadah dan sosial masyarakat setempat.',
    vision: 'Menjadi pusat peradaban Islam yang memakmurkan masjid.',
    mission: 'Menyelenggarakan ibadah sholat berjamaah yang khusyuk.'
  }
};

// Data Cadangan jika Server Offline
const fallbackPrayerTimes: PrayerTime[] = [
  { id: 1, name: 'Subuh', time: '04:30' },
  { id: 2, name: 'Dzuhur', time: '12:00' },
  { id: 3, name: 'Ashar', time: '15:15' },
  { id: 4, name: 'Maghrib', time: '18:00' },
  { id: 5, name: 'Isya', time: '19:15' },
];

const fallbackEvents: Event[] = [
  {
    id: 1,
    title: 'Kajian Rutin Sabtu (Offline Mode)',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    description: 'Data ini muncul karena server backend tidak terjangkau. Silakan nyalakan server.',
    image: 'https://images.unsplash.com/photo-1542359489-35a165b4c514?q=80&w=1000'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi internal untuk mengambil ulang data events saja
  const refetchEvents = async () => {
    try {
      const events = await eventService.getAll();
      setState(prev => ({ ...prev, events }));
    } catch (error) {
      console.error("Failed to refetch events", error);
    }
  };

  // Fetch Data dari Backend
  useEffect(() => {
    // Fungsi fetch data yang bisa dipanggil ulang
    const fetchData = async (isBackground = false) => {
      if (!isBackground) setIsLoading(true); // Tampilkan loading hanya saat load pertama

      try {
        const [prayers, events, transactions, donationInfo, contactInfo] = await Promise.all([
          prayerTimeService.getAll(),
          eventService.getAll(),
          financeService.getAll().catch(() => []), // Handle jika finance gagal terpisah
          donationService.get().catch(() => defaultDonationInfo),
          contactService.get().catch(() => defaultContactInfo)
        ]);
        
        setState(prev => ({
          ...prev,
          prayerTimes: prayers,
          events: events,
          transactions: transactions,
          donationInfo: donationInfo || defaultDonationInfo,
          contactInfo: contactInfo || defaultContactInfo
        }));
      } catch (error: any) {
        // Handle error gracefully
        if (!isBackground) {
            const isNetworkError = error.message === 'Network Error' || error.code === 'ERR_NETWORK';
            if (isNetworkError) {
                console.warn("Server tidak terjangkau (Offline Mode). Menggunakan data cadangan.");
            } else {
                console.error("Gagal mengambil data awal:", error);
            }
          
          setState(prev => ({
            ...prev,
            prayerTimes: fallbackPrayerTimes,
            events: fallbackEvents,
            transactions: [],
            donationInfo: defaultDonationInfo,
            contactInfo: defaultContactInfo
          }));
        } else {
          // Silent fail for background polling
        }
      } finally {
        if (!isBackground) setIsLoading(false);
      }
    };

    // 1. Jalankan fetch pertama kali
    fetchData();

    // 2. Setup Polling: Jalankan fetch setiap 5 detik
    const intervalId = setInterval(() => {
      fetchData(true); // true = background mode (silent update)
    }, 5000); 

    // 3. Cleanup interval saat component unmount
    return () => clearInterval(intervalId);
  }, []);

  const updatePrayerTime = async (id: string | number, time: string) => {
    try {
      await prayerTimeService.update(id, time);
      setState(prev => ({
        ...prev,
        prayerTimes: prev.prayerTimes.map(pt => pt.id === id ? { ...pt, time } : pt)
      }));
    } catch (error) {
      console.error("Failed to update prayer time", error);
      alert("Gagal mengupdate jadwal sholat (Server Offline?)");
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      await eventService.create(eventData);
      // Refresh list agar pasti sinkron dengan database
      await refetchEvents();
    } catch (error) {
      console.error("Failed to create event", error);
      throw error; // Lempar error agar form tau kalau gagal
    }
  };

  const updateEvent = async (updatedEvent: Event) => {
    try {
        await eventService.update(updatedEvent);
        // FIX: Re-fetch semua data events setelah update.
        // Ini mencegah masalah ketidakcocokan tipe ID (string vs number) di state lokal
        // yang menyebabkan tampilan 'reset' ke data lama.
        await refetchEvents();
    } catch (error) {
        console.error("Failed to update event", error);
        throw error;
    }
  };

  const deleteEvent = async (id: string | number) => {
    try {
      await eventService.delete(id);
      // Refresh list agar sinkron
      await refetchEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
      alert("Gagal menghapus kegiatan (Server Offline?)");
    }
  };

  // --- Finance Functions ---
  const addTransaction = async (data: Omit<Transaction, 'id'>) => {
    try {
        const newTrans = await financeService.create(data);
        setState(prev => ({
            ...prev,
            transactions: [newTrans, ...prev.transactions]
        }));
    } catch (error) {
        console.error("Failed to add transaction", error);
        alert("Gagal menyimpan transaksi");
    }
  };

  const deleteTransaction = async (id: string | number) => {
    try {
        await financeService.delete(id);
        setState(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== id)
        }));
    } catch (error) {
        console.error("Failed to delete transaction", error);
        alert("Gagal menghapus transaksi");
    }
  };

  // --- Donation Info ---
  const updateDonationInfo = async (info: DonationInfo) => {
    try {
        const updated = await donationService.update(info);
        setState(prev => ({
            ...prev,
            donationInfo: updated
        }));
    } catch (error) {
        console.error("Failed to update donation info", error);
        alert("Gagal mengupdate info donasi");
    }
  };

    // --- Contact Info ---
    const updateContactInfo = async (info: ContactInfo) => {
        try {
            const updated = await contactService.update(info);
            setState(prev => ({
                ...prev,
                contactInfo: updated
            }));
        } catch (error) {
            console.error("Failed to update contact info", error);
            alert("Gagal mengupdate info kontak");
            throw error;
        }
    };

  const updateAbout = (content: AboutContent) => {
    setState(prev => ({
      ...prev,
      about: content
    }));
  };

  return (
    <AppContext.Provider value={{ 
        state, 
        updatePrayerTime, 
        addEvent, 
        updateEvent, 
        deleteEvent, 
        addTransaction, 
        deleteTransaction, 
        updateDonationInfo,
        updateContactInfo,
        updateAbout, 
        isLoading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};