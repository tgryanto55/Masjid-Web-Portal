import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import {
    CreditCard,
    Smartphone,
    Link as LinkIcon,
    Save,
    Loader2,
    Upload,
    Trash2,
    Heart
} from 'lucide-react';

const ManageDonation = () => {
    const { state, updateDonationInfo, showNotification, isLoading, sidebarOpen } = useApp();

    const [formData, setFormData] = useState({
        bankName: '',
        accountNumber: '',
        accountName: '',
        confirmationPhone: '',
        qrisImage: ''
    });

    const [isSaving, setIsSaving] = useState(false);
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
    }, [isLoading, state.donationInfo]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            showNotification('Ukuran gambar terlalu besar! Maksimal 2MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, qrisImage: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, qrisImage: '' }));
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);

        const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));

        try {
            await Promise.all([updateDonationInfo(formData), minLoadTime]);
            showNotification('Informasi donasi telah diperbarui.', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Gagal menyimpan info donasi.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-24 sm:pb-12">

            {/* ===== HEADER + SAVE BUTTON (DESKTOP) ===== */}
            <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200">
                        <Heart size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Kelola Info Donasi
                        </h2>
                        <p className="text-sm text-gray-500">
                            Atur rekening bank dan kontak konfirmasi donasi.
                        </p>
                    </div>
                </div>

                {/* Desktop Save Button */}
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="hidden md:flex h-11 px-6 rounded-xl transition-all duration-300 shadow-lg bg-emerald-700 hover:bg-emerald-800 shadow-emerald-900/10 flex items-center gap-2 font-bold"
                >
                    {isSaving ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>Menyimpan...</span>
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            <span>Simpan Perubahan</span>
                        </>
                    )}
                </Button>
            </div>

            {/* ===== FORM GRID ===== */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start"
            >

                {/* ===== COLUMN 1 : REKENING ===== */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                                <CreditCard size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                Rekening Bank Utama
                            </h3>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Bank
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.bankName}
                                    onChange={e =>
                                        setFormData({ ...formData, bankName: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor Rekening
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 font-mono text-lg tracking-wide focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.accountNumber}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            accountNumber: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Atas Nama
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.accountName}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            accountName: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== COLUMN 2 : KONTAK ===== */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                                <Smartphone size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                Kontak Konfirmasi
                            </h3>
                        </div>

                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nomor WhatsApp Admin
                            </label>
                            <input
                                type="text"
                                required
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.confirmationPhone}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        confirmationPhone: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* ===== COLUMN 3 : QRIS ===== */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                                <LinkIcon size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                QRIS
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />

                            {!formData.qrisImage ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                                >
                                    <Upload className="mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-600">
                                        Klik untuk upload QRIS
                                    </p>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    <img
                                        src={formData.qrisImage}
                                        alt="QRIS"
                                        className="w-full object-contain"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-white p-2 rounded-lg text-emerald-700 flex items-center gap-1"
                                        >
                                            <Upload size={16} /> Ganti
                                        </button>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="bg-white p-2 rounded-lg text-red-600 flex items-center gap-1"
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

            {/* ===== MOBILE FAB ===== */}
            {!sidebarOpen &&
                createPortal(
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="md:hidden fixed bottom-6 right-6 z-[45] bg-emerald-700 hover:bg-emerald-800 text-white p-5 rounded-full shadow-[0_20px_50px_rgba(6,78,59,0.4)] transition active:scale-90"
                    >
                        {isSaving ? (
                            <Loader2 size={28} className="animate-spin" />
                        ) : (
                            <Save size={28} />
                        )}
                    </button>,
                    document.body
                )}
        </div>
    );
};

export default ManageDonation;
