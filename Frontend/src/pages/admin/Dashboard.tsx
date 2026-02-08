
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Wallet, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { state } = useApp();
  const { user } = useAuth();

  // Calculate Balance
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

  const stats = [
    {
      name: 'Saldo Kas Masjid',
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
      name: 'Kegiatan Aktif',
      value: `${state.events.length} Agenda`,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
      link: '/admin/events'
    },
    {
      name: 'Rekening Donasi',
      value: state.donationInfo.bankName || 'Belum diatur',
      icon: Heart,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      link: '/admin/donation'
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-24 sm:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 sm:border-0 sm:pb-0">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ahlan wa Sahlan, {user?.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Ringkasan aktivitas dan data Masjid Raya hari ini.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} to={stat.link} className="block group">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-all duration-200 group-hover:shadow-md group-hover:border-emerald-200">
                <div className={`${stat.bg} p-4 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`${stat.color}`} size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-500 text-sm font-medium truncate">{stat.name}</p>
                  <p className="text-xl font-bold text-gray-900 truncate">{stat.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Agenda Mendatang</h3>
            <Link to="/admin/events" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Lihat semua <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {state.events.length === 0 ? (
              <p className="text-gray-500 text-sm italic py-4 text-center bg-gray-50 rounded-lg">Belum ada kegiatan yang dijadwalkan.</p>
            ) : (
              state.events.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100">
                  <div className="bg-white p-2 rounded-lg border border-gray-200 text-center min-w-15 shadow-sm">
                    <span className="block font-bold text-xl text-emerald-700">{new Date(event.date).getDate()}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 line-clamp-1">{event.title}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock size={12} />
                      <span>{event.time} WIB</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Prayer Times Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Jadwal Sholat</h3>
            <Link to="/admin/prayer-times" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              Ubah waktu <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {state.prayerTimes.map(pt => (
              <div key={pt.id} className="p-3 flex justify-between items-center bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="font-medium text-gray-700">{pt.name}</span>
                </div>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-md text-sm">{pt.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;