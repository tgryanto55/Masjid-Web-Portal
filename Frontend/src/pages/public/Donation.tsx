import { useState, useEffect } from 'react';
import {
  Copy,
  CreditCard,
  CheckCircle,
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Donation = () => {
  const { state } = useApp();
  const { donationInfo } = state;

  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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

      {/* ===== AIRY HEADER (SAMA DENGAN CONTACT) ===== */}
      <div className="relative bg-emerald-50 py-14 px-4 mb-12 overflow-hidden border-b border-emerald-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full -mr-48 -mt-48 blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-200/20 rounded-full -ml-32 -mt-32 blur-2xl opacity-30"></div>

        <div
          className={`max-w-7xl mx-auto text-center relative z-10 transition-all duration-1000 transform ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
            Donasi Masjid
          </h1>
          <div className="w-16 h-1.5 bg-emerald-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Salurkan infaq dan sedekah terbaik Anda untuk mendukung kegiatan dan operasional masjid.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* ===== LEFT : REKENING ===== */}
          <div
            className={`transition-all duration-1000 delay-200 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-emerald-900/10 hover:border-emerald-100 hover:-translate-y-1 transition-all duration-500 group">

              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 rounded-t-[2rem] text-white flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl">Rekening Donasi</h3>
                  <p className="text-[10px] uppercase tracking-widest opacity-80">
                    Bank Syariah / Konvensional
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
                    Bank Tujuan
                  </p>
                  <h4 className="text-xl font-black text-emerald-700">
                    {donationInfo.bankName}
                  </h4>
                </div>

                <div className="bg-slate-50 border-2 border-dashed border-gray-200 rounded-xl p-5 text-center group-hover:border-emerald-300 transition-all">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-2">
                    Nomor Rekening
                  </p>
                  <p className="text-2xl font-mono font-black tracking-tight">
                    {donationInfo.accountNumber}
                  </p>

                  <button
                    onClick={() => copyToClipboard(donationInfo.accountNumber)}
                    className={`mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-black transition-all active:scale-95 ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/20'
                    }`}
                  >
                    {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    {copied ? 'Tersalin' : 'Salin'}
                  </button>
                </div>

                <div className="text-center border-t pt-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
                    Atas Nama
                  </p>
                  <p className="font-black text-gray-900">
                    {donationInfo.accountName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT : QRIS + KONFIRMASI ===== */}
          <div
            className={`space-y-6 transition-all duration-1000 delay-400 transform ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* QRIS */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-gray-300/60 hover:-translate-y-1 transition-all duration-500 group">
              <div className="bg-gray-900 text-white text-center p-5 rounded-t-[2rem]">
                <h3 className="font-black text-lg">Scan QRIS</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">
                  Semua E-Wallet & M-Banking
                </p>
              </div>

              <div className="p-6 flex flex-col items-center gap-4">
                {donationInfo.qrisImage ? (
                  <img
                    src={donationInfo.qrisImage}
                    alt="QRIS"
                    className="w-full max-w-40 object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400">
                    <AlertCircle size={32} />
                    <span className="text-[10px] font-black uppercase mt-2">
                      QR belum tersedia
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
                    Nama Merchant
                  </p>
                  <p className="font-black text-gray-900 text-sm">
                    {donationInfo.accountName}
                  </p>
                </div>
              </div>
            </div>

            {/* KONFIRMASI */}
            <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-xl shadow-amber-900/5 hover:-translate-y-1 transition-all duration-500">
              <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl">
                <Smartphone size={28} />
              </div>
              <div>
                <h4 className="font-black text-gray-900 mb-1">
                  Konfirmasi Donasi
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Mohon konfirmasi setelah transfer
                </p>
                <a
                  href={getWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-black shadow-lg shadow-green-900/20 active:scale-95"
                >
                  <Smartphone size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Donation;
