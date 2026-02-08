import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import { Save, History, Target, Compass, Loader2, Upload, Image as ImageIcon, List, ListOrdered } from 'lucide-react';

const EditAbout = () => {
    const { state, updateAbout, sidebarOpen, showNotification } = useApp();
    const [formData, setFormData] = useState({
        history: '',
        vision: '',
        mission: '',
        image: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const isInitialized = useRef(false);

    useEffect(() => {
        // Only initialize form data once, prevent overwrite from background polling
        if (state.about && !isInitialized.current) {
            setFormData({
                ...state.about,
                image: state.about.image || ''
            });
            isInitialized.current = true;
        }
    }, [state.about]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setFormData(prev => ({ ...prev, image: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);

        try {
            await updateAbout(formData);
            showNotification("Berhasil Disimpan! Informasi profil masjid telah diperbarui.", "success");
        } catch (error) {
            console.error("Failed to save about info:", error);
            showNotification("Gagal menyimpan perubahan. Silakan coba lagi.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleListAction = (type: 'bullet' | 'number') => {
        const textarea = document.getElementById('mission-textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.mission;

        let marker = type === 'bullet' ? '• ' : '1. ';

        // If it's a number choice, try to detect the current sequence
        if (type === 'number') {
            const lines = text.substring(0, start).split('\n');
            const lastLine = lines[lines.length - 1];
            const match = lastLine.match(/^(\d+)\./);
            if (match) {
                marker = `${parseInt(match[1]) + 1}. `;
            } else if (text.length > 0 && !text.endsWith('\n')) {
                // if not start of line, assume we want a new line with number 1
                marker = '\n1. ';
            }
        } else {
            // for bullet, add newline if not at start/after newline
            if (start > 0 && text[start - 1] !== '\n') {
                marker = '\n• ';
            }
        }

        const newText = text.substring(0, start) + marker + text.substring(end);
        setFormData(prev => ({ ...prev, mission: newText }));

        // Refocus and set cursor
        setTimeout(() => {
            textarea.focus();
            const newPos = start + marker.length;
            textarea.setSelectionRange(newPos, newPos);
        }, 10);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-24 sm:pb-12">

            {/* Header section standardized with other admin pages */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 sm:border-0 sm:pb-0 mb-4 sm:mb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-200">
                        <History size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Profil Masjid</h2>
                        <p className="text-sm text-gray-500">Kelola sejarah, visi, dan misi masjid.</p>
                    </div>
                </div>
                <Button
                    onClick={() => handleSubmit()}
                    disabled={isSaving}
                    className="hidden sm:flex items-center gap-2 shadow-lg shadow-emerald-900/20 bg-emerald-700 hover:bg-emerald-800"
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

            <div className="space-y-6">

                {/* Sejarah Section with integrated image upload */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-50 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
                        <div className="p-2.5 bg-white border border-gray-200 text-emerald-600 rounded-lg shadow-sm">
                            <History size={22} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">Sejarah Masjid</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Ceritakan perjalanan dan latar belakang pendirian masjid</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            {/* Textarea Area */}
                            <div className="flex-1 w-full order-2 lg:order-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Konten Sejarah</label>
                                <textarea
                                    value={formData.history}
                                    onChange={(e) => handleChange('history', e.target.value)}
                                    className="w-full min-h-[320px] p-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y leading-relaxed text-base transition-all"
                                    placeholder="Ceritakan sejarah berdirinya masjid disini..."
                                />
                            </div>

                            {/* Image Upload Area (Right Side) */}
                            <div className="w-full lg:w-72 flex-shrink-0 order-1 lg:order-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 items-center gap-2 flex">
                                    <ImageIcon size={16} className="text-emerald-600" /> Gambar Ilustrasi
                                </label>
                                <div className="bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-300 flex flex-col items-center">
                                    {formData.image ? (
                                        <div className="relative group w-full aspect-video lg:aspect-square mb-4">
                                            <img
                                                src={formData.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg border-2 border-white shadow-md"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                                <span className="text-white text-xs font-medium">Draft Gambar</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video lg:aspect-square mb-4 bg-white rounded-lg border-2 border-white shadow-sm flex flex-col items-center justify-center text-gray-400">
                                            <ImageIcon size={32} strokeWidth={1.5} />
                                            <span className="text-[10px] mt-2 font-medium uppercase tracking-wider">Tanpa Gambar</span>
                                        </div>
                                    )}

                                    <label className="w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-all font-bold text-sm shadow-md shadow-emerald-900/10 active:scale-95">
                                        <Upload size={16} />
                                        <span>{formData.image ? 'Ganti Foto' : 'Upload Foto'}</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-[10px] text-gray-400 mt-3 text-center leading-tight">Maksimal 2MB. Disarankan format 1:1 atau 16:9.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Visi & Misi Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Vision */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-50 bg-gray-50/50 px-6 py-4 flex items-center gap-3">
                            <div className="p-2.5 bg-white border border-gray-200 text-blue-600 rounded-lg shadow-sm">
                                <Target size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Visi</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Cita-cita jangka panjang</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <textarea
                                value={formData.vision}
                                onChange={(e) => handleChange('vision', e.target.value)}
                                className="w-full min-h-[200px] p-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y leading-relaxed text-base transition-all"
                                placeholder="Tuliskan visi jangka panjang..."
                            />
                        </div>
                    </section>

                    {/* Mission */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="border-b border-gray-50 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white border border-gray-200 text-amber-600 rounded-lg shadow-sm">
                                    <Compass size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Misi</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">Langkah-langkah pencapaian</p>
                                </div>
                            </div>
                            {/* Toolbar Misi */}
                            <div className="flex gap-1 bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
                                <button
                                    onClick={() => handleListAction('bullet')}
                                    className="p-1.5 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-md transition-colors"
                                    title="Tambah List Titik (Bullet)"
                                >
                                    <List size={18} />
                                </button>
                                <button
                                    onClick={() => handleListAction('number')}
                                    className="p-1.5 hover:bg-amber-50 text-gray-600 hover:text-amber-600 rounded-md transition-colors"
                                    title="Tambah List Angka"
                                >
                                    <ListOrdered size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <textarea
                                id="mission-textarea"
                                value={formData.mission}
                                onChange={(e) => handleChange('mission', e.target.value)}
                                className="w-full min-h-[200px] p-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y leading-relaxed text-base transition-all"
                                placeholder="Tuliskan poin-poin misi..."
                            />
                        </div>
                    </section>

                </div>
            </div>

            {!sidebarOpen && createPortal(
                <button
                    onClick={() => handleSubmit()}
                    disabled={isSaving}
                    className="sm:hidden fixed bottom-6 right-6 z-[45] bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-400 text-white p-5 rounded-full shadow-[0_20px_50px_rgba(6,78,59,0.4)] flex items-center justify-center transition-all active:scale-90 border border-white/20"
                    title="Simpan Perubahan"
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

export default EditAbout;