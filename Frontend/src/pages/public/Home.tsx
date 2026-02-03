import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, MapPin, Hourglass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/UI/Button';
import type { PrayerTime } from '../../types';
import heroBg from '../../assets/BG-Masjid.svg';

const Home = () => {
  const { state } = useApp();
  const { prayerTimes, events } = state;
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<string>('--:--:--');

  // Logic untuk hitung mundur
  useEffect(() => {
    const calculateCountdown = () => {
      if (prayerTimes.length === 0) return;

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;

      let targetPrayer = null;
      let targetDate = new Date();
      let foundNext = false;

      // Urutkan jadwal sholat berdasarkan waktu
      const sortedPrayers = [...prayerTimes].sort((a, b) => {
        return a.time.localeCompare(b.time);
      });

      // Cari jadwal sholat berikutnya hari ini
      for (const pt of sortedPrayers) {
        const [h, m] = pt.time.split(':').map(Number);
        const ptInMinutes = h * 60 + m;

        if (ptInMinutes > currentTimeInMinutes) {
          targetPrayer = pt;
          targetDate.setHours(h, m, 0, 0);
          foundNext = true;
          break;
        }
      }

      // Jika tidak ada jadwal tersisa hari ini, berarti targetnya Subuh besok
      if (!foundNext) {
        targetPrayer = sortedPrayers[0]; // Asumsi subuh adalah index 0 setelah sort
        const [h, m] = targetPrayer.time.split(':').map(Number);
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1); // Besok
        targetDate.setHours(h, m, 0, 0);
      }

      setNextPrayer(targetPrayer);

      // Hitung selisih waktu
      const diff = targetDate.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setCountdown(
          `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setCountdown("00 : 00 : 00");
      }
    };

    const timer = setInterval(calculateCountdown, 1000);
    calculateCountdown(); // Jalankan langsung agar tidak delay 1 detik pertama

    return () => clearInterval(timer);
  }, [prayerTimes]);
  
  // Helper for parsing date string
  const parseDate = (dateStr: string): number => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(dateStr).getTime();
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day).getTime();
    }
    return NaN;
  };

  // Get next 2 upcoming events
  const upcomingEvents = events
    .sort((a, b) => {
        const timeA = parseDate(a.date);
        const timeB = parseDate(b.date);
        if (!isNaN(timeA) && !isNaN(timeB)) return timeA - timeB;
        if (isNaN(timeA)) return -1;
        if (isNaN(timeB)) return 1;
        return 0;
    })
    .slice(0, 2);

  // Helper untuk menampilkan tanggal di kotak kecil
  const getDateDisplay = (dateStr: string) => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
           const date = new Date(dateStr);
           return { day: date.getDate(), month: date.toLocaleString('default', { month: 'short' }), isDate: true };
      }
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
           const [day, month, year] = dateStr.split('-').map(Number);
           const date = new Date(year, month - 1, day);
           return { day: date.getDate(), month: date.toLocaleString('default', { month: 'short' }), isDate: true };
      }
      return { day: 'Rutin', month: '', isDate: false };
  };

  return (
    <div className="space-y-12 pb-12 overflow-hidden">
      {/* Hero Section - Static Version (Reverted) */}
      <section className="relative h-125 flex items-center justify-center text-center text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-emerald-900/70" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 reveal-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Selamat Datang di Masjid Raya
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Tempat di mana hati menemukan ketenangan dan jiwa mendekat kepada Sang Pencipta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/about">
              <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-3">
                Tentang Kami
              </Button>
            </Link>
            <Link to="/donation">
              <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-3 bg-transparent text-white border-white hover:bg-white hover:text-emerald-900">
                Infaq Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Prayer Times Section - Floating Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 md:-mt-32 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 reveal-up">
          {/* Countdown Header */}
          <div className="bg-emerald-600 p-8 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
             <div className="relative z-10 flex flex-col items-center justify-center gap-3">
               <div className="flex items-center gap-2 text-emerald-100 text-sm font-medium uppercase tracking-wider bg-emerald-700/50 px-3 py-1 rounded-full">
                  <Hourglass size={14} className="animate-spin-slow" />
                  <span>Menuju Waktu {nextPrayer ? nextPrayer.name : 'Sholat'}</span>
               </div>
               <div className="text-5xl md:text-6xl font-mono font-bold tracking-widest text-shadow-sm">
                 {countdown}
               </div>
             </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="flex items-center justify-center mb-8 gap-2 text-emerald-800">
              <Clock size={24} className="text-amber-500" />
              <h2 className="text-2xl font-bold">Jadwal Sholat Hari Ini</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              {prayerTimes.map((pt, index) => {
                const isNext = nextPrayer?.id === pt.id;
                return (
                  <div 
                    key={pt.id} 
                    className={`rounded-xl p-5 text-center border-2 transition-all duration-300 reveal-scale stagger-${index + 1} ${
                      isNext 
                        ? 'bg-emerald-600 text-white border-emerald-600 transform scale-110 shadow-xl ring-4 ring-emerald-100 relative z-10' 
                        : 'bg-white text-gray-700 border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <span className={`block font-bold text-xs mb-2 uppercase tracking-widest ${isNext ? 'text-emerald-200' : 'text-gray-400'}`}>
                      {pt.name}
                    </span>
                    <span className="block text-2xl md:text-3xl font-bold">{pt.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Events & Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
           {/* Upcoming Events */}
           <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 reveal-up stagger-1 hover:shadow-xl transition-all duration-500 group">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Kegiatan Mendatang</h3>
                <div className="h-1 flex-1 mx-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                </div>
             </div>
             
             <div className="space-y-6">
               {upcomingEvents.length > 0 ? upcomingEvents.map((event, idx) => {
                   const dateDisplay = getDateDisplay(event.date);
                   return (
                     <div key={event.id} className={`flex gap-5 items-start group/item p-3 rounded-xl hover:bg-emerald-50/50 transition-colors reveal-up stagger-${idx + 1}`}>
                       <div className="bg-linear-to-br from-emerald-50 to-emerald-100 text-emerald-700 rounded-2xl text-center w-18.5 h-18.5 flex flex-col justify-center items-center shrink-0 p-1 shadow-sm border border-emerald-100 group-hover/item:scale-110 transition-transform duration-300">
                          {dateDisplay.isDate ? (
                              <>
                                <span className="block font-bold text-2xl leading-none">{dateDisplay.day}</span>
                                <span className="text-[10px] font-bold uppercase mt-1 text-emerald-600">{dateDisplay.month}</span>
                              </>
                          ) : (
                               <span className="block font-bold text-[10px] uppercase leading-tight line-clamp-3 px-1">{event.date}</span> 
                          )}
                       </div>
                       <div className="flex-1 min-w-0 pt-1">
                         <h4 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover/item:text-emerald-700 transition-colors">{event.title}</h4>
                         <p className="text-sm text-gray-500 mb-2 flex items-center gap-1.5 mt-1">
                             <Clock size={14} className="text-amber-500" />
                             <span className="font-medium">{!dateDisplay.isDate ? event.date + ', ' : ''} {event.time} WIB</span>
                         </p>
                         <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                       </div>
                     </div>
                   );
               }) : (
                 <p className="text-gray-500 italic py-4 text-center">Belum ada kegiatan mendatang.</p>
               )}
             </div>
             <div className="mt-8 pt-4 border-t border-gray-100">
                <Link to="/events" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-800 transition-all hover:gap-3">
                  Lihat semua kegiatan <span>→</span>
                </Link>
             </div>
           </div>

           {/* Call to Action Box */}
           <div className="bg-emerald-900 rounded-2xl shadow-xl text-white relative overflow-hidden flex flex-col justify-between reveal-up stagger-2 transform hover:scale-[1.02] transition-transform duration-500">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10 pointer-events-none"></div>
             
             <div className="p-10 relative z-10">
                <div className="inline-flex items-center gap-2 bg-emerald-800/50 rounded-full px-3 py-1 text-xs font-semibold text-emerald-200 mb-4 border border-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Hadist Hari Ini
                </div>
                <h3 className="text-3xl font-bold mb-6">Mari Berjamaah</h3>
                <blockquote className="text-emerald-100 text-lg leading-relaxed mb-8 italic border-l-4 border-amber-500 pl-4">
                 "Shalat berjamaah lebih utama dua puluh tujuh derajat daripada shalat sendirian." 
                 <footer className="text-sm font-bold text-emerald-300 mt-2 not-italic">— HR. Bukhari & Muslim</footer>
                </blockquote>
                
                <div className="flex items-center gap-3 mb-8 bg-emerald-800/30 p-4 rounded-xl border border-emerald-700/50">
                  <div className="bg-amber-500 p-2 rounded-full text-emerald-900 shadow-lg">
                      <MapPin size={24} fill="currentColor" />
                  </div>
                  <div>
                      <p className="text-xs text-emerald-300 uppercase font-bold tracking-wider">Lokasi Kami</p>
                      <p className="text-white font-medium">Jl. Ahmad Yani No. 123, Kota Sejahtera</p>
                  </div>
                </div>
             </div>
             
             <div className="p-10 pt-0 relative z-10 mt-auto">
               <Link to="/contact">
                 <Button className="w-full bg-amber-500 hover:bg-amber-400 text-emerald-900 font-bold border-none py-4 shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 group/btn">
                   Buka Google Maps
                   <MapPin size={18} className="group-hover/btn:animate-bounce" />
                 </Button>
               </Link>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;