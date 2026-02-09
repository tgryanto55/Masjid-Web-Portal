import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, X, Info } from 'lucide-react';
import { getEventImageUrl } from '../../utils/imageUrl';
import type { Event } from '../../types';

const Events = () => {
  const { state } = useApp();
  const { events } = state;

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const NO_IMAGE_URL =
    'https://placehold.co/800x600/e2e8f0/94a3b8?text=No+Image';

  const handleOpenDetail = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetail = () => {
    setSelectedEvent(null);
  };

  const renderDate = (dateStr: string) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    return dateStr;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">


      <div className="relative bg-emerald-50 pt-36 pb-20 px-4 mb-12 overflow-hidden">

        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full -mr-48 -mt-48 blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-200/20 rounded-full -ml-32 -mt-32 blur-2xl opacity-30"></div>

        {/* Smooth Blend Gradient at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-b from-transparent to-slate-50 z-20 pointer-events-none"></div>


        <div
          className={`max-w-6xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
            Daftar <span className="text-emerald-700">Kegiatan</span>
          </h1>

          <div className="w-16 h-1.5 bg-emerald-600 mx-auto rounded-full mb-6"></div>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Agenda kegiatan dan aktivitas masjid yang dapat diikuti oleh jamaah.
          </p>
        </div>
      </div>



      <div className="max-w-6xl mx-auto px-4 mt-8 mb-12">

        {events.length === 0 ? (
          <div
            className={`text-center py-14 bg-white rounded-[2rem] shadow-xl border border-gray-100 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Calendar className="mx-auto h-14 w-14 text-gray-300 mb-4" />
            <h3 className="text-xl font-black text-gray-900 mb-2">
              Belum Ada Kegiatan
            </h3>
            <p className="text-gray-500 text-sm">
              Agenda kegiatan akan ditampilkan di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...events]
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() -
                  new Date(a.date).getTime()
              )
              .map((event, index) => (
                <div
                  key={event.id}
                  className={`bg-white rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-700 flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div className="h-48 overflow-hidden rounded-t-[2rem]">
                    <img
                      src={getEventImageUrl(event.image) || NO_IMAGE_URL}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      onError={(e) =>
                        (e.currentTarget.src = NO_IMAGE_URL)
                      }
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-4">
                      <div className="flex items-center gap-1 font-black text-emerald-600">
                        <Calendar size={14} />
                        {renderDate(event.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {event.time} WIB
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-gray-900 mb-3">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                      {event.description}
                    </p>

                    <button
                      onClick={() => handleOpenDetail(event)}
                      className="mt-auto w-full py-3 rounded-xl text-emerald-700 font-black text-xs uppercase tracking-widest border border-emerald-200 hover:bg-emerald-50 transition-all"
                    >
                      Detail Kegiatan
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ===== MODAL DETAIL (TETAP) ===== */}
      {selectedEvent &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={handleCloseDetail}
            ></div>

            <div className="relative bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row">
              <button
                onClick={handleCloseDetail}
                className="absolute top-5 right-5 z-10 bg-white p-2 rounded-full shadow"
              >
                <X size={22} />
              </button>

              <div className="md:w-1/2 bg-slate-900">
                <img
                  src={
                    getEventImageUrl(selectedEvent.image) ||
                    NO_IMAGE_URL
                  }
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-1/2 p-8 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4 text-emerald-600 font-black text-xs uppercase">
                  <Info size={16} />
                  Detail Kegiatan
                </div>

                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  {selectedEvent.title}
                </h2>

                <p className="text-gray-600 whitespace-pre-wrap">
                  {selectedEvent.description}
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Events;
