import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Contact = () => {
    const { state } = useApp();
    const { contactInfo } = state;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            <div className="relative bg-emerald-50 py-12 px-4 mb-10 overflow-hidden border-b border-emerald-100">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full -mr-48 -mt-48 blur-3xl opacity-50"></div>
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-200/20 rounded-full -ml-32 -mt-32 blur-2xl opacity-30"></div>

                <div className={`max-w-7xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">Hubungi Kami</h1>
                    <div className="w-16 h-1.5 bg-emerald-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                        Silakan berkunjung untuk beribadah atau hubungi kami untuk informasi kegiatan masjid.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">


                    <div className={`space-y-8 transition-all duration-1000 delay-300 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>


                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-emerald-900/10 hover:border-emerald-100 hover:-translate-y-1 transition-all duration-500 group">
                            <div className="flex items-start gap-5">
                                <div className="bg-emerald-50 p-3.5 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 mb-1.5 tracking-tight">Alamat Masjid</h3>
                                    <p className="text-gray-600 leading-relaxed font-medium text-sm">
                                        {contactInfo.address}
                                    </p>
                                </div>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-emerald-900/10 hover:border-emerald-100 hover:-translate-y-1 transition-all duration-500 group">
                                <div className="flex flex-col gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900 mb-1 tracking-tight">Telepon / WA</h3>
                                        <p className="text-gray-600 font-bold mb-3 text-sm">{contactInfo.phone}</p>
                                        <a
                                            href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white bg-green-600 px-3.5 py-2 rounded-full hover:bg-green-700 transition-all shadow-lg shadow-green-900/10"
                                        >
                                            <MessageCircle size={12} /> WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-emerald-900/10 hover:border-emerald-100 hover:-translate-y-1 transition-all duration-500 group">
                                <div className="flex flex-col gap-4">
                                    <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600 w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-black text-gray-900 mb-1 tracking-tight">Email</h3>
                                        <p className="text-gray-600 text-xs font-medium break-all">{contactInfo.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-amber-900/10 hover:border-amber-100 hover:-translate-y-1 transition-all duration-500 group">
                            <div className="flex items-start gap-5">
                                <div className="bg-amber-50 p-3.5 rounded-2xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-gray-900 mb-1.5 tracking-tight">Jam Operasional</h3>
                                    <p className="text-gray-600 font-medium leading-relaxed text-sm">{contactInfo.operationalHours}</p>
                                </div>
                            </div>
                        </div>


                        {(contactInfo.facebook || contactInfo.instagram || contactInfo.youtube) && (
                            <div className="bg-linear-to-r from-emerald-900 to-emerald-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div>
                                <h3 className="text-xl font-black mb-6 tracking-tight relative z-10 uppercase tracking-widest text-[10px] opacity-80">Media Sosial Kami</h3>
                                <div className="flex flex-wrap gap-4 relative z-10">
                                    {contactInfo.facebook && (
                                        <a
                                            href={contactInfo.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-xl hover:bg-white hover:text-emerald-900 transition-all font-black text-xs uppercase tracking-widest border border-white/20 shadow-lg active:scale-95"
                                        >
                                            <Facebook size={18} /> Facebook
                                        </a>
                                    )}
                                    {contactInfo.instagram && (
                                        <a
                                            href={contactInfo.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-xl hover:bg-white hover:text-emerald-900 transition-all font-black text-xs uppercase tracking-widest border border-white/20 shadow-lg active:scale-95"
                                        >
                                            <Instagram size={18} /> Instagram
                                        </a>
                                    )}
                                    {contactInfo.youtube && (
                                        <a
                                            href={contactInfo.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-5 py-3 bg-white/10 rounded-xl hover:bg-white hover:text-emerald-900 transition-all font-black text-xs uppercase tracking-widest border border-white/20 shadow-lg active:scale-95"
                                        >
                                            <Youtube size={18} /> YouTube
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                    <div className={`h-full min-h-120 lg:min-h-[600px] transition-all duration-1000 delay-500 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="bg-white p-3 rounded-[3rem] shadow-2xl shadow-gray-200/60 border border-gray-100 h-full relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gray-100 animate-pulse -z-10"></div>
                            {contactInfo.mapEmbedLink ? (
                                <iframe
                                    src={contactInfo.mapEmbedLink}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, borderRadius: '2.5rem' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Lokasi Masjid"
                                    className="w-full h-full rounded-[2.5rem] shadow-inner grayscale hover:grayscale-0 transition-all duration-1000"
                                />
                            ) : (
                                <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                                        alt="Map Placeholder"
                                    />
                                    <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-emerald-900/5 transition-colors duration-1000"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                                        <div className="bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-3 border border-white/20 animate-bounce-slow">
                                            <MapPin className="text-red-500 fill-current" size={40} />
                                            <span className="text-gray-900 font-black text-xl tracking-tight">Lokasi Kami</span>
                                        </div>
                                        <p className="mt-6 text-white text-xs font-black uppercase tracking-widest drop-shadow-lg bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
                                            Peta belum diatur oleh admin
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
