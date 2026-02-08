import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AppState, PrayerTime, Event, AboutContent, Transaction, DonationInfo, ContactInfo } from '../types';
import { prayerTimeService, eventService, financeService, donationService, contactService, aboutService } from '../services/api';

interface AppContextType {
  state: AppState;
  updatePrayerTime: (id: string | number, time?: string, isActive?: boolean) => Promise<void>;
  addEvent: (event: Omit<Event, 'id'> | FormData) => Promise<void>;
  updateEvent: (event: Event | FormData) => Promise<void>;
  deleteEvent: (id: string | number) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string | number) => Promise<void>;
  updateDonationInfo: (info: DonationInfo) => Promise<void>;
  updateContactInfo: (info: ContactInfo) => Promise<void>;
  updateAbout: (content: AboutContent) => Promise<void>;
  isLoading: boolean;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  notification: { message: string; type: 'success' | 'error' | null; isVisible: boolean };
  showNotification: (message: string, type: 'success' | 'error') => void;
  hideNotification: () => void;
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


const fallbackPrayerTimes: PrayerTime[] = [
  { id: 1, name: 'Subuh', time: '04:30', isActive: true },
  { id: 2, name: 'Dzuhur', time: '12:00', isActive: true },
  { id: 3, name: 'Ashar', time: '15:15', isActive: true },
  { id: 4, name: 'Maghrib', time: '18:00', isActive: true },
  { id: 5, name: 'Isya', time: '19:15', isActive: true },
  { id: 6, name: 'Jumat', time: '12:00', isActive: false },
  { id: 7, name: 'Imsak', time: '04:20', isActive: false },
  { id: 8, name: 'Sahur', time: '03:30', isActive: false },
  { id: 9, name: 'Berbuka', time: '18:00', isActive: false },
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null; isVisible: boolean }>({
    message: '',
    type: null,
    isVisible: false,
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type, isVisible: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };


  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible]);


  const refetchEvents = async () => {
    try {
      const events = await eventService.getAll();
      setState(prev => ({ ...prev, events }));
    } catch (error) {
      console.error("Failed to refetch events", error);
    }
  };


  useEffect(() => {

    const fetchData = async (isBackground = false) => {
      if (!isBackground) setIsLoading(true);

      try {
        const [prayers, events, transactions, donationInfo, contactInfo, aboutInfo] = await Promise.all([
          prayerTimeService.getAll(),
          eventService.getAll(),
          financeService.getAll().catch(() => []),
          donationService.get().catch(() => defaultDonationInfo),
          contactService.get().catch(() => defaultContactInfo),
          aboutService.get().catch(() => defaultState.about)
        ]);

        setState(prev => ({
          ...prev,
          prayerTimes: prayers,
          events: events,
          transactions: transactions,
          donationInfo: donationInfo || defaultDonationInfo,
          contactInfo: contactInfo || defaultContactInfo,
          about: aboutInfo || defaultState.about
        }));
      } catch (error: any) {
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
        }
      } finally {
        if (!isBackground) setIsLoading(false);
      }
    };


    fetchData();


    const intervalId = setInterval(() => {
      fetchData(true);
    }, 5000);


    return () => clearInterval(intervalId);
  }, []);

  const updatePrayerTime = async (id: string | number, time?: string, isActive?: boolean) => {
    try {
      await prayerTimeService.update(id, time, isActive);
      setState(prev => ({
        ...prev,
        prayerTimes: prev.prayerTimes.map(pt =>
          String(pt.id) === String(id)
            ? { ...pt, ...(time !== undefined && { time }), ...(isActive !== undefined && { isActive }) }
            : pt
        )
      }));
    } catch (error) {
      console.error("Failed to update prayer time", error);
      showNotification("Gagal mengupdate jadwal sholat (Server Offline?)", "error");
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id'> | FormData) => {
    try {
      let dataToSend: FormData;

      if (eventData instanceof FormData) {
        dataToSend = eventData;
      } else {
        dataToSend = new FormData();
        Object.entries(eventData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            dataToSend.append(key, value.toString());
          }
        });
      }

      await eventService.create(dataToSend);

      await refetchEvents();
    } catch (error) {
      console.error("Failed to create event", error);
      throw error;
    }
  };

  const updateEvent = async (updatedEvent: Event | FormData) => {
    try {
      let dataToSend: FormData;

      if (updatedEvent instanceof FormData) {
        dataToSend = updatedEvent;
      } else {
        dataToSend = new FormData();
        Object.entries(updatedEvent).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            dataToSend.append(key, value.toString());
          }
        });
      }

      await eventService.update(dataToSend);
      await refetchEvents();
    } catch (error) {
      console.error("Failed to update event", error);
      throw error;
    }
  };

  const deleteEvent = async (id: string | number) => {
    try {
      await eventService.delete(id);

      await refetchEvents();
    } catch (error) {
      console.error("Failed to delete event", error);
      showNotification("Gagal menghapus kegiatan (Server Offline?)", "error");
    }
  };


  const addTransaction = async (data: Omit<Transaction, 'id'>) => {
    try {
      const newTrans = await financeService.create(data);
      setState(prev => ({
        ...prev,
        transactions: [newTrans, ...prev.transactions]
      }));
    } catch (error) {
      console.error("Failed to add transaction", error);
      showNotification("Gagal menyimpan transaksi", "error");
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
      showNotification("Gagal menghapus transaksi", "error");
    }
  };


  const updateDonationInfo = async (info: DonationInfo) => {
    try {
      const updated = await donationService.update(info);
      setState(prev => ({
        ...prev,
        donationInfo: updated
      }));
    } catch (error) {
      console.error("Failed to update donation info", error);
      showNotification("Gagal mengupdate info donasi", "error");
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
      showNotification("Gagal mengupdate info kontak", "error");
      throw error;
    }
  };

  const updateAbout = async (content: AboutContent) => {
    try {
      const updated = await aboutService.update(content);
      setState(prev => ({
        ...prev,
        about: updated
      }));
    } catch (error) {
      console.error("Failed to update about info", error);
      showNotification("Gagal mengupdate info tentang", "error");
      throw error;
    }
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
      isLoading,
      sidebarOpen,
      setSidebarOpen,
      notification,
      showNotification,
      hideNotification
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