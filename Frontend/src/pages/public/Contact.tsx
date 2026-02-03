import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Contact = () => {
  const { state } = useApp();
  const { contactInfo } = state;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
       {/* Header - Standard Hero Style */}
      <div className="bg-emerald-800 text-white py-16 px-4 mb-12">
          <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Hubungi Kami</h1>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                  Silakan berkunjung untuk beribadah atau hubungi kami untuk informasi kegiatan masjid.
              </p>
          </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column: Contact Details */}
            <div className="space-y-6 reveal-up">
                
                {/* Address Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Alamat Masjid</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {contactInfo.address}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Phone & Email Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex flex-col gap-3">
                            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Telepon / WA</h3>
                                <p className="text-gray-600 font-medium mb-3">{contactInfo.phone}</p>
                                <a 
                                    href={`https://wa.me/${contactInfo.phone.replace(/[^0-9]/g, '')}`} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
                                >
                                    <MessageCircle size={14} /> Chat WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex flex-col gap-3">
                            <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 w-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
                                <p className="text-gray-600 text-sm break-all">{contactInfo.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operational Hours */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                        <div className="bg-amber-50 p-3 rounded-xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Jam Operasional</h3>
                            <p className="text-gray-600">{contactInfo.operationalHours}</p>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                {(contactInfo.facebook || contactInfo.instagram || contactInfo.youtube) && (
                    <div className="bg-linear-to-r from-emerald-900 to-emerald-800 p-6 rounded-2xl text-white shadow-lg reveal-up stagger-1">
                        <h3 className="text-lg font-bold mb-4">Ikuti Kami di Sosial Media</h3>
                        <div className="flex flex-wrap gap-3">
                            {contactInfo.facebook && (
                                <a 
                                    href={contactInfo.facebook} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white hover:text-emerald-900 transition-all font-medium border border-white/20"
                                >
                                    <Facebook size={18} /> Facebook
                                </a>
                            )}
                            {contactInfo.instagram && (
                                <a 
                                    href={contactInfo.instagram} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white hover:text-emerald-900 transition-all font-medium border border-white/20"
                                >
                                    <Instagram size={18} /> Instagram
                                </a>
                            )}
                            {contactInfo.youtube && (
                                <a 
                                    href={contactInfo.youtube} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-xl hover:bg-white hover:text-emerald-900 transition-all font-medium border border-white/20"
                                >
                                    <Youtube size={18} /> YouTube
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Map */}
            <div className="h-full min-h-100 lg:min-h-150 reveal-up stagger-2">
                 <div className="bg-white p-2 rounded-3xl shadow-xl border border-gray-200 h-full relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gray-200 animate-pulse -z-10"></div>
                    {contactInfo.mapEmbedLink ? (
                        <iframe 
                        src={contactInfo.mapEmbedLink} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, borderRadius: '1rem' }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Lokasi Masjid"
                        className="w-full h-full rounded-2xl shadow-inner"
                        />
                    ) : (
                        <div className="w-full h-full rounded-2xl overflow-hidden relative">
                             <img 
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" 
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" 
                                alt="Map Placeholder" 
                            />
                            <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-emerald-900/10 transition-colors"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                                <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-2 animate-bounce">
                                <MapPin className="text-red-500 fill-current" size={32} />
                                <span className="text-gray-900 font-bold text-lg">Lokasi Kami</span>
                                </div>
                                <p className="mt-4 text-white text-sm font-medium drop-shadow-lg bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
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