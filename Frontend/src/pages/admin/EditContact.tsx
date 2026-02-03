import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import { MapPin, Phone, Clock, Save, Loader2, CheckCircle, Facebook, Instagram, Youtube, X } from 'lucide-react';

const EditContact = () => {
  const { state, updateContactInfo, isLoading } = useApp();
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    operationalHours: '',
    mapEmbedLink: '',
    facebook: '',
    instagram: '',
    youtube: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && state.contactInfo && !isInitializedRef.current) {
      setFormData({
        address: state.contactInfo.address || '',
        phone: state.contactInfo.phone || '',
        email: state.contactInfo.email || '',
        operationalHours: state.contactInfo.operationalHours || '',
        mapEmbedLink: state.contactInfo.mapEmbedLink || '',
        facebook: state.contactInfo.facebook || '',
        instagram: state.contactInfo.instagram || '',
        youtube: state.contactInfo.youtube || ''
      });
      isInitializedRef.current = true;
    }
  }, [isLoading, state.contactInfo]);

  // Auto-hide Toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));

    try {
      await Promise.all([updateContactInfo(formData), minLoadTime]);
      setShowToast(true);
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Edit Info Kontak</h2>
        <p className="text-gray-500 mt-1">Kelola alamat, kontak, dan jam operasional masjid.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                        <MapPin size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Lokasi Masjid</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                        <textarea
                            required
                            rows={3}
                            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Jl. Raya No. 123..."
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Embed Google Maps (Iframe Src)</label>
                        <input
                            type="text"
                            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-mono"
                            placeholder="https://www.google.com/maps/embed?..."
                            value={formData.mapEmbedLink}
                            onChange={e => setFormData({...formData, mapEmbedLink: e.target.value})}
                        />
                        <p className="text-xs text-gray-500 mt-1">Copy URL dari atribut `src` pada kode Embed Google Maps.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                        <Clock size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Jam Operasional</h3>
                </div>
                <div className="p-6">
                     <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan Jam Buka</label>
                        <input
                            type="text"
                            required
                            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="Senin - Minggu: 08:00 - 20:00 WIB"
                            value={formData.operationalHours}
                            onChange={e => setFormData({...formData, operationalHours: e.target.value})}
                        />
                </div>
            </div>
        </div>

        {/* Right Col */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                        <Phone size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Kontak DKM</h3>
                </div>
                <div className="p-6 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon / WA</label>
                        <input
                            type="text"
                            required
                            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="+62 812..."
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
                        <input
                            type="email"
                            required
                            className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="info@masjid.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 shadow-sm">
                        <Facebook size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-800">Sosial Media</h3>
                </div>
                <div className="p-6 space-y-4">
                     <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Facebook</label>
                        <div className="absolute inset-y-0 left-0 pt-7 pl-3 flex items-center pointer-events-none">
                            <Facebook size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="https://facebook.com/..."
                            value={formData.facebook}
                            onChange={e => setFormData({...formData, facebook: e.target.value})}
                        />
                    </div>
                     <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link Instagram</label>
                         <div className="absolute inset-y-0 left-0 pt-7 pl-3 flex items-center pointer-events-none">
                            <Instagram size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="https://instagram.com/..."
                            value={formData.instagram}
                            onChange={e => setFormData({...formData, instagram: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link YouTube</label>
                         <div className="absolute inset-y-0 left-0 pt-7 pl-3 flex items-center pointer-events-none">
                            <Youtube size={18} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="https://youtube.com/..."
                            value={formData.youtube}
                            onChange={e => setFormData({...formData, youtube: e.target.value})}
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
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Informasi kontak publik telah diperbarui.</p>
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

export default EditContact;