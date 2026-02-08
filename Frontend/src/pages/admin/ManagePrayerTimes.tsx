import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import { Clock, X, Edit2, Save, Loader2 } from 'lucide-react';

const ManagePrayerTimes = () => {
  const { state, updatePrayerTime, sidebarOpen, showNotification } = useApp();


  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkTimes, setBulkTimes] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);


  const startBulkEdit = () => {
    const initialTimes: Record<string, any> = {};
    state.prayerTimes.forEach(pt => {
      initialTimes[pt.id.toString()] = { time: pt.time, isActive: pt.isActive };
    });
    setBulkTimes(initialTimes);
    setIsBulkEditing(true);
  };

  const handleBulkTimeChange = (id: string | number, field: 'time' | 'isActive', value: any) => {
    setBulkTimes(prev => ({
      ...prev,
      [id.toString()]: {
        ...(prev[id.toString()] as any || { time: state.prayerTimes.find(p => p.id === id)?.time, isActive: state.prayerTimes.find(p => p.id === id)?.isActive }),
        [field]: value
      }
    }));
  };

  const saveBulkChanges = async () => {
    setIsSaving(true);
    try {

      const updates = Object.entries(bulkTimes).map(([id, data]: [string, any]) =>
        updatePrayerTime(id, data.time, data.isActive)
      );
      await Promise.all(updates);
      setIsBulkEditing(false);
      showNotification("Berhasil Disimpan! Jadwal sholat telah diperbarui.", "success");
    } catch (error) {
      console.error(error);
      showNotification("Gagal menyimpan beberapa jadwal sholat.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pb-24 sm:pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 sm:border-0 sm:pb-0">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200">
            <Clock size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Jadwal Sholat</h2>
            <p className="text-sm text-gray-500">Atur waktu sholat harian yang tampil di halaman depan.</p>
          </div>
        </div>


        <div className="hidden sm:flex items-center gap-3">
          {isBulkEditing ? (
            <>
              <button
                onClick={() => setIsBulkEditing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Batal
              </button>
              <Button
                onClick={saveBulkChanges}
                disabled={isSaving}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 shadow-lg shadow-emerald-900/10"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Simpan Perubahan
              </Button>
            </>
          ) : (
            <Button
              onClick={startBulkEdit}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 shadow-lg shadow-emerald-900/10"
            >
              <Edit2 size={18} />
              Edit Jadwal
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mx-4 sm:mx-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="px-4 sm:px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nama Waktu
                </th>
                <th scope="col" className="px-4 sm:px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Jam (WIB)
                </th>
                <th scope="col" className="hidden sm:table-cell px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.prayerTimes.map((pt) => {
                const isOptional = ['Jumat', 'Imsak', 'Sahur', 'Berbuka'].includes(pt.name);
                const currentData = isBulkEditing ? (bulkTimes[pt.id.toString()] as any) : pt;

                return (
                  <tr key={pt.id} className={`transition-colors ${isBulkEditing ? 'bg-emerald-50/50' : 'hover:bg-gray-50'} ${!currentData.isActive && !isBulkEditing ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                    <td className="px-4 sm:px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isBulkEditing ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                          <Clock size={18} />
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-900 block">{pt.name}</span>
                          {isOptional && <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Opsional</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-6 whitespace-nowrap">
                      {isBulkEditing ? (
                        <input
                          type="time"
                          value={currentData.time || ''}
                          onChange={(e) => handleBulkTimeChange(pt.id, 'time', e.target.value)}
                          className="border border-emerald-300 rounded-md p-2 text-lg font-mono font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm w-[110px] sm:w-auto"
                        />
                      ) : (
                        <span className="text-lg font-mono font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded border border-gray-200">{pt.time}</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-8 py-6 whitespace-nowrap text-right">
                      {isBulkEditing ? (
                        <div
                          onClick={() => handleBulkTimeChange(pt.id, 'isActive', !currentData.isActive)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${currentData.isActive ? 'bg-emerald-600' : 'bg-gray-200'}`}
                        >
                          <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${currentData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pt.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {pt.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Floating Action Buttons - Bulk Mode Logic */}
      {!sidebarOpen && createPortal(
        <div className="sm:hidden fixed bottom-6 right-6 z-[45] flex flex-col gap-4">
          {/* Secondary Action: Batal (only shown when bulk editing) */}
          {isBulkEditing && (
            <button
              onClick={() => setIsBulkEditing(false)}
              className="bg-white text-gray-600 p-4 rounded-full shadow-xl border border-gray-200 active:scale-95 transition-all"
              title="Batal"
            >
              <X size={24} />
            </button>
          )}

          {/* Primary Action: Toggle Edit/Save */}
          <button
            onClick={() => isBulkEditing ? saveBulkChanges() : startBulkEdit()}
            disabled={isSaving}
            className={`p-5 rounded-full shadow-[0_20px_50px_rgba(6,78,59,0.4)] flex items-center justify-center transition-all active:scale-90 border border-white/20 ${isBulkEditing ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-800 hover:bg-emerald-900'
              }`}
            title={isBulkEditing ? "Simpan Semua" : "Edit Masal"}
          >
            {isSaving ? (
              <Loader2 size={28} className="animate-spin text-white" />
            ) : isBulkEditing ? (
              <Save size={28} className="text-white" />
            ) : (
              <Edit2 size={28} className="text-white" />
            )}
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManagePrayerTimes;