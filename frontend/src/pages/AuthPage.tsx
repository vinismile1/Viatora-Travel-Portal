import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Mail, Lock, User, KeyRound, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AuthPage({ 
  onBackToLanding, 
  initialMode = 'login' 
}: { 
  onBackToLanding?: () => void; 
  initialMode?: 'login' | 'register' 
}) {
  const { login, register } = useApp();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  // Sync mode if initialMode prop changes
  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (!isLogin && !name) return;

    setLoading(true);
    let success = false;
    if (isLogin) {
      success = await login(email, password);
    } else {
      success = await register(name, email, password);
    }
    setLoading(false);
  };

  return (
    <div id="auth_page_container" className="min-h-screen bg-theme-bg flex items-center justify-center py-12 px-6 text-theme-text transition-colors duration-300">
      <div className="max-w-md w-full bg-theme-card rounded-[2.5rem] border border-theme-border shadow-2xl overflow-hidden flex flex-col p-8 text-center animate-in fade-in zoom-in-95 duration-300 relative">
        
        {/* Back Button */}
        {onBackToLanding && (
          <button
            id="auth_back_to_landing_btn"
            type="button"
            onClick={onBackToLanding}
            className="absolute top-6 left-6 text-theme-muted hover:text-theme-text transition duration-150 flex items-center gap-1 bg-theme-panel hover:bg-theme-panel/80 px-3 py-1.5 rounded-full border border-theme-border text-[10px] font-semibold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={11} /> Back
          </button>
        )}
        
        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-primary to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-primary/20 mb-3">
            <Compass size={24} />
          </div>
          <h2 className="font-display font-extrabold text-2xl text-theme-text tracking-tight">
            Viatora Travel Companion
          </h2>
          <p className="text-theme-muted text-xs mt-1 max-w-xs mx-auto leading-relaxed">
            AI-powered personalized itineraries, booking registries, and live trip companions.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-theme-panel p-1.5 rounded-2xl mb-6 border border-theme-border">
          <button
            id="auth_toggle_login_btn"
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              isLogin ? 'bg-theme-bg text-theme-text border border-theme-border shadow-md' : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            Log In
          </button>
          <button
            id="auth_toggle_register_btn"
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
              !isLogin ? 'bg-theme-bg text-theme-text border border-theme-border shadow-md' : 'text-theme-muted hover:text-theme-text'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-left text-[11px] font-semibold text-theme-muted mb-1">FULL NAME</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-theme-muted" />
                <input
                  id="auth_name_input"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-theme-panel border border-theme-border rounded-xl text-sm outline-none focus:border-primary text-theme-text transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-left text-[11px] font-semibold text-theme-muted mb-1">EMAIL ADDRESS</label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3 text-theme-muted" />
              <input
                id="auth_email_input"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-theme-panel border border-theme-border rounded-xl text-sm outline-none focus:border-primary text-theme-text transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-left text-[11px] font-semibold text-theme-muted mb-1">PASSWORD</label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3 text-theme-muted" />
              <input
                id="auth_password_input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-theme-panel border border-theme-border rounded-xl text-sm outline-none focus:border-primary text-theme-text transition"
              />
            </div>
          </div>

          <button
            id="auth_submit_btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <KeyRound size={14} />
                <span>{isLogin ? 'Log In to Profile' : 'Complete Registration'}</span>
              </>
            )}
          </button>
        </form>

        {/* Feature Highlights Footer */}
        <div className="mt-8 pt-6 border-t border-theme-border flex items-center justify-center gap-4 text-theme-muted text-[10px] uppercase font-semibold">
          <span className="flex items-center gap-1">
            <Sparkles size={11} className="text-amber-500" /> Personalized
          </span>
          <span>•</span>
          <span>Live Bookings</span>
          <span>•</span>
          <span>Checklists</span>
        </div>

      </div>
    </div>
  );
}
export default AuthPage;
