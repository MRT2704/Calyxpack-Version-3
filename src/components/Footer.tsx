import React from 'react';
import Logo from './Logo';
import { 
  FileText, 
  Linkedin, 
  Mail, 
  MapPin, 
  Activity,
  Phone,
  ArrowRight,
  ShieldCheck,
  Scale,
  Award
} from 'lucide-react';

export default function Footer({ onSwitchTab }: { onSwitchTab: (tab: string) => void }) {
  return (
    <footer className="bg-gradient-to-b from-[#0e1612] to-brand-graphite text-brand-border/90 border-t border-[#7BA05B]/30 pt-16 pb-12 mt-16 relative">
      
      {/* Blueprint background grid for authentic packaging engineering visual */}
      <div className="absolute inset-0 bg-blueprint-dark opacity-35 pointer-events-none"></div>

      {/* Animated Top laser accent border dividing body from footer */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#7BA05B] to-transparent animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 border-b border-brand-border/10 pb-12 mb-10">
        
        {/* About & Brand Column - 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <Logo variant="dark" height={36} />
          
          <p className="text-xs text-brand-border/70 leading-relaxed font-sans pt-1">
            CalyxPack is a world-class packaging engineering intelligence OS. Designed for technologists, R&amp;D divisions, materials developers, and converter agencies to achieve absolute physical accuracy.
          </p>

          <div className="flex gap-4 pt-1 flex-wrap">
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded text-[9.5px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7BA05B]" />
              <span>IS-2771 PARAMS</span>
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded text-[9.5px] font-mono">
              <Award className="w-3.5 h-3.5 text-[#7BA05B]" />
              <span>CPCB EPR READY</span>
            </div>
          </div>

          <div className="flex gap-3 text-brand-border/40 pt-2">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-brand-sage transition-all">
              <Linkedin className="w-4 h-4 text-[#7BA05B]" />
            </a>
            <a href="mailto:info@calyxpack.in" className="hover:text-brand-sage transition-all">
              <Mail className="w-4 h-4 text-[#7BA05B]" />
            </a>
          </div>
        </div>

        {/* Industrial Solvers Tab - 3 cols */}
        <div className="lg:col-span-3 space-y-3 font-mono">
          <h5 className="text-[11px] font-bold tracking-widest text-[#7BA05B] uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#7BA05B] rounded-full animate-ping"></span>
            Calibrated Solvers
          </h5>
          <ul className="text-xs space-y-2.5">
            <li>
              <button 
                type="button" 
                onClick={() => onSwitchTab('calculators')}
                className="hover:text-white transition hover:underline text-left cursor-pointer"
              >
                Box Compression (McKee Suite)
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onSwitchTab('calculators')}
                className="hover:text-white transition hover:underline text-left cursor-pointer"
              >
                Double Seam parameters Check
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onSwitchTab('calculators')}
                className="hover:text-white transition hover:underline text-left cursor-pointer"
              >
                Lay-flat Shrink Sleeve solver
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onSwitchTab('calculators')}
                className="hover:text-white transition hover:underline text-left cursor-pointer"
              >
                Multilayer Laminate simulator
              </button>
            </li>
          </ul>
        </div>

        {/* Technical Directory - 2 cols */}
        <div className="lg:col-span-2 space-y-3 font-mono">
          <h5 className="text-[11px] font-bold tracking-widest text-[#7BA05B] uppercase">R&amp;D Standards</h5>
          <ul className="text-xs space-y-2.5">
            <li>
              <button 
                type="button" 
                onClick={() => onSwitchTab('database')}
                className="hover:text-white transition hover:underline text-left cursor-pointer"
              >
                ASTM D642 Standard
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onSwitchTab('database')}
                className="hover:text-white transition hover:underline text-left cursor-pointer"
              >
                IS-2771 Corrugated Specs
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onSwitchTab('database')}
                className="hover:text-white transition hover:underline text-left cursor-pointer"
              >
                CPCB Plastic EPR
              </button>
            </li>
            <li>
              <button 
                type="button" 
                onClick={() => onSwitchTab('roadmap')}
                className="hover:text-white transition hover:underline text-left cursor-pointer font-bold text-[#7BA05B]"
              >
                Launch Plan 2.0
              </button>
            </li>
          </ul>
        </div>

        {/* Support contacts - 3 cols */}
        <div className="lg:col-span-3 space-y-3 font-sans">
          <h5 className="text-[11px] font-mono font-bold tracking-widest text-[#7BA05B] uppercase">Support Channels</h5>
          <div className="space-y-3.5 text-xs text-brand-border/70 leading-relaxed font-semibold">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-[#7BA05B] mt-0.5 flex-shrink-0" />
              <span>CalyxPack R&amp;D Hub, Hyderabad, Telangana, India</span>
            </div>
            
            <div className="flex items-center gap-1.5 pt-1">
              <Mail className="w-4 h-4 text-[#7BA05B] flex-shrink-0" />
              <span>info@calyxpack.in</span>
            </div>
          </div>
        </div>

      </div>

      {/* Corporate Metadata and credits */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 pt-4 border-t border-brand-border/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-brand-border/40 uppercase tracking-widest font-bold font-mono">
        <div className="flex flex-wrap gap-4 sm:gap-8 justify-center sm:justify-start">
          <span>&copy; {new Date().getFullYear()} CALYXPACK SOLUTIONS</span>
          <span>ISO 9001:2015 REGISTERED SYSTEM</span>
          <span>ENGINEERING INTEL OS v4.5.3</span>
        </div>
        <div className="flex gap-4 items-center mt-3 sm:mt-0">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> 
            STATE ENGINE COMPLIANT
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> 
            ACTIVE SYSTEMS
          </span>
        </div>
      </div>

    </footer>
  );
}
