import React, { useState, useMemo, useEffect } from 'react';
import { Category, CostItem, Product, SavedRecord } from '../types';
import { formatCurrency, generateId } from '../utils';
import ThemeToggle from './ThemeToggle';
import Instruction from './Instruction';
import * as XLSX from 'xlsx';

interface DashboardProps {
  onLogout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

type Tab = 'dashboard' | 'history' | 'instruction';

const Dashboard: React.FC<DashboardProps> = ({ onLogout, theme, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [product, setProduct] = useState<Product>(() => {
    const saved = localStorage.getItem('hpp_product_data');
    return saved ? JSON.parse(saved) : {
      id: generateId(),
      name: '',
      productionYield: 1,
      items: []
    };
  });

  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>(() => {
    const saved = localStorage.getItem('hpp_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [margin, setMargin] = useState<number>(50);

  // Persist current editing product
  useEffect(() => {
    localStorage.setItem('hpp_product_data', JSON.stringify(product));
  }, [product]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('hpp_history', JSON.stringify(savedRecords));
  }, [savedRecords]);

  // Auto-clear notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const totals = useMemo(() => {
    const breakdown = {
      [Category.BAHAN_BAKU]: 0,
      [Category.PACKAGING]: 0,
      [Category.TENAGA_KERJA]: 0,
      [Category.OPERASIONAL]: 0,
    };

    product.items.forEach(item => {
      breakdown[item.category] += (item.unitPrice || 0);
    });

    const totalCost = Object.values(breakdown).reduce((a, b) => a + b, 0);
    const hppPerUnit = product.productionYield > 0 ? totalCost / product.productionYield : 0;

    return { totalCost, breakdown, hppPerUnit };
  }, [product]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return savedRecords;
    return savedRecords.filter(record => 
      record.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [savedRecords, searchQuery]);

  const addItem = (category: Category) => {
    const newItem: CostItem = {
      id: generateId(),
      category,
      name: '',
      unitPrice: 0
    };
    setProduct(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, updates: Partial<CostItem>) => {
    setProduct(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const removeItem = (id: string) => {
    setProduct(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSaveToHistory = () => {
    if (!product.name.trim()) {
      alert("Masukkan nama produk terlebih dahulu");
      return;
    }
    
    if (product.items.length === 0) {
      alert("Masukkan minimal satu item biaya sebelum menyimpan");
      return;
    }

    const newRecord: SavedRecord = {
      id: generateId(),
      timestamp: Date.now(),
      product: { ...product },
      totalCost: totals.totalCost,
      hppPerUnit: totals.hppPerUnit
    };

    setSavedRecords(prev => [newRecord, ...prev]);
    setNotification(`Berhasil menyimpan "${product.name}" ke riwayat!`);

    setProduct({
      id: generateId(),
      name: '',
      productionYield: 1,
      items: []
    });
  };

  const loadRecord = (record: SavedRecord) => {
    setProduct({ ...record.product });
    setActiveTab('dashboard');
    setNotification(`Sedang mengedit: ${record.product.name} (dari riwayat)`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsSidebarOpen(false);
  };

  const deleteRecord = (id: string) => {
    if (confirm("Hapus data ini dari riwayat?")) {
      setSavedRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleExportExcel = () => {
    console.log('Dashboard: Export Excel button clicked');
    try {
      const rows = product.items.map(item => ({
        'Kategori': item.category,
        'Nama Item': item.name,
        'Harga': item.unitPrice
      }));

      console.log('Dashboard: Creating Excel worksheet...');
      const ws = XLSX.utils.json_to_sheet(rows);
      const summaryStartRow = rows.length + 3;
      XLSX.utils.sheet_add_aoa(ws, [
        ['RINGKASAN'],
        ['Nama Produk', product.name],
        ['Hasil Produksi', product.productionYield],
        ['Total Biaya Produksi', totals.totalCost],
        ['HPP Per Unit', totals.hppPerUnit]
      ], { origin: `A${summaryStartRow}` });

      console.log('Dashboard: Creating Excel workbook...');
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data HPP');
      
      console.log('Dashboard: Writing Excel file...');
      XLSX.writeFile(wb, `HPP_${product.name.replace(/\s+/g, '_') || 'Export'}.xlsx`);
      console.log('Dashboard: Excel file exported successfully');
    } catch (error) {
      console.error('Dashboard: Error exporting Excel:', error);
      alert('Gagal mengekspor file Excel. Silakan coba lagi.');
    }
  };

  const getPlaceholder = (category: Category) => {
    switch (category) {
      case Category.BAHAN_BAKU: return 'Contoh: Tepung Terigu';
      case Category.PACKAGING: return 'Contoh: Paper Bag / Box';
      case Category.TENAGA_KERJA: return 'Contoh: Jasa Masak / Packing';
      case Category.OPERASIONAL: return 'Contoh: Listrik / Gas / Sewa';
      default: return 'Nama item';
    }
  };

  const NavItem = ({ id, label, icon }: { id: Tab, label: string, icon: React.ReactNode }) => (
    <button
      onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 no-print ${
        activeTab === id 
        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg transition-colors duration-200">
      {/* Notifications Toast */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in no-print">
          <div className="bg-gray-900 dark:bg-primary text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold whitespace-nowrap">{notification}</span>
          </div>
        </div>
      )}

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm no-print"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-darkCard border-r border-gray-100 dark:border-gray-700 z-50 transform transition-transform duration-300 lg:translate-x-0 no-print ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-primary p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">HPP Pro</h1>
          </div>

          <nav className="flex-1 space-y-2">
            <NavItem
              id="dashboard"
              label="Kalkulator"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>}
            />
            <NavItem
              id="history"
              label="Riwayat"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <NavItem
              id="instruction"
              label="Petunjuk"
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
            />
          </nav>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tema</span>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-bold text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-darkCard/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 lg:px-8 justify-between no-print">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
            {activeTab === 'dashboard' ? 'Kalkulator HPP' : activeTab === 'history' ? 'Riwayat Perhitungan' : 'Petunjuk Penggunaan'}
          </h2>
          <div className="flex items-center gap-4">
             {activeTab === 'dashboard' && product.name && (
               <div className="hidden sm:block text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                 Sedang Diedit: {product.name}
               </div>
             )}
          </div>
        </header>

        <main className="p-4 lg:p-8 print-container">
          {activeTab === 'dashboard' ? (
            <div className="max-w-6xl mx-auto space-y-8">
              <section className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Nama Produk / Menu</label>
                    <input 
                      type="text" 
                      value={product.name}
                      onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full text-lg font-bold bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-gray-300 dark:placeholder-gray-600"
                      placeholder="Contoh: Nasi Goreng Spesial"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Hasil Produksi (Unit/Porsi)</label>
                    <input 
                      type="number" 
                      value={product.productionYield}
                      onChange={(e) => setProduct(prev => ({ ...prev, productionYield: Number(e.target.value) }))}
                      className="w-full text-lg font-bold bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-gray-300 dark:placeholder-gray-600"
                    />
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                  {Object.values(Category).map(cat => (
                    <div key={cat} className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="px-6 py-4 bg-white dark:bg-gray-800/20 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 dark:text-white text-base">{cat}</h3>
                        <button 
                          onClick={() => addItem(cat)}
                          className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all flex items-center justify-center no-print"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                      
                      <div className="p-4 space-y-4">
                        {product.items.filter(i => i.category === cat).length === 0 ? (
                          <div className="py-8 text-center text-gray-400 dark:text-gray-500 italic text-sm no-print">
                            Klik tombol + untuk menambah data {cat.toLowerCase()}
                          </div>
                        ) : (
                          product.items.filter(i => i.category === cat).map(item => (
                            <div key={item.id} className="grid grid-cols-12 gap-3 items-end bg-white dark:bg-transparent">
                              <div className="col-span-12 sm:col-span-8">
                                <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1 block">Nama Item</label>
                                <input 
                                  type="text" 
                                  value={item.name}
                                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-300 dark:placeholder-gray-600"
                                  placeholder={getPlaceholder(cat)}
                                />
                              </div>
                              <div className="col-span-10 sm:col-span-3">
                                <label className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1 block">Harga</label>
                                <input 
                                  type="number" 
                                  value={item.unitPrice || ''}
                                  onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) })}
                                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-gray-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder-gray-300 dark:placeholder-gray-600"
                                />
                              </div>
                              <div className="col-span-2 sm:col-span-1 flex justify-end no-print">
                                <button 
                                  onClick={() => removeItem(item.id)}
                                  className="p-2.5 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24 z-10 summary-card">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Ringkasan Biaya</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between items-center text-base font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-50 dark:border-gray-700">
                        <span>Total Produksi</span>
                        <span className="text-primary font-black">{formatCurrency(totals.totalCost)}</span>
                      </div>
                    </div>

                    <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-6 border border-primary/10 text-center mb-6">
                      <p className="text-sm text-primary font-bold mb-1">HPP per Unit</p>
                      <h2 className="text-4xl font-black text-primary">
                        {formatCurrency(Math.round(totals.hppPerUnit))}
                      </h2>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 uppercase tracking-widest font-bold">
                        Berdasarkan {product.productionYield} Unit
                      </p>
                    </div>

                    <div className="mb-8 space-y-3 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50">
                      <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Rincian Per Porsi</h4>
                      {Object.values(Category).map(cat => {
                        const subtotal = totals.breakdown[cat];
                        const perUnit = product.productionYield > 0 ? subtotal / product.productionYield : 0;
                        const percentage = totals.totalCost > 0 ? (subtotal / totals.totalCost) * 100 : 0;
                        
                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600 dark:text-gray-400 font-medium">{cat}</span>
                              <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(Math.round(perUnit))}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1 rounded-full overflow-hidden no-print">
                              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 no-print">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Simulasi Harga Jual</h4>
                        <div className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Smart Suggester</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase block mb-2">Target Margin (%)</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {[30, 50, 70].map(val => (
                              <button
                                key={val}
                                onClick={() => setMargin(val)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${margin === val ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/20' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                              >
                                {val}%
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary/20 transition-all" />
                            <span className="text-gray-400 font-bold">%</span>
                          </div>
                        </div>

                        <div className="bg-secondary/5 dark:bg-secondary/10 p-4 rounded-xl border border-secondary/10">
                          <p className="text-xs text-secondary/70 font-bold uppercase tracking-wider mb-1">Rekomendasi Harga:</p>
                          <p className="text-2xl font-black text-secondary">{formatCurrency(Math.round(totals.hppPerUnit / (1 - (margin / 100)) || 0))}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3 no-print">
                       <button onClick={handleSaveToHistory} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-emerald-600 text-white py-3.5 rounded-2xl transition-all font-bold shadow-lg shadow-primary/20 active:scale-95">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                         Simpan Riwayat
                       </button>
                       <div className="grid grid-cols-2 gap-3">
                          <button onClick={handleExportExcel} className="flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 py-2.5 rounded-2xl transition-all text-xs font-bold border border-emerald-100/50 dark:border-emerald-800/30">Excel</button>
                          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-2xl transition-all text-xs font-bold border border-gray-100/50 dark:border-gray-700/30">Cetak</button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'instruction' ? (
            <Instruction theme={theme} />
          ) : (
            <div className="max-w-6xl mx-auto space-y-6">
              {savedRecords.length > 0 && (
                <div className="bg-white dark:bg-darkCard p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 no-print">
                  <div className="bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Cari nama produk..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 font-medium text-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {filteredRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {searchQuery ? 'Tidak Ada Hasil' : 'Riwayat Kosong'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery ? `Pencarian untuk "${searchQuery}" tidak ditemukan.` : 'Belum ada perhitungan yang disimpan ke riwayat.'}
                  </p>
                  {!searchQuery && (
                    <button 
                      onClick={() => setActiveTab('dashboard')}
                      className="mt-6 bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20"
                    >
                      Buat Perhitungan Baru
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRecords.map(record => (
                    <div key={record.id} className="bg-white dark:bg-darkCard rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{record.product.name}</h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">
                            {new Date(record.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <button 
                          onClick={() => deleteRecord(record.id)}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all no-print"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Biaya</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(record.totalCost)}</p>
                        </div>
                        <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-xl border border-primary/10">
                          <p className="text-[10px] text-primary font-bold uppercase mb-1">HPP / Unit</p>
                          <p className="text-sm font-black text-primary">{formatCurrency(Math.round(record.hppPerUnit))}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => loadRecord(record)}
                        className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white py-2.5 rounded-xl font-bold transition-all no-print"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Edit / Gunakan Kembali
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
        
        @keyframes bounce-in {
          0% { transform: translate(-50%, -100%); opacity: 0; }
          70% { transform: translate(-50%, 10%); opacity: 1; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @media print {
          aside, header, button, .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .lg\\:pl-64 { padding-left: 0 !important; }
          main { padding: 0 !important; }
          section, .summary-card, .bg-white, .dark\\:bg-darkCard { 
            background: transparent !important; 
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            margin-bottom: 1.5rem !important;
          }
          .sticky { position: static !important; display: block !important; }
          input { border: none !important; background: transparent !important; padding-left: 0 !important; font-weight: bold !important; }
          .grid { display: grid !important; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
