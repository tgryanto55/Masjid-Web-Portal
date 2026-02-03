import { useState } from 'react';
import { Copy, CreditCard, CheckCircle, Smartphone, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Donation = () => {
  const { state } = useApp();
  const { donationInfo } = state;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsappLink = () => {
    const phone = donationInfo.confirmationPhone.replace(/[^0-9]/g, '');
    const message = `Assalamualaikum, saya ingin konfirmasi donasi/infaq ke rekening ${donationInfo.bankName} sebesar Rp...`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header - Standard Hero Style */}
      <div className="bg-emerald-800 text-white py-16 px-4 mb-12">
          <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Infaq & Shodaqoh</h1>
              <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                  Salurkan sebagian harta Anda untuk kemakmuran masjid dan bekal di akhirat kelak.
              </p>
          </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Bank Info (Span 7) */}
            <div className="md:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 reveal-up">
                    <div className="bg-linear-to-r from-emerald-600 to-emerald-800 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-2">
                             <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <CreditCard size={24} className="text-white" />
                             </div>
                             <h2 className="text-xl font-bold">Rekening Operasional</h2>
                        </div>
                        <p className="text-emerald-50 text-sm ml-11 opacity-90">Bank Syariah / Konvensional</p>
                    </div>
                    
                    <div className="p-8">
                        <div className="text-center mb-8">
                           <p className="text-gray-500 font-medium mb-1 uppercase tracking-widest text-xs">Bank Tujuan</p>
                           <h3 className="text-2xl font-bold text-emerald-800">{donationInfo.bankName}</h3>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 hover:border-emerald-300 transition-colors group relative">
                             <p className="text-xs text-center text-gray-400 mb-2 font-bold uppercase">Nomor Rekening</p>
                             <div className="flex items-center justify-center gap-3 flex-wrap relative z-10">
                                <span className="text-3xl sm:text-4xl font-mono font-bold text-gray-800 tracking-tighter group-hover:text-emerald-700 transition-colors">
                                    {donationInfo.accountNumber}
                                </span>
                             </div>
                             <div className="mt-4 flex justify-center">
                                <button 
                                    onClick={() => copyToClipboard(donationInfo.accountNumber)} 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all transform active:scale-95 ${
                                        copied 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200'
                                    }`}
                                >
                                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copied ? 'Tersalin' : 'Salin Nomor'}
                                </button>
                             </div>
                        </div>

                        <div className="mt-8 text-center border-t border-gray-100 pt-6">
                            <p className="text-gray-500 text-sm mb-1">Atas Nama</p>
                            <p className="text-xl font-bold text-gray-900">{donationInfo.accountName}</p>
                        </div>
                    </div>
                </div>

                {/* Confirmation Box */}
                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex flex-col sm:flex-row gap-5 items-start reveal-up stagger-1 shadow-sm hover:shadow-md transition-all">
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-full shrink-0">
                        <Smartphone size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi Donasi</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            Mohon lakukan konfirmasi setelah transfer agar dapat kami catat dalam laporan keuangan masjid dan menjaga transparansi dana umat.
                        </p>
                        <a 
                            href={getWhatsappLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-green-900/10"
                        >
                            <Smartphone size={16} />
                            Konfirmasi via WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Column: QRIS (Span 5) */}
            <div className="md:col-span-5 reveal-up stagger-2">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 h-full flex flex-col">
                    <div className="bg-gray-900 p-6 text-white text-center">
                        <h3 className="font-bold text-lg">Scan QRIS</h3>
                        <p className="text-gray-400 text-xs mt-1">Menerima semua e-wallet & mobile banking</p>
                    </div>
                    <div className="p-8 flex-1 flex flex-col items-center justify-center bg-gray-50/50">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                             {donationInfo.qrisImage ? (
                                <img 
                                    src={donationInfo.qrisImage} 
                                    alt="QRIS Masjid Raya" 
                                    className="w-full max-w-70 h-auto object-contain"
                                />
                            ) : (
                                <div className="w-64 h-64 bg-gray-100 flex flex-col items-center justify-center rounded-xl text-gray-400 border-2 border-dashed border-gray-300">
                                    <AlertCircle size={48} className="mb-2 opacity-50" />
                                    <span className="text-sm font-medium">QR Code belum tersedia</span>
                                </div>
                            )}
                        </div>
                        <div className="mt-6 flex gap-3 justify-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Dummy logos for visual cue */}
                            <div className="h-6 bg-gray-300 w-12 rounded"></div>
                            <div className="h-6 bg-gray-300 w-12 rounded"></div>
                            <div className="h-6 bg-gray-300 w-12 rounded"></div>
                            <div className="h-6 bg-gray-300 w-12 rounded"></div>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Pastikan nama merchant adalah <br/>
                            <strong className="text-gray-700">{donationInfo.accountName}</strong>
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Donation;