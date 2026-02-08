import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export const GlobalToast = () => {
    const { notification, hideNotification } = useApp();

    if (!notification.isVisible) return null;

    return createPortal(
        <div className="fixed top-5 right-5 z-[10000]">
            <style>{`
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-toast {
          animation: slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

            <div className={`animate-toast bg-white rounded-xl shadow-2xl border-l-4 ${notification.type === 'error' ? 'border-red-500' : 'border-emerald-500'} p-4 flex items-center gap-4 min-w-[320px] max-w-sm ring-1 ring-black/5`}>
                <div className={`${notification.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'} p-2.5 rounded-full shadow-sm`}>
                    {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900">{notification.type === 'error' ? 'Gagal!' : 'Berhasil!'}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.message}</p>
                </div>
                <button
                    onClick={hideNotification}
                    className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>,
        document.body
    );
};
