import React, { useState } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  Users, 
  Cpu, 
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { sanitizeInput } from '../utils/sanitize';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="bg-gradient-to-br from-[#0c1310] via-brand-deep to-brand-graphite rounded-2xl text-white overflow-hidden shadow-tech relative border border-[#7BA05B]/30 mb-8">
      {/* Blueprint Grid pattern Overlay */}
      <div className="absolute inset-0 bg-blueprint-dark opacity-45 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#7BA05B]/10 rounded-full blur-3xl pointer-events-none animate-laser"></div>

      <div className="px-6 py-12 md:p-14 lg:p-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Texts */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 bg-[#7BA05B]/20 border border-[#7BA05B]/40 text-[#aedd91] px-3.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5 text-[#7BA05B]" />
            WEEKLY TECHNICAL BRIEFINGS
          </div>

          <h3 className="text-3xl md:text-4xl font-extrabold font-display leading-[1.1] text-white">
            Curated by Packaging Professionals
          </h3>
          
          <p className="text-xs md:text-sm text-brand-border/85 max-w-xl leading-relaxed font-sans">
            Join 12,000+ packaging technologists, materials engineers, and converters in India and Europe receiving weekly technical reviews, calculators, regulatory standards updates, and structural innovations.
          </p>

          <div className="p-3 bg-white/5 border border-white/10 rounded-lg max-w-lg">
            <span className="text-[10px] font-mono text-[#7BA05B] uppercase block font-bold mb-1">Weekly Technical Insights Schedule:</span>
            <p className="text-[11px] text-white/70 leading-normal font-sans">
              • Tuesday: ASTM mechanical testing updates &amp; corrugated parameters.<br />
              • Thursday: Flexible laminate WVTR calculations and polymer price indexing.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 text-[10.5px] text-brand-border/75 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-[#7BA05B] font-bold">&#10003;</span> No promotional spam
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#7BA05B] font-bold">&#10003;</span> Verified R&amp;D Logs
            </div>
            <div className="flex items-[#7BA05B] gap-1.5">
              <span className="text-[#7BA05B] font-bold">&#10003;</span> Free standard updates
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="lg:col-span-5 bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-white/10 shadow-tech relative">
          
          {/* Decorative scanner line */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#7BA05B] to-transparent"></div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center pb-2">
                <span className="text-[10px] font-mono text-[#7BA05B] uppercase font-bold block">INTEL HUB MEMBERSHIP</span>
                <span className="text-xs text-white/50 block font-sans">Enter corporate coordinates to synchronize</span>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-border/90 mb-1.5 font-mono uppercase tracking-wider">Professional Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Anand Sharma"
                  value={name}
                  onChange={(e) => setName(sanitizeInput(e.target.value))}
                  className="w-full text-xs font-mono border border-white/20 bg-white/5 rounded-lg px-3.5 py-3 text-white focus:border-[#7BA05B] focus:ring-1 focus:ring-[#7BA05B] placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-brand-border/90 mb-1.5 font-mono uppercase tracking-wider">Corporate Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. anand@packaging.com"
                    value={email}
                    onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                    className="w-full text-xs font-mono border border-white/20 bg-white/5 rounded-lg pl-10 pr-3.5 py-3 text-white focus:border-[#7BA05B] focus:ring-1 focus:ring-[#7BA05B] placeholder:text-white/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#7BA05B] hover:bg-opacity-95 text-brand-deep font-bold text-xs py-3.5 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-md hover:shadow-[#7BA05B]/30 cursor-pointer transition-all duration-300 transform active:scale-95 glow-btn-sage uppercase tracking-wider"
              >
                {loading ? 'CALIBRATING ACCESS...' : 'SUBSCRIBE TO INTEL LOGS'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-[#7BA05B]/20 rounded-full flex items-center justify-center mx-auto border border-[#7BA05B]/40">
                <CheckCircle2 className="w-6 h-6 text-[#7BA05B]" />
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-white font-display">System Synchronisation Successful</h4>
                <p className="text-xs text-brand-border/80 mt-1 font-sans">
                  Welcome to the log table, <strong>{name}</strong>. A verification package has been dispatched to <strong>{email}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                  setName('');
                }}
                className="text-xs text-[#7BA05B] hover:underline flex items-center gap-1 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Return to form
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
