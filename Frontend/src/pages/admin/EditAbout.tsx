import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import { Save, History, Target, Compass, Loader2, CheckCircle, X } from 'lucide-react';

const EditAbout = () => {
  const { state, updateAbout } = useApp();
  const [formData, setFormData] = useState({
    history: '',
    vision: '',
    mission: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (state.about) {
        setFormData(state.about);
    }
  }, [state.about]);

  // Auto-hide Toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    setIsSaving(true);
    
    // Simulate network delay for better UX feel
    await new Promise(resolve => setTimeout(resolve, 600));
    
    updateAbout(formData);
    setIsSaving(false);
    setShowToast(true);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      
      {/* Sticky Header with Action Button */}
      <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-4 mb-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Profil Masjid</h2>
           <p className="text-gray-500 text-sm">Kelola sejarah, visi, dan misi masjid.</p>
        </div>
        <Button 
            onClick={() => handleSubmit()} 
            disabled={isSaving}
            className="shadow-lg shadow-emerald-900/10 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6"
        >
            {isSaving ? (
                <>
                    <Loader2 size={18} className="animate-spin" /> Menyimpan...
                </>
            ) : (
                <>
                    <Save size={18} /> Simpan Perubahan
                </>
            )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: History (Takes 7/12 width) */}
        <section className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full min-h-150">
            <div className="border-b border-gray-50 bg-gray-50/50 px-5 py-4 flex items-center gap-3">
                <div className="p-2 bg-white border border-gray-100 text-emerald-600 rounded-lg shadow-sm">
                    <History size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">Sejarah Masjid</h3>
                </div>
            </div>
            <div className="p-0 grow flex flex-col">
                <textarea
                    value={formData.history}
                    onChange={(e) => handleChange('history', e.target.value)}
                    className="w-full h-full min-h-135 p-6 text-gray-700 focus:outline-none focus:bg-gray-50/50 resize-none leading-relaxed text-base transition-all"
                    placeholder="Ceritakan sejarah berdirinya masjid disini..."
                />
            </div>
        </section>

        {/* Right Column: Vision & Mission (Takes 5/12 width) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Vision */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-50 bg-gray-50/50 px-5 py-4 flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-100 text-blue-600 rounded-lg shadow-sm">
                        <Target size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Visi</h3>
                    </div>
                </div>
                <div className="p-0">
                    <textarea
                        value={formData.vision}
                        onChange={(e) => handleChange('vision', e.target.value)}
                        className="w-full min-h-50 p-5 text-gray-700 focus:outline-none focus:bg-gray-50/50 resize-y"
                        placeholder="Tuliskan visi jangka panjang..."
                    />
                </div>
            </section>

            {/* Mission */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden grow">
                <div className="border-b border-gray-50 bg-gray-50/50 px-5 py-4 flex items-center gap-3">
                    <div className="p-2 bg-white border border-gray-100 text-amber-600 rounded-lg shadow-sm">
                        <Compass size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">Misi</h3>
                    </div>
                </div>
                <div className="p-0">
                    <textarea
                        value={formData.mission}
                        onChange={(e) => handleChange('mission', e.target.value)}
                        className="w-full min-h-65 p-5 text-gray-700 focus:outline-none focus:bg-gray-50/50 resize-y"
                        placeholder="Tuliskan poin-poin misi..."
                    />
                </div>
            </section>
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
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Informasi profil masjid telah diperbarui.</p>
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

export default EditAbout;