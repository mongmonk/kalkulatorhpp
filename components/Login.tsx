
import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

interface LoginProps {
  onLoginSuccess: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, theme, toggleTheme }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '081234567') {
      onLoginSuccess();
    } else {
      setError('Password salah, silakan coba lagi.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg p-4 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      
      <div className="max-w-md w-full bg-white dark:bg-darkCard rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kalkulator HPP Pro</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Masukkan password untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              placeholder="•••••••••"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg active:scale-95"
          >
            Masuk Sekarang
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          Versi 1.0.0 &bull; Secure Access Enabled
        </p>
      </div>
    </div>
  );
};

export default Login;
