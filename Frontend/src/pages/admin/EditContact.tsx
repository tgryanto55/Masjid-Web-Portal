import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import {
    MapPin,
    Phone,
    Clock,
    Save,
    Loader2,
    Facebook,
    Instagram,
    Youtube
} from 'lucide-react';

const EditContact = () => {
    const { state, updateContactInfo, isLoading, sidebarOpen, showNotification } = useApp();

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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsSaving(true);

        const minLoadTime = new Promise(resolve => setTimeout(resolve, 600));

        try {
            await Promise.all([updateContactInfo(formData), minLoadTime]);
            showNotification(
                'Berhasil Disimpan! Informasi kontak publik telah diperbarui.',
                'success'
            );
        } catch (error) {
            console.error(error);
            showNotification('Gagal menyimpan perubahan.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto pb-24 sm:pb-12">

            {/* ===== HEADER ===== */}
            <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Info Kontak Masjid
                        </h2>
                        <p className="text-sm text-gray-500">
                            Kelola alamat, kontak, dan jam operasional.
                        </p>
                    </div>
                </div>

                {/* Desktop Save Button */}
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="hidden md:flex h-11 px-6 rounded-xl transition-all duration-300 shadow-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 hover:shadow-emerald-300 flex items-center gap-2"
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
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >

                {/* ===== COLUMN 1 ===== */}
                <div className="space-y-6">
                    {/* Lokasi */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                                <MapPin size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                Lokasi Masjid
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <textarea
                                required
                                rows={3}
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.address}
                                onChange={e =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 text-sm font-mono focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.mapEmbedLink}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        mapEmbedLink: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Jam Operasional */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                                <Clock size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                Jam Operasional
                            </h3>
                        </div>
                        <div className="p-6">
                            <input
                                type="text"
                                required
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.operationalHours}
                                onChange={e =>
                                    setFormData({
                                        ...formData,
                                        operationalHours: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* ===== COLUMN 2 ===== */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg text-emerald-600 shadow-sm">
                                <Phone size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                Kontak DKM
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <input
                                type="text"
                                required
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.phone}
                                onChange={e =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                            />
                            <input
                                type="email"
                                required
                                className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.email}
                                onChange={e =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* ===== COLUMN 3 ===== */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                            <div className="p-2 bg-white border border-gray-200 rounded-lg text-blue-600 shadow-sm">
                                <Facebook size={20} />
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                Sosial Media
                            </h3>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Facebook */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link Facebook
                                </label>
                                <div className="absolute inset-y-0 left-0 pt-7 pl-3 flex items-center pointer-events-none">
                                    <Facebook size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="https://facebook.com/..."
                                    value={formData.facebook}
                                    onChange={e =>
                                        setFormData({ ...formData, facebook: e.target.value })
                                    }
                                />
                            </div>

                            {/* Instagram */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link Instagram
                                </label>
                                <div className="absolute inset-y-0 left-0 pt-7 pl-3 flex items-center pointer-events-none">
                                    <Instagram size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="https://instagram.com/..."
                                    value={formData.instagram}
                                    onChange={e =>
                                        setFormData({ ...formData, instagram: e.target.value })
                                    }
                                />
                            </div>

                            {/* YouTube */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Link YouTube
                                </label>
                                <div className="absolute inset-y-0 left-0 pt-7 pl-3 flex items-center pointer-events-none">
                                    <Youtube size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="https://youtube.com/..."
                                    value={formData.youtube}
                                    onChange={e =>
                                        setFormData({ ...formData, youtube: e.target.value })
                                    }
                                />
                            </div>
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

export default EditContact;
