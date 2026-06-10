import React, { useState } from 'react';
import Logo from './Logo';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Key, 
  BookOpen,
  Calculator,
  ShieldCheck,
  ChevronRight,
  Database,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSearchRequest: () => void;
}

export default function Header({ activeTab, onSelectTab, onSearchRequest }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // Login form simulation inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsLogged(true);
      setLoginModalOpen(false);
      alert(`System connection established. Session authenticated for workspace: ${username}`);
    }
  };

  const navItems = [
    { id: 'home', label: 'Index Feed' },
    { id: 'calculators', label: 'Solvers' },
    { id: 'database', label: 'Technical Database' },
    { id: 'articles', label: 'Research Journals' },
    { id: 'roadmap', label: 'Launch Plan' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-[#D9DDD5] py-3 flex items-center shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Brand Logo Link to home */}
          <button 
            type="button" 
            onClick={() => { onSelectTab('home'); setMobileMenuOpen(false); }}
            className="hover:opacity-90 transition cursor-pointer"
          >
            <Logo height={32} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`pb-0.5 text-sm font-medium transition cursor-pointer border-b-2 ${
                  activeTab === item.id 
                    ? 'text-[#234734] border-[#234734] font-bold' 
                    : 'text-gray-500 hover:text-[#234734] border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Tools / Actions Panel */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Global search trigger */}
            <button 
              type="button"
              onClick={onSearchRequest}
              className="relative flex items-center w-72 bg-[#F0F2ED] border border-[#D9DDD5] rounded-md px-3 py-1.5 text-xs text-gray-400 hover:bg-white focus:outline-none transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
              <span className="font-sans text-xs tracking-tight">Search ASTM, FEFCO, calculators...</span>
              <kbd className="absolute right-2 top-1.5 text-[10px] text-gray-400 border border-gray-300 px-1 rounded bg-white">⌘K</kbd>
            </button>

            {/* Premium Client Access (Login) */}
            {!isLogged ? (
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="px-4 py-1.5 bg-[#234734] text-white rounded text-sm font-medium hover:bg-opacity-90 transition cursor-pointer"
              >
                Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsLogged(false);
                  setUsername('');
                  setPassword('');
                }}
                className="px-4 py-1.5 border border-[#D9DDD5] hover:bg-red-50 hover:text-red-700 text-brand-graphite rounded text-sm font-medium transition cursor-pointer"
              >
                Log Out ({username.split('@')[0]})
              </button>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={onSearchRequest}
              className="p-1.5 border border-brand-border rounded hover:bg-brand-bg text-brand-graphite/70"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-brand-border rounded hover:bg-brand-bg text-brand-graphite"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-brand-border shadow-md z-30 flex flex-col p-5 gap-3">
          <div className="text-[10px] font-mono font-bold tracking-widest text-brand-graphite/40 uppercase mb-1">
            Index Directories
          </div>
          
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left text-sm font-semibold py-2 px-3 rounded-lg transition ${
                activeTab === item.id 
                  ? 'bg-brand-sage/15 text-brand-deep font-bold border-l-3 border-brand-deep' 
                  : 'text-brand-graphite hover:bg-brand-bg'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="h-[1px] bg-brand-border my-2"></div>

          {!isLogged ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setLoginModalOpen(true);
              }}
              className="w-full bg-brand-deep text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition"
            >
              <User className="w-4 h-4" />
              LOG IN
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsLogged(false);
                setMobileMenuOpen(false);
              }}
              className="w-full border border-red-300 hover:bg-red-50 text-red-700 font-bold text-xs py-2.5 rounded-lg block"
            >
              LOG OUT
            </button>
          )}
        </div>
      )}

      {/* Login Authentication Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 bg-brand-graphite/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white border border-brand-border rounded-xl shadow-tech max-w-sm w-full p-6 relative animate-in fade-in-50 zoom-in-95 duration-200"
            role="dialog"
          >
            <button
              type="button"
              onClick={() => setLoginModalOpen(false)}
              className="absolute right-4 top-4 text-brand-graphite/40 hover:text-brand-graphite text-lg"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="w-11 h-11 bg-brand-sage/15 rounded-full flex items-center justify-center mx-auto mb-3">
                <Key className="w-5 h-5 text-brand-deep" />
              </div>
              <h4 className="text-lg font-display font-semibold text-brand-deep">Enterprise Authentication</h4>
              <p className="text-xs text-brand-graphite/60 mt-1 font-sans">
                Access your CALYXPACK workspace with corporate credentials.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-[#7BA05B] uppercase mb-1">Corporate Email</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. engineer@calyxpack.in"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-xs border border-brand-border rounded p-2.5 bg-brand-bg/60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-brand-graphite/50 uppercase mb-1">Access Token / Password</label>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs border border-brand-border rounded p-2.5 bg-brand-bg/60"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-brand-graphite/60 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" className="accent-brand-deep rounded" />
                  <span>Remember Session</span>
                </label>
                <a href="#reset" className="hover:underline font-semibold text-brand-sage">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-deep text-white font-bold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition shadow cursor-pointer mt-4"
              >
                ESTABLISH CONNECTION
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
