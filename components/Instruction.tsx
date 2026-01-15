import React from 'react';

interface InstructionProps {
  theme: 'light' | 'dark';
}

const Instruction: React.FC<InstructionProps> = ({ theme }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          Petunjuk Penggunaan Aplikasi
        </h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Selamat datang di HPP Pro! Aplikasi ini dirancang untuk membantu Anda menghitung Harga Pokok Produksi (HPP) produk dengan mudah dan akurat.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Memulai Perhitungan</h2>
          </div>
          
          <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Masukkan nama produk</p>
                <p>Isi nama produk atau menu yang akan dihitung HPP-nya</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Tentukan hasil produksi</p>
                <p>Masukkan jumlah unit/porsi yang dihasilkan dari proses produksi</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Tambahkan item biaya</p>
                <p>Klik tombol + pada setiap kategori untuk menambahkan item biaya</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-secondary/10 p-2 rounded-lg text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kategori Biaya</h2>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
              <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">Bahan Baku</h3>
              <p className="text-gray-600 dark:text-gray-400">Semua bahan utama yang digunakan dalam produksi</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-1">Packaging</h3>
              <p className="text-gray-600 dark:text-gray-400">Kemasan, botol, plastik, dan material pengemas</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30">
              <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-1">Tenaga Kerja</h3>
              <p className="text-gray-600 dark:text-gray-400">Upah pekerja, jasa outsourcing, dan biaya tenaga kerja lainnya</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30">
              <h3 className="font-bold text-orange-700 dark:text-orange-400 mb-1">Operasional</h3>
              <p className="text-gray-600 dark:text-gray-400">Listrik, gas, sewa, dan biaya operasional lainnya</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-500/10 p-2 rounded-lg text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fitur Tambahan</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Riwayat Perhitungan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Simpan dan lihat kembali perhitungan HPP yang telah dibuat</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m12 0v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Export Excel</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unduh hasil perhitungan dalam format Excel</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Simulasi Harga Jual</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hitung harga jual berdasarkan target margin yang diinginkan</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Mode Cetak</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cetak hasil perhitungan untuk dokumentasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 p-6 rounded-2xl border border-primary/10 dark:border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary p-2 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tips & Trik</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white">💡 Akurasi Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pastikan semua data biaya yang dimasukkan akurat dan sesuai dengan harga terkini untuk hasil HPP yang tepat.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white">💾 Simpan Sering</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gunakan fitur riwayat untuk menyimpan perhitungan penting agar dapat dilihat kembali di kemudian hari.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white">📊 Analisis Margin</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gunakan simulasi harga jual untuk menentukan margin yang optimal sesuai target bisnis Anda.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white">🔄 Update Berkala</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Perbarui data biaya secara berkala untuk mengantisipasi perubahan harga bahan baku dan operasional.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Instruction;