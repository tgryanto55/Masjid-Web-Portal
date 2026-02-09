
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Wallet, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { state } = useApp();
  const { user } = useAuth();

  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);
  const balance = totalIncome - totalExpense;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const safeDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const stats = [
    {
      name: 'Saldo Kas',
      value: formatRupiah(balance),
      icon: Wallet,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      link: '/admin/finance'
    },
    {
      name: 'Jadwal Sholat',
      value: `${state.prayerTimes.length} Waktu`,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      link: '/admin/prayer-times'
    },
    {
      name: 'Kegiatan',
      value: `${state.events.length} Agenda`,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      link: '/admin/events'
    },
    {
      name: 'Bank Donasi',
      value: state.donationInfo.bankName || 'Belum diatur',
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      link: '/admin/donation'
    },
  ];

  return (
    <div className="space-y-4 pb-12 sm:pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100 sm:border-0 sm:pb-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-lg shadow-emerald-200">
            <Calendar size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">Ahlan wa Sahlan, {user?.name}</h2>
            <p className="text-xs text-gray-500">Ringkasan aktivitas hari ini.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.link} className="block group">
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 transition-all duration-200 group-hover:shadow-md group-hover:border-emerald-200">
                <div className={`${stat.bg} p-2.5 sm:p-3 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Icon className={`${stat.color}`} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider truncate">{stat.name}</p>
                  <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900 italic">Agenda Mendatang</h3>
            <Link to="/admin/events" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Semua <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {state.events.length === 0 ? (
              <p className="text-gray-400 text-xs italic py-6 text-center bg-gray-50 rounded-lg">Belum ada kegiatan.</p>
            ) : (
              state.events.slice(0, 3).map((event) => {
                const eventDate = safeDate(event.date);
                return (
                  <div key={event.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100">
                    <div className="bg-white p-1.5 rounded-lg border border-gray-200 text-center min-w-[50px] shadow-sm">
                      <span className="block font-bold text-lg text-emerald-700 leading-none">{eventDate.getDate()}</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{eventDate.toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 text-sm line-clamp-1">{event.title}</p>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5">
                        <Clock size={10} />
                        <span>{event.time} WIB</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-gray-900 italic">Jadwal Sholat</h3>
            <Link to="/admin/prayer-times" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Ubah <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {state.prayerTimes.map(pt => (
              <div key={pt.id} className="p-2 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:border-emerald-200 transition-all">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{pt.name}</span>
                <span className="font-mono font-bold text-emerald-800 text-sm mt-0.5">{pt.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;