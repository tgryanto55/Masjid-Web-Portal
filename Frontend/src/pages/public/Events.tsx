import { useApp } from '../../context/AppContext';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const Events = () => {
  const { state } = useApp();
  const { events } = state;

  const NO_IMAGE_URL = 'https://placehold.co/800x600/e2e8f0/94a3b8?text=No+Image';

  // Helper untuk menampilkan tanggal
  const renderDate = (dateStr: string) => {
      // Handle YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      // Handle DD-MM-YYYY
      if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
          const [day, month, year] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      }
      return dateStr;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header - Simpler Version */}
      <div className="bg-emerald-800 text-white py-16 px-4 mb-12">
          <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Agenda Kegiatan</h1>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                  Ikuti berbagai kegiatan bermanfaat kajian, sosial, dan keagamaan di Masjid Raya.
              </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {events.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-gray-100 reveal-up">
              <div className="inline-block p-6 bg-gray-50 rounded-full mb-6 animate-pulse-slow">
                 <Calendar className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Kegiatan</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Saat ini belum ada agenda kegiatan yang dijadwalkan. Silakan kembali lagi nanti untuk informasi terbaru.
              </p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div 
                key={event.id} 
                className={`group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 reveal-up stagger-${(index % 3) + 1}`}
              >
                {/* Image Area */}
                <div className="h-56 overflow-hidden bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                  <img 
                    src={event.image || NO_IMAGE_URL} 
                    alt={event.title} 
                    className="w-full h-full object-cover relative z-10 hover-zoom-img"
                    loading="lazy"
                    onLoad={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.previousElementSibling?.remove(); // Remove skeleton on load
                    }}
                    onError={(e) => (e.currentTarget.src = NO_IMAGE_URL)}
                  />
                  <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-800 shadow-lg uppercase tracking-wide flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                     Kegiatan
                  </div>
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                </div>
                
                {/* Content Area */}
                <div className="p-7 flex-1 flex flex-col relative">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-5 border-b border-gray-50 pb-5">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">
                      <Calendar size={14} />
                      <span>{renderDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={16} className="text-gray-400" />
                      <span>{event.time} WIB</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50">
                    <button className="w-full py-2.5 rounded-lg text-emerald-600 text-sm font-bold hover:bg-emerald-50 flex items-center justify-center gap-2 group/btn transition-colors">
                       Detail Kegiatan <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;