import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, MapPin, Hourglass, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/UI/Button';
import type { PrayerTime } from '../../types';
import heroBg from '../../assets/BG-Masjid.svg';

const Home = () => {
  const { state } = useApp();
  const { prayerTimes, events, transactions } = state;
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [countdown, setCountdown] = useState<string>('--:--:--');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [financePage, setFinancePage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  const now_date = new Date();
  const currentMonth = now_date.getMonth();
  const currentYear = now_date.getFullYear();

  const thisMonthIncome = transactions
    .filter(t => {
      const d = new Date(t.date);
      return t.type === 'income' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const thisMonthExpense = transactions
    .filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num).replace('Rp', 'Rp ');
  };


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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


      const filteredPrayers = prayerTimes.filter(pt => {
        if (!pt.isActive) return false;
        if (pt.name === "Jumat") {
          return new Date().getDay() === 5; // Hanya muncul di hari Jumat
        }
        return true;
      });

      if (filteredPrayers.length === 0) return;

      const sortedPrayers = [...filteredPrayers].sort((a, b) => {
        return a.time.localeCompare(b.time);
      });


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


      if (!foundNext) {
        targetPrayer = sortedPrayers[0];
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
          `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')} `
        );
      } else {
        setCountdown("00 : 00 : 00");
      }
    };

    const timer = setInterval(calculateCountdown, 1000);
    calculateCountdown();

    return () => clearInterval(timer);
  }, [prayerTimes]);


  const parseDate = (dateStr: string): number => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Date(dateStr).getTime();
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day).getTime();
    }
    return NaN;
  };


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
    <div className="space-y-6 pb-8 overflow-hidden bg-white">

      <section className="relative lg:h-[calc(100vh-80px)] min-h-[600px] flex items-center py-8 lg:py-0 overflow-hidden bg-emerald-50/40">

        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>


        <div className="absolute top-0 right-0 w-[60%] h-full bg-white/80 backdrop-blur-sm clip-path-hero hidden lg:block"></div>
        <div className="absolute top-20 right-20 w-128 h-128 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <div className="reveal-up space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-600/10 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm tracking-wide border border-emerald-600/20">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                Pusat Kebaikan & Ibadah
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Temukan <span className="text-emerald-700">Ketenangan</span> di Masjid Raya
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                Menjadi wadah bagi jamaah dalam mendekatkan diri kepada Allah SWT melalui ibadah rutin dan kegiatan sosial kemasyarakatan.
              </p>

              <div className="flex flex-col sm:flex-row gap-5">
                <Link to="/about">
                  <Button className="w-full sm:w-auto px-10 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold shadow-2xl shadow-emerald-900/20 transform hover:-translate-y-1 transition-all">
                    Tentang Kami
                  </Button>
                </Link>
              </div>


              <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 max-w-md">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lokasi</p>
                    <p className="text-sm font-bold text-gray-800">Kota Sejahtera</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Akses</p>
                    <p className="text-sm font-bold text-gray-800">24 Jam / Hari</p>
                  </div>
                </div>
              </div>
            </div>


            <div className="reveal-up stagger-1 lg:pl-10">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-emerald-50 p-6 md:p-8 relative overflow-hidden group">

                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 -mr-10 -mt-10 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>


                <div className="text-center mb-8 relative z-10">
                  <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-3">
                    {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-5xl md:text-6xl font-mono font-black text-gray-900 tracking-tighter mb-3">
                    {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ' : ')}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
                    <Hourglass size={16} className="animate-spin-slow" />
                    <span>{nextPrayer ? `${nextPrayer.name} dalam ${countdown}` : 'Memuat jadwal...'}</span>
                  </div>
                </div>


                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                  {prayerTimes
                    .filter(pt => {
                      if (!pt.isActive) return false;
                      if (pt.name === "Jumat") return new Date().getDay() === 5;
                      return true;
                    })
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((pt) => {
                      const isNext = nextPrayer?.id === pt.id;
                      const isRamadan = ['Imsak', 'Sahur', 'Berbuka'].includes(pt.name);

                      return (
                        <div
                          key={pt.id}
                          className={`rounded-2xl p-4 text-center transition-all duration-300 ${isNext
                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/20 scale-105'
                            : isRamadan
                              ? 'bg-amber-50 border border-amber-100 text-amber-900'
                              : 'bg-emerald-50/50 border border-emerald-100/50 text-emerald-900'
                            }`}
                        >
                          <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isNext ? 'text-emerald-200' : 'text-gray-400'}`}>
                            {pt.name}
                          </p>
                          <p className="text-xl font-black">{pt.time}</p>
                        </div>
                      );
                    })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-center relative z-10">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Masjid</p>
                    <p className="text-emerald-600 font-bold text-sm">Aktif & Terbuka</p>
                  </div>
                  <div className="w-px h-6 bg-gray-100"></div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Zona Waktu</p>
                    <p className="text-gray-800 font-bold text-sm flex items-center justify-center gap-1">
                      WIB <span className="text-[10px] text-gray-400 font-normal">(UTC+7)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 reveal-up stagger-1 hover:shadow-xl transition-all duration-500 group flex flex-col h-full">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Kegiatan Mendatang</h3>
              <div className="h-1 flex-1 mx-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
              </div>
            </div>

            <div className="space-y-6 flex-1">
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
            <div className="mt-8 pt-4 border-t border-gray-100 shrink-0">
              <Link to="/events" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-800 transition-all hover:gap-3">
                Lihat semua kegiatan <span>→</span>
              </Link>
            </div>
          </div>


          <div className="bg-emerald-900 rounded-2xl shadow-xl text-white relative overflow-hidden flex flex-col justify-between reveal-up stagger-2 transform hover:scale-[1.02] transition-transform duration-500 h-full">

            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500 rounded-full blur-3xl opacity-20 -ml-10 -mb-10 pointer-events-none"></div>

            <div className="p-10 relative z-10 flex-1 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-emerald-800/50 rounded-full px-3 py-1 text-xs font-semibold text-emerald-200 mb-4 border border-emerald-700 self-start">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Hadist Hari Ini
              </div>
              <h3 className="text-3xl font-bold mb-6">Mari Berjamaah</h3>
              <blockquote className="text-emerald-100 text-lg leading-relaxed mb-8 italic border-l-4 border-amber-500 pl-4">
                "Shalat berjamaah lebih utama dua puluh tujuh derajat daripada shalat sendirian."
                <footer className="text-sm font-bold text-emerald-300 mt-2 not-italic">— HR. Bukhari & Muslim</footer>
              </blockquote>

              <div className="flex items-center gap-3 mb-8 bg-emerald-800/30 p-4 rounded-xl border border-emerald-700/50">
                <div className="bg-amber-500 p-2 rounded-full text-emerald-900 shadow-lg shrink-0">
                  <MapPin size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs text-emerald-300 uppercase font-bold tracking-wider">Lokasi Kami</p>
                  <p className="text-white font-medium">Jl. Ahmad Yani No. 123, Kota Sejahtera</p>
                </div>
              </div>
            </div>

            <div className="p-10 pt-0 relative z-10 shrink-0">
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


      <section className="bg-slate-100/50 py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Transparansi Keuangan</h2>
            <div className="w-20 h-1.5 bg-emerald-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Laporan saldo kas masjid secara real-time sebagai bentuk amanah dan keterbukaan kepada jamaah.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 lg:px-10 items-stretch">

            <div className={`lg:col-span-1 flex flex-col justify-between gap-4 transition-all duration-1000 transform h-full ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-emerald-900/5 border border-emerald-100 group transition-all duration-500 hover:shadow-emerald-900/15 hover:scale-[1.02] cursor-default flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-400 uppercase tracking-widest text-[9px]">Total Saldo Kas</span>
                    <span className="text-emerald-600 font-bold text-[10px]">Terverifikasi</span>
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900">{formatRupiah(balance)}</p>
              </div>

              <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-blue-900/5 border border-blue-50 group transition-all duration-500 hover:shadow-blue-900/15 hover:scale-[1.02] cursor-default flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-400 uppercase tracking-widest text-[9px]">Pemasukan {now_date.toLocaleString('id-ID', { month: 'short' })}</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-600">+{formatRupiah(thisMonthIncome)}</p>
              </div>

              <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-rose-900/5 border border-rose-50 group transition-all duration-500 hover:shadow-rose-900/15 hover:scale-[1.02] cursor-default flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-rose-100 text-rose-600 p-3 rounded-xl">
                    <TrendingDown size={24} />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-400 uppercase tracking-widest text-[9px]">Pengeluaran {now_date.toLocaleString('id-ID', { month: 'short' })}</span>
                  </div>
                </div>
                <p className="text-xl font-bold text-rose-600">-{formatRupiah(thisMonthExpense)}</p>
              </div>
            </div>


            <div className={`lg:col-span-2 transition-all duration-1000 delay-300 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-gray-300/50 transition-all duration-500">
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Clock size={16} className="text-emerald-600" />
                    Riwayat Transaksi Terakhir
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">5 Teratas</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white">
                        <th className="px-6 py-4">Tanggal</th>
                        <th className="px-6 py-4">Keterangan</th>
                        <th className="px-6 py-4 text-right">Nominal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50" key={financePage}>
                      {[...transactions]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .slice((financePage - 1) * itemsPerPage, financePage * itemsPerPage)
                        .map((t, idx) => (
                          <tr key={t.id || idx} className="hover:bg-gray-50/50 transition-colors group animate-reveal-up">
                            <td className="px-6 py-4">
                              <p className="text-xs font-bold text-gray-800">
                                {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-medium text-gray-600 line-clamp-1">{t.title}</p>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className={`text-xs font-black ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {t.type === 'income' ? '+' : '-'}{formatRupiah(Number(t.amount))}
                              </p>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Halaman {financePage} dari {Math.ceil(transactions.length / itemsPerPage) || 1}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFinancePage(prev => Math.max(1, prev - 1))}
                      disabled={financePage === 1}
                      className="px-3 py-1 rounded-lg bg-white border border-gray-100 text-[10px] font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all cursor-pointer"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={() => setFinancePage(prev => Math.min(Math.ceil(transactions.length / itemsPerPage), prev + 1))}
                      disabled={financePage >= Math.ceil(transactions.length / itemsPerPage)}
                      className="px-3 py-1 rounded-lg bg-white border border-gray-100 text-[10px] font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all cursor-pointer"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
                {transactions.length === 0 && (
                  <div className="py-8 text-center text-gray-400 text-xs italic">
                    Belum ada riwayat transaksi.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center reveal-up">
            <Link to="/donation">
              <Button className="bg-linear-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl shadow-emerald-900/30 transform hover:-translate-y-1 transition-all">
                Salurkan Infaq Terbaik Anda
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
