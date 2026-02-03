import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import { Plus, Trash, X, Image as ImageIcon, Calendar, Upload, Trash2, Clock, AlignLeft, CheckCircle, Loader2, AlertTriangle, Pencil } from 'lucide-react';
import type { Event } from '../../types';

const ManageEvents = () => {
  const { state, addEvent, deleteEvent, updateEvent } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // UX States
  const [isSaving, setIsSaving] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    image: ''
  });

  // Auto-hide Toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      description: '',
      image: ''
    });
    setEditingId(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  // Helper: Convert YYYY-MM-DD to DD-MM-YYYY for Input Field
  const formatDateForInput = (dateStr: string) => {
    // Check for YYYY-MM-DD pattern
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    }
    return dateStr;
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsClosing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setEditingId(event.id);
    setFormData({
        title: event.title,
        date: formatDateForInput(event.date), // Convert on open
        time: event.time,
        description: event.description,
        image: event.image || ''
    });
    setIsClosing(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isClosing) return; 
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      resetForm();
    }, 300);
  };

  // Helper untuk menampilkan tanggal di list
  const renderDate = (dateStr: string) => {
    // Handle YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    // Handle DD-MM-YYYY (User input format)
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    }
    // Fallback/Text
    return dateStr;
  };

  // --- IMAGE COMPRESSION UTILITY ---
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1000; // Limit width to 1000px
          const scaleSize = MAX_WIDTH / img.width;
          const newWidth = (img.width > MAX_WIDTH) ? MAX_WIDTH : img.width;
          const newHeight = (img.width > MAX_WIDTH) ? img.height * scaleSize : img.height;

          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
             ctx.drawImage(img, 0, 0, newWidth, newHeight);
             const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
             resolve(dataUrl);
          } else {
             reject(new Error("Canvas context is null"));
          }
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleTriggerFileUpload = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressedBase64 = await compressImage(file);
        setFormData(prev => ({ ...prev, image: compressedBase64 }));
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Gagal memproses gambar. Silakan coba gambar lain.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const removeImage = () => {
     setFormData(prev => ({ ...prev, image: '' }));
     if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
        // Reduced delay for snappier UX
        await new Promise(resolve => setTimeout(resolve, 300));

        if (editingId) {
            // Logic Update
            await updateEvent({
                id: editingId,
                ...formData
            });
            setToastMessage('Kegiatan berhasil diperbarui.');
        } else {
            // Logic Create
            await addEvent(formData);
            setToastMessage('Kegiatan baru berhasil ditambahkan.');
        }
        
        handleCloseModal();
        setShowToast(true);
    } catch (error: any) {
        console.error("Save failed", error);
        
        let errMsg = "Terjadi kesalahan saat menyimpan.";
        const status = error.response?.status;
        
        // FORCE RELOAD IF 404 (Data Sync Issue)
        if (status === 404 || (error.message && error.message.includes('404'))) {
            alert("Data di layar tidak sinkron dengan server. Halaman akan dimuat ulang.");
            window.location.reload();
            return;
        }

        if (error.response) {
            if (status === 413) {
                errMsg = "Ukuran gambar terlalu besar. Gunakan gambar yang lebih kecil.";
            } else if (error.response.data && error.response.data.message) {
                errMsg = error.response.data.message;
            } else {
                 errMsg = `Server error (${status})`;
            }
        } else if (error.request) {
            errMsg = "Tidak ada respon dari server. Pastikan backend aktif.";
        } else {
            errMsg = error.message;
        }

        alert(`Gagal menyimpan: ${errMsg}`);
    } finally {
        setIsSaving(false);
    }
  };

  // --- DELETE CONFIRMATION HANDLERS ---
  const confirmDelete = (id: string | number) => {
      setDeleteId(id);
  };

  const executeDelete = async () => {
      if (deleteId) {
          setIsDeleting(true);
          await new Promise(resolve => setTimeout(resolve, 500));
          try {
              await deleteEvent(deleteId);
              setToastMessage('Kegiatan berhasil dihapus.');
              setShowToast(true);
          } catch (error: any) {
              console.error(error);
              if (error.response?.status === 404) {
                 alert("Data sudah tidak ada di server. Halaman akan dimuat ulang.");
                 window.location.reload();
                 return;
              }
              alert("Gagal menghapus kegiatan.");
          } finally {
              setIsDeleting(false);
              setDeleteId(null);
          }
      }
  };

  const NO_IMAGE_URL = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image';

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes modalSlideOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.95); }
        }
        @keyframes popIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-fade-in {
          animation: modalFadeIn 0.3s ease-out forwards;
        }
        .animate-modal-fade-out {
          animation: modalFadeOut 0.3s ease-in forwards;
        }
        .animate-modal-slide-in {
          animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-modal-slide-out {
          animation: modalSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-pop-in {
            animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Kegiatan</h2>
          <p className="text-gray-500">Tambah, edit, atau hapus agenda kegiatan masjid.</p>
        </div>
        <Button onClick={handleOpenAddModal} className="flex items-center gap-2 shadow-lg shadow-emerald-900/20 bg-emerald-700 hover:bg-emerald-800">
          <Plus size={18} /> Tambah Kegiatan
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.events.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
               <div className="mx-auto h-16 w-16 text-gray-300 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                   <Calendar size={32} />
               </div>
               <p className="text-gray-500 font-medium">Belum ada kegiatan yang ditambahkan.</p>
           </div>
        ) : (
          state.events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-all">
              <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                 <img 
                   src={event.image || NO_IMAGE_URL} 
                   alt={event.title}
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   onError={(e) => (e.currentTarget.src = NO_IMAGE_URL)}
                 />
                 {/* Card Action Overlay */}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                   <button 
                    onClick={() => handleOpenEditModal(event)}
                    className="bg-white p-2.5 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transform hover:scale-110 transition-all"
                    title="Edit Kegiatan"
                   >
                     <Pencil size={18} />
                   </button>
                   <button 
                    onClick={() => confirmDelete(event.id)}
                    className="bg-white p-2.5 rounded-full shadow-lg text-red-600 hover:bg-red-50 transform hover:scale-110 transition-all"
                    title="Hapus"
                   >
                     <Trash size={18} />
                   </button>
                 </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">
                   <Calendar size={14} />
                   <span>{renderDate(event.date)}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">{event.description}</p>
                <div className="text-xs text-gray-400 font-medium pt-3 border-t border-gray-50 flex items-center gap-1">
                   <Clock size={12} /> Pukul: {event.time} WIB
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal - Admin Style (Using Portal) */}
      {isModalOpen && createPortal(
        <div className="relative z-9900" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isClosing ? 'animate-modal-fade-out' : 'animate-modal-fade-in'}`} 
                aria-hidden="true" 
                onClick={handleCloseModal}
            ></div>

            {/* Layout Container */}
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                
                {/* Modal Panel */}
                <div 
                    className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl ${isClosing ? 'animate-modal-slide-out' : 'animate-modal-slide-in'}`}
                    onClick={(e) => e.stopPropagation()} 
                >
                  
                  {/* Header Modal */}
                  <div className="bg-emerald-900 px-6 py-4 flex justify-between items-center border-b border-amber-500">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-white/10 rounded-lg">
                            {editingId ? <Pencil size={20} className="text-amber-400" /> : <Plus size={20} className="text-amber-400" />}
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            {editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
                        </h3>
                    </div>
                    <button onClick={handleCloseModal} className="text-emerald-300 hover:text-white hover:bg-emerald-800 p-2 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="px-6 py-6 bg-slate-50">
                    <form id="eventForm" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            
                            {/* Left Column: Input Fields (Span 7) */}
                            <div className="md:col-span-7 space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Judul Kegiatan</label>
                                    <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Kajian Rutin Sabtu"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Tanggal / Hari</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: 07-02-2026 atau Setiap Ahad"
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Format: DD-MM-YYYY atau Teks Bebas</p>
                                    </div>
                                    <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Waktu (WIB)</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={e => setFormData({...formData, time: e.target.value})}
                                        className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                    />
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 items-center gap-2">
                                        <AlignLeft size={16} /> Deskripsi
                                    </label>
                                    <textarea
                                    required
                                    rows={6}
                                    placeholder="Jelaskan detail kegiatan..."
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white flex-1"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Image Upload (Span 5) */}
                            <div className="md:col-span-5 flex flex-col">
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 items-center gap-2">
                                    <ImageIcon size={16} className="text-emerald-600" /> Poster / Gambar
                                </label>
                                
                                <div className="bg-white p-4 rounded-xl border border-gray-200 h-full flex flex-col">
                                    <input 
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />

                                    {!formData.image ? (
                                        <div 
                                            onClick={() => !isCompressing && handleTriggerFileUpload()}
                                            className={`border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group/upload bg-gray-50 flex-1 min-h-62.5 relative ${isCompressing ? 'cursor-not-allowed opacity-75' : ''}`}
                                        >
                                             {isCompressing && (
                                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 rounded-xl">
                                                    <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                                                    <span className="text-sm font-bold text-emerald-800">Mengompres Gambar...</span>
                                                </div>
                                            )}
                                            <div className="p-3 bg-white rounded-full mb-3 group-hover/upload:bg-emerald-100 transition-colors shadow-sm">
                                                <Upload size={24} className="text-gray-400 group-hover/upload:text-emerald-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-600 group-hover/upload:text-emerald-700 text-center">Klik untuk Upload Poster</span>
                                            <span className="text-xs text-gray-400 mt-2 text-center px-4">Otomatis dikecilkan (Max 1000px) agar ringan</span>
                                        </div>
                                    ) : (
                                        <div className="relative rounded-lg overflow-hidden border border-gray-200 group/image bg-gray-50 flex-1 w-full min-h-62.5">
                                            <img 
                                                src={formData.image} 
                                                alt="Preview" 
                                                className="absolute inset-0 w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.src = NO_IMAGE_URL)}
                                            />
                                            <div className="absolute inset-0 bg-emerald-900/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleTriggerFileUpload}
                                                    className="bg-white p-2.5 rounded-lg text-emerald-700 hover:text-emerald-900 font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-md w-28 justify-center"
                                                >
                                                    <Upload size={16} /> Ganti
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="bg-red-500 p-2.5 rounded-lg text-white hover:bg-red-600 font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-md w-28 justify-center"
                                                >
                                                    <Trash2 size={16} /> Hapus
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </form>
                  </div>

                  {/* Footer Modal */}
                  <div className="bg-white px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-200">
                    <Button 
                        form="eventForm" 
                        type="submit" 
                        disabled={isSaving || isCompressing}
                        className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white shadow-md flex justify-center items-center gap-2"
                    >
                      {isSaving ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Menyimpan...
                          </>
                      ) : (
                          editingId ? 'Simpan Perubahan' : 'Tambah Kegiatan'
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>,
        document.body
      )}

      {/* Custom Confirmation Modal (Delete) */}
      {deleteId && createPortal(
          <div className="fixed inset-0 z-10000 flex items-center justify-center">
              <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setDeleteId(null)}></div>
              <div className="animate-pop-in bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 relative z-10 border border-gray-100">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                          <AlertTriangle size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Kegiatan?</h3>
                      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                          Apakah anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.
                      </p>
                      <div className="flex gap-3 w-full">
                          <button 
                              onClick={() => setDeleteId(null)}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          >
                              Batal
                          </button>
                          <button 
                              onClick={executeDelete}
                              disabled={isDeleting}
                              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
                          >
                              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash size={16} />}
                              <span>Hapus</span>
                          </button>
                      </div>
                  </div>
              </div>
          </div>,
          document.body
      )}

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
                    <h4 className="text-sm font-bold text-gray-900">Berhasil!</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toastMessage}</p>
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

export default ManageEvents;