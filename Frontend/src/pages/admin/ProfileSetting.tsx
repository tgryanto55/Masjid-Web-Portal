import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/UI/Button';
import { User, Lock, Save, AlertCircle, Loader2, X, CheckCircle } from 'lucide-react';
import { authService } from '../../services/api';

interface ProfileSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ isOpen, onClose }) => {
    const { user, updateUserData } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    // State untuk Toast Notification (Mini Pop-up)
    const [showToast, setShowToast] = useState(false);

    // Reset form saat modal dibuka
    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name,
                password: '',
                confirmPassword: ''
            });
            setStatus('idle');
            setErrorMessage('');
        }
    }, [isOpen, user]);

    // Auto-hide Toast setelah 4 detik
    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setErrorMessage('Konfirmasi password tidak sesuai.');
            setStatus('error');
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setErrorMessage('Password minimal 6 karakter.');
            setStatus('error');
            return;
        }

        setStatus('loading');

        try {
            // Simulasi delay agar transisi lebih smooth
            await new Promise(resolve => setTimeout(resolve, 500));

            const updatedUser = await authService.updateProfile({
                name: formData.name,
                password: formData.password || undefined
            });

            updateUserData(updatedUser);
            setStatus('success');

            // Reset password field
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

            // 1. Tutup Modal Form dengan Animasi
            handleClose();

            // 2. Tampilkan Toast Notification
            setShowToast(true);

        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || 'Gagal menyimpan perubahan.');
            setStatus('error');
        }
    };

    // Jika Modal sedang tutup DAN Toast tidak aktif, tidak perlu render apa-apa
    if (!isOpen && !showToast) return null;

    return (
        <>
            {/* 1. PROFILE FORM MODAL (Hanya render jika isOpen = true) */}
            {isOpen && createPortal(
                <div className="relative z-[100]">
                    <style>{`
                        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes modalFadeOut { from { opacity: 1; } to { opacity: 0; } }
                        @keyframes modalSlideIn { 
                            from { opacity: 0; transform: translateY(20px) scale(0.95); } 
                            to { opacity: 1; transform: translateY(0) scale(1); } 
                        }
                        @keyframes modalSlideOut { 
                            from { opacity: 1; transform: translateY(0) scale(1); } 
                            to { opacity: 0; transform: translateY(20px) scale(0.95); } 
                        }
                        .animate-modal-fade-in { animation: modalFadeIn 0.3s ease-out forwards; }
                        .animate-modal-fade-out { animation: modalFadeOut 0.3s ease-in forwards; }
                        .animate-modal-slide-in { animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                        .animate-modal-slide-out { animation: modalSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                    `}</style>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${isClosing ? 'animate-modal-fade-out' : 'animate-modal-fade-in'}`}
                        aria-hidden="true"
                        onClick={handleClose}
                    />

                    {/* Layout Container */}
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">

                            {/* Modal Panel */}
                            <div className={`relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg ${isClosing ? 'animate-modal-slide-out' : 'animate-modal-slide-in'}`}>

                                {/* Header */}
                                <div className="bg-emerald-900 px-6 py-4 flex justify-between items-center border-b border-amber-500">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white/10 rounded-lg">
                                            <User size={20} className="text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white tracking-tight">Pengaturan Akun</h3>
                                            <p className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">Administrator</p>
                                        </div>
                                    </div>
                                    <button onClick={handleClose} className="text-emerald-300 hover:text-white hover:bg-emerald-800 p-2 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-6 bg-slate-50">
                                    <form id="profileForm" onSubmit={handleSubmit} className="space-y-5">
                                        {/* Error Message */}
                                        {status === 'error' && (
                                            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 border border-red-100 text-sm">
                                                <AlertCircle size={18} />
                                                <span className="font-medium">{errorMessage}</span>
                                            </div>
                                        )}

                                        {/* Inputs */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                    <User size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                                    placeholder="Nama Admin"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                <Lock size={16} className="text-emerald-600" />
                                                Ganti Password
                                            </h4>
                                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Password Baru (Opsional)</label>
                                                    <input
                                                        type="password"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                        className="block w-full border border-gray-200 rounded-lg shadow-sm p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                                        placeholder="••••••"
                                                        autoComplete="new-password"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Konfirmasi Password</label>
                                                    <input
                                                        type="password"
                                                        value={formData.confirmPassword}
                                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                        className="block w-full border border-gray-200 rounded-lg shadow-sm p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                                                        placeholder="••••••"
                                                        disabled={!formData.password}
                                                        autoComplete="new-password"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Footer */}
                                <div className="bg-white px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100">
                                    <Button
                                        form="profileForm"
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full sm:w-auto flex justify-center items-center gap-2 shadow-sm bg-emerald-700 hover:bg-emerald-800"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Menyimpan...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                Simpan
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* 2. TOAST NOTIFICATION (Mini Pop-up) */}
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
                            <h4 className="text-sm font-bold text-gray-900">Profil Diperbarui</h4>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Perubahan data akun berhasil disimpan.</p>
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
        </>
    );
};

export default ProfileSettings;