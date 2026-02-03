import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import { CreditCard, Smartphone, Link as LinkIcon, Save, Loader2, CheckCircle, Upload, Trash2, X } from 'lucide-react';

const ManageDonation = () => {
  const { state, updateDonationInfo, isLoading } = useApp();
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    confirmationPhone: '',
    qrisImage: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const isInitializedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && state.donationInfo && !isInitializedRef.current) {
      setFormData({
        bankName: state.donationInfo.bankName || '',
        accountNumber: state.donationInfo.accountNumber || '',
        accountName: state.donationInfo.accountName || '',
        confirmationPhone: state.donationInfo.confirmationPhone || '',
        qrisImage: state.donationInfo.qrisImage || ''
      });
      isInitializedRef.current = true;
    }
  }, [isLoading]); 

  // Auto-hide Toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          alert("Ukuran gambar terlalu besar! Maksimal 2MB agar tidak memberatkan database.");
          return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, qrisImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
      setFormData(prev => ({ ...prev, qrisImage: '' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));

    try {
      await Promise.all([updateDonationInfo(formData), minLoadTime]);
      setShowToast(true);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan perubahan. Pastikan gambar tidak terlalu besar.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 relative">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Kelola Info Donasi</h2>
        <p className="text-gray-500 mt-1">Atur informasi rekening bank dan kontak konfirmasi donasi yang tampil di halaman publik.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Bank Details & Save Button */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
            <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                    <CreditCard size={20} />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Rekening Bank Utama</h3>
            </div>

            <div className="p-6 space-y-5">
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors">Nama Bank</label>
                    <input 
                    type="text"
                    required
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                    value={formData.bankName}
                    onChange={e => setFormData({...formData, bankName: e.target.value})}
                    />
                </div>
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors">Nomor Rekening</label>
                    <input 
                    type="text"
                    required
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-lg tracking-wide"
                    placeholder="Contoh: 1234567890"
                    value={formData.accountNumber}
                    onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                    />
                </div>
                <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors">Atas Nama (Pemilik Rekening)</label>
                    <input 
                    type="text"
                    required
                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Contoh: DKM Masjid Raya"
                    value={formData.accountName}
                    onChange={e => setFormData({...formData, accountName: e.target.value})}
                    />
                </div>
            </div>
            </div>

            <Button 
                type="submit" 
                disabled={isSaving} 
                className="w-full py-3 rounded-xl transition-all duration-300 shadow-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
                {isSaving ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Menyimpan...</span>
                    </>
                ) : (
                    <>
                        <Save size={20} />
                        <span>Simpan Perubahan</span>
                    </>
                )}
            </Button>
        </div>

        {/* Right Column: Contact & QRIS */}
        <div className="space-y-6">
             {/* Contact Info */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                        <Smartphone size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Kontak Konfirmasi</h3>
                </div>
                <div className="p-6">
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-1 group-focus-within:text-emerald-600 transition-colors">Nomor WhatsApp Admin</label>
                        <input 
                            type="text"
                            required
                            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Contoh: +62 812-3456-7890"
                            value={formData.confirmationPhone}
                            onChange={e => setFormData({...formData, confirmationPhone: e.target.value})}
                        />
                        <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Jamaah akan diarahkan ke nomor ini setelah transfer.
                        </p>
                    </div>
                </div>
             </div>

             {/* QRIS Info */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                        <LinkIcon size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">QRIS</h3>
                </div>
                <div className="p-6 space-y-4">
                    <input 
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />

                    <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-2 group-focus-within:text-emerald-600 transition-colors">Upload Gambar QRIS (Opsional)</label>
                        
                        {!formData.qrisImage ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group/upload"
                            >
                                <div className="p-3 bg-gray-50 rounded-full mb-3 group-hover/upload:bg-emerald-100 transition-colors">
                                    <Upload size={24} className="text-gray-400 group-hover/upload:text-emerald-600" />
                                </div>
                                <span className="text-sm font-medium text-gray-600 group-hover/upload:text-emerald-700">Klik untuk upload gambar</span>
                                <span className="text-xs text-gray-400 mt-1">Format: JPG, PNG (Max 2MB)</span>
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 group/image bg-gray-50">
                                <img 
                                    src={formData.qrisImage} 
                                    alt="Preview QRIS" 
                                    className="w-full h-auto max-h-75 object-contain"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-white/95 p-2.5 rounded-lg text-emerald-700 hover:text-emerald-600 font-medium text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-lg"
                                    >
                                        <Upload size={16} /> Ganti
                                    </button>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="bg-white/95 p-2.5 rounded-lg text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-lg"
                                    >
                                        <Trash2 size={16} /> Hapus
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>

      </form>

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
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Informasi rekening dan kontak donasi telah diperbarui.</p>
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

export default ManageDonation;