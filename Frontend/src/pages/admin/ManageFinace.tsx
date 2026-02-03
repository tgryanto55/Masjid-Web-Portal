import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../context/AppContext';
import { Button } from '../../components/UI/Button';
import { Trash, ArrowUpCircle, ArrowDownCircle, Wallet, Plus, ChevronLeft, ChevronRight, CheckCircle, X, Loader2, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  'Infaq',
  'Operasional',
  'Pembangunan',
  'Yatim & Dhuafa',
  'Lainnya'
];

const ManageFinance = () => {
  const { state, addTransaction, deleteTransaction } = useApp();
  const { transactions } = state;

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'income' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    category: CATEGORIES[0]
  });

  // UX States
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Auto-hide Toast after 4 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Adjust pagination if items are deleted
  useEffect(() => {
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [transactions.length, currentPage]);

  // Calculate Summaries
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    
    setIsSaving(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 600));

    await addTransaction({
      ...formData,
      amount: Number(formData.amount)
    });

    // Reset simple form, keep date
    setFormData(prev => ({
      ...prev,
      title: '',
      amount: '',
      category: CATEGORIES[0]
    }));
    
    // Reset to first page to see new entry
    setCurrentPage(1);
    setIsSaving(false);
    
    setToastMessage('Transaksi berhasil dicatat.');
    setShowToast(true);
  };

  const confirmDelete = (id: string | number) => {
      setDeleteId(id);
  };

  const executeDelete = async () => {
      if (deleteId) {
          setIsDeleting(true);
          // Simulate small delay for effect
          await new Promise(resolve => setTimeout(resolve, 500));
          await deleteTransaction(deleteId);
          setIsDeleting(false);
          setDeleteId(null);
          setToastMessage('Transaksi berhasil dihapus.');
          setShowToast(true);
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Styles for animation */}
      <style>{`
        @keyframes fadeInSlide {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-row {
          animation: fadeInSlide 0.4s ease-out forwards;
          opacity: 0; /* start hidden */
        }
        @keyframes popIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
            animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Keuangan Masjid</h2>
        <p className="text-gray-500">Kelola pemasukan dan pengeluaran operasional masjid.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="bg-blue-100 p-4 rounded-lg text-blue-600">
            <Wallet size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Saldo Saat Ini</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatRupiah(balance)}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="bg-emerald-100 p-4 rounded-lg text-emerald-600">
            <ArrowUpCircle size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Pemasukan</p>
            <p className="text-2xl font-bold text-emerald-600">{formatRupiah(totalIncome)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="bg-red-100 p-4 rounded-lg text-red-600">
            <ArrowDownCircle size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600">{formatRupiah(totalExpense)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
             <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-emerald-600" /> Tambah Transaksi
             </h3>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700">Judul Transaksi</label>
                   <input 
                      type="text" 
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Contoh: Infaq Jumat"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Jumlah (Rp)</label>
                   <input 
                      type="number" 
                      required
                      min="0"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="0"
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                   />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jenis</label>
                    <div className="mt-1 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, type: 'income'})}
                            className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                                formData.type === 'income' 
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Pemasukan
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, type: 'expense'})}
                            className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                                formData.type === 'expense' 
                                ? 'bg-red-600 text-white border-red-600 shadow-sm' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            Pengeluaran
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                    <input 
                      type="date" 
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Kategori</label>
                   <select 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                   >
                       {CATEGORIES.map((cat) => (
                           <option key={cat} value={cat}>{cat}</option>
                       ))}
                   </select>
                </div>
                <Button type="submit" disabled={isSaving} className="w-full shadow-lg shadow-emerald-900/10 flex justify-center items-center gap-2">
                    {isSaving ? (
                        <>
                            <Loader2 size={18} className="animate-spin" /> Menyimpan...
                        </>
                    ) : (
                        'Simpan Transaksi'
                    )}
                </Button>
             </form>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Riwayat Transaksi</h3>
                    <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                      Total: {transactions.length} Data
                    </span>
                </div>
                <div className="overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        {/* Key on tbody forces re-render for animation on page change */}
                        <tbody className="bg-white divide-y divide-gray-200" key={currentPage}>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                                        Belum ada data transaksi.
                                    </td>
                                </tr>
                            ) : (
                                currentTransactions.map((t, index) => (
                                    <tr 
                                        key={t.id} 
                                        className="hover:bg-gray-50 transition-colors animate-row"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(t.date).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <div className="font-medium">{t.title}</div>
                                            {t.category && <div className="text-xs text-gray-400 mt-0.5 inline-block px-1.5 py-0.5 bg-gray-100 rounded">{t.category}</div>}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-bold ${
                                            t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                            {t.type === 'income' ? '+ ' : '- '}
                                            {formatRupiah(t.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => confirmDelete(t.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg"
                                                title="Hapus Transaksi"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination Controls */}
                {transactions.length > itemsPerPage && (
                    <div className="bg-white px-4 py-3 border-t border-gray-100 flex items-center justify-between sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <Button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                variant="outline"
                                size="sm"
                            >
                                Sebelumnya
                            </Button>
                            <Button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                variant="outline"
                                size="sm"
                            >
                                Selanjutnya
                            </Button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Menampilkan <span className="font-medium">{indexOfFirstItem + 1}</span> sampai <span className="font-medium">{Math.min(indexOfLastItem, transactions.length)}</span> dari <span className="font-medium">{transactions.length}</span> data
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    {/* Page Numbers */}
                                    <div className="relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700">
                                       Halaman {currentPage} dari {totalPages}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRight size={20} />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Custom Confirmation Modal (Toast Style) */}
      {deleteId && createPortal(
          <div className="fixed inset-0 z-10000 flex items-center justify-center sm:items-start sm:pt-20">
              <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setDeleteId(null)}></div>
              <div className="animate-pop-in bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 relative z-10 border border-gray-100">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                          <AlertTriangle size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Transaksi?</h3>
                      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                          Apakah anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                      </p>
                      <div className="flex gap-3 w-full">
                          <button 
                              onClick={() => setDeleteId(null)}
                              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                          >
                              Batal
                          </button>
                          <button 
                              onClick={executeDelete}
                              disabled={isDeleting}
                              className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
                          >
                              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash size={16} />}
                              <span>Hapus</span>
                          </button>
                      </div>
                  </div>
              </div>
          </div>,
          document.body
      )}

      {/* Success Toast Notification */}
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
                    <h4 className="text-sm font-bold text-gray-900">Berhasil!</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{toastMessage}</p>
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

export default ManageFinance;