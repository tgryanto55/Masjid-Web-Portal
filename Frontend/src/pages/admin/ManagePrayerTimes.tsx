import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import { Clock, Check, X, Edit2, CheckCircle } from 'lucide-react';

const ManagePrayerTimes = () => {
  const { state, updatePrayerTime } = useApp();
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [tempTime, setTempTime] = useState('');
  
  // Toast State
  const [showToast, setShowToast] = useState(false);

  // Auto-hide Toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleEdit = (id: string | number, currentTime: string) => {
    setEditingId(id);
    setTempTime(currentTime);
  };

  const handleSave = async (id: string | number) => {
    await updatePrayerTime(id, tempTime);
    setEditingId(null);
    setShowToast(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Jadwal Sholat</h2>
        <p className="text-gray-500">Atur waktu sholat harian yang tampil di halaman depan.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nama Waktu
                </th>
                <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Jam (WIB)
                </th>
                <th scope="col" className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.prayerTimes.map((pt) => {
                const isEditing = editingId === pt.id;
                return (
                    <tr key={pt.id} className={`transition-colors ${isEditing ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isEditing ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                                <Clock size={18} />
                            </div>
                            <span className="text-sm font-bold text-gray-900">{pt.name}</span>
                        </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                        {isEditing ? (
                        <input 
                            type="time" 
                            value={tempTime}
                            onChange={(e) => setTempTime(e.target.value)}
                            className="border border-emerald-300 rounded-md p-2 text-lg font-mono font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
                            autoFocus
                        />
                        ) : (
                        <span className="text-lg font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded border border-gray-200">{pt.time}</span>
                        )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-medium">
                        {isEditing ? (
                        <div className="flex justify-end items-center gap-2">
                            <Button size="sm" onClick={() => handleSave(pt.id)} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700">
                                <Check size={16} /> Simpan
                            </Button>
                            <button 
                            onClick={() => setEditingId(null)} 
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Batal"
                            >
                             <X size={18} />
                            </button>
                        </div>
                        ) : (
                        <button 
                            onClick={() => handleEdit(pt.id, pt.time)} 
                            className="text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-2 ml-auto px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
                        >
                            <Edit2 size={16} /> Edit
                        </button>
                        )}
                    </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && createPortal(
        <div className="fixed top-5 right-5 z-10000">
            <style>{`
                @keyframes slideDownFade {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-toast {
                    animation: slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
            
            <div className="animate-toast bg-white rounded-xl shadow-2xl border-l-4 border-emerald-500 p-4 flex items-center gap-4 min-w-[320px] max-w-sm ring-1 ring-black/5">
                <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600 shadow-sm">
                    <CheckCircle size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">Berhasil Disimpan!</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Jadwal sholat telah diperbarui.</p>
                </div>
                <button 
                    onClick={() => setShowToast(false)} 
                    className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManagePrayerTimes;