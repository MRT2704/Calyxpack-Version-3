import React from 'react';
import { 
  Target, 
  Settings, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Lock, 
  ArrowRight,
  Cpu,
  Bookmark,
  Scale
} from 'lucide-react';

export function GoldenCircle() {
  return (
    <section className="bg-white border border-brand-border rounded-2xl p-8 md:p-12 shadow-tech relative overflow-hidden">
      
      {/* CAD line graphics background */}
      <div className="absolute inset-0 bg-dot-grid opacity-60 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#7BA05B]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 relative z-10">
        <span className="p-1 px-2 text-[9px] font-mono font-bold text-[#234734] bg-[#7BA05B]/15 border border-[#7BA05B]/30 rounded">
          SPECIFICATION FOUNDATION FRAMEWORK
        </span>
        <h2 className="text-2xl font-bold font-display text-brand-deep mt-2">Physical Material Science &amp; Digital Decisiveness</h2>
        <p className="text-xs text-brand-graphite/70 mt-1 font-mono uppercase tracking-wider">
          How we translate physical material standards into direct, browser-executable models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* WHY CARD */}
        <div className="bg-[#FAFBF9]/60 border border-brand-border/80 rounded-xl p-5 space-y-4 hover:translate-y-[-2px] transition duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-[#234734] text-white px-2.5 py-1 rounded">WHY</span>
            <div className="w-8 h-8 rounded-full bg-[#234734]/5 flex items-center justify-center">
              <Target className="w-4 h-4 text-[#234734]" />
            </div>
          </div>
          <h3 className="text-lg font-semibold font-display text-brand-deep">Our Core Purpose</h3>
          <p className="text-xs text-brand-graphite/75 leading-relaxed font-sans">
            We believe packaging technology should be more than a set of isolated calculations. It should be a reliable decision-making system that helps packaging professionals work with greater speed, accuracy, and confidence.
          </p>
          <div className="pt-2 border-t border-brand-border text-[9px] font-mono text-brand-graphite/40 uppercase">
            Formula target: Zero Over-Packaging
          </div>
        </div>

        {/* HOW CARD */}
        <div className="bg-[#FAFBF9]/60 border border-brand-border/80 rounded-xl p-5 space-y-4 hover:translate-y-[-2px] transition duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-[#7BA05B] text-white px-2.5 py-1 rounded">HOW</span>
            <div className="w-8 h-8 rounded-full bg-[#7BA05B]/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-[#7BA05B]" />
            </div>
          </div>
          <h3 className="text-lg font-semibold font-display text-brand-deep">Our Process Philosophy</h3>
          <p className="text-xs text-brand-graphite/75 leading-relaxed font-sans">
            We bring together practical packaging calculators, technical references, and decision-support tools in one professional platform designed specifically for packaging technologists and development teams.
          </p>
          <div className="pt-2 border-t border-brand-border text-[9px] font-mono text-[#7BA05B] uppercase font-bold">
            CPCB EPR Compliant Calibrations
          </div>
        </div>

        {/* WHAT CARD */}
        <div className="bg-[#FAFBF9]/60 border border-brand-border/80 rounded-xl p-5 space-y-4 hover:translate-y-[-2px] transition duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-brand-graphite text-[#D9DDD5] px-2.5 py-1 rounded">WHAT</span>
            <div className="w-8 h-8 rounded-full bg-brand-graphite/5 flex items-center justify-center">
              <Layers className="w-4 h-4 text-brand-graphite" />
            </div>
          </div>
          <h3 className="text-lg font-semibold font-display text-brand-deep">Our Solution Offerings</h3>
          <p className="text-xs text-brand-graphite/75 leading-relaxed font-sans">
            A structured website offering free, pro, and premium tools across corrugated packaging, folding cartons, flexible packaging, rigid plastics, bottles, closures, and related packaging disciplines.
          </p>
          <div className="pt-2 border-t border-brand-border text-[9px] font-mono text-brand-graphite/40 uppercase">
            Verified Standards: ISO &amp; ASTM Codes
          </div>
        </div>

      </div>
    </section>
  );
}

export function ValueProps() {
  return (
    <section className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono font-[#7BA05B] font-bold uppercase tracking-wider">Industrial Calibrations</span>
        <h2 className="text-3xl font-bold font-display text-brand-deep mt-1">Value Proposition</h2>
        <p className="text-sm text-brand-graphite/70 mt-1">
          Engineered to mitigate risk, eliminate mathematical overhead, and optimize material choices throughout development cycles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* VALUE 1 */}
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-tech hover:shadow-tech-hover transition duration-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#234734]/5 flex items-center justify-center border border-brand-border/40">
                <Zap className="w-5 h-5 text-[#234734]" />
              </div>
              <span className="text-[9px] font-mono bg-brand-bg px-2 py-0.5 rounded text-brand-graphite/55">INDEX CALCULATOR</span>
            </div>
            
            <h4 className="text-base font-bold font-display text-brand-deep mb-2">Faster Decisions</h4>
            <p className="text-xs text-brand-graphite/70 leading-relaxed font-sans">
              Reduce computation loops from hours to milliseconds. Instantly model structural box compression, compare lamination barrier options, or calculate shrink ratios without manual spreadsheet overhead.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-dashed border-brand-border text-left">
            <span className="text-[10px] font-mono block uppercase text-[#7BA05B] font-bold">McKee Equation:</span>
            <code className="text-[10px] text-brand-deep font-mono block mt-1 bg-brand-bg px-2 py-1 rounded">
              BCT = 5.87 &times; ECT &times; &radic;(P &times; g) &times; RH%
            </code>
          </div>
        </div>

        {/* VALUE 2 */}
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-tech hover:shadow-tech-hover transition duration-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#7BA05B]/10 flex items-center justify-center border border-[#7BA05B]/30">
                <ShieldCheck className="w-5 h-5 text-[#7BA05B]" />
              </div>
              <span className="text-[9px] font-mono bg-brand-bg px-2 py-0.5 rounded text-brand-graphite/55">STANDARDS BASE</span>
            </div>
            
            <h4 className="text-base font-bold font-display text-brand-deep mb-2">Greater Consistency</h4>
            <p className="text-xs text-[#2B2B2B] leading-relaxed font-sans">
              Establish a single source of truth for technical rules. Keep R&D, Quality Assurance, Sourcing, and Converters synchronized to current BIS, ASTM, ISO, and FEFCO core standards.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-dashed border-brand-border text-left">
            <span className="text-[10px] font-mono block uppercase text-[#7BA05B] font-bold">CPCB EPR Matrix:</span>
            <code className="text-[10px] text-brand-deep font-mono block mt-1 bg-brand-bg px-2 py-1 rounded">
              Circularity Index &ge; 50% Mono-equivalent
            </code>
          </div>
        </div>

        {/* VALUE 3 */}
        <div className="bg-white border border-brand-border rounded-xl p-6 shadow-tech hover:shadow-tech-hover transition duration-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-graphite/5 flex items-center justify-center border border-brand-border/40">
                <Cpu className="w-5 h-5 text-brand-graphite" />
              </div>
              <span className="text-[9px] font-mono bg-brand-bg px-2 py-0.5 rounded text-brand-graphite/55">LAMINATE Barrier</span>
            </div>
            
            <h4 className="text-base font-bold font-display text-brand-deep mb-2">Confident Development</h4>
            <p className="text-xs text-[#2B2B2B] leading-relaxed font-sans">
              Launch new products with physical predictability. Validate board stacking indexes, composite laminate gauges, and dynamic seal profiles before initiating pilot production tooling.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-dashed border-brand-border text-left">
            <span className="text-[10px] font-mono block uppercase text-[#7BA05B] font-bold">Barrier Summation:</span>
            <code className="text-[10px] text-brand-deep font-mono block mt-1 bg-brand-bg px-2 py-1 rounded">
              1 / R_barrier = &Sigma; (1 / T_layer_i)
            </code>
          </div>
        </div>

      </div>
    </section>
  );
}

interface AccessTiersProps {
  onExploreTools: () => void;
  onSelectTab: (tab: string) => void;
}

export function AccessTiers({ onExploreTools, onSelectTab }: AccessTiersProps) {
  return (
    <section className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-mono font-bold text-[#7BA05B] uppercase tracking-wider">Open Access Workspace</span>
        <h2 className="text-3xl font-bold font-display text-brand-deep mt-1">Unrestricted &amp; 100% Free</h2>
        <p className="text-sm text-brand-graphite/70 mt-1">
          No subscriptions, paywalls, or accounts needed. Access all professional calculations, material databases, and technical standards directly inside your browser.
        </p>
      </div>

      <div className="bg-white border border-brand-border rounded-xl p-8 md:p-10 shadow-tech relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-16 bg-dot-grid opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7BA05B]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-[#EAF3DE] border border-brand-sage/40 text-brand-deep px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#7BA05B]" /> Fully Unlocked Solver Suites
            </div>
            
            <h3 className="text-2xl font-bold font-display text-brand-deep leading-tight">
              An Open Engineering Sandbox Built for the Packaging Community
            </h3>
            
            <p className="text-xs text-brand-graphite/75 leading-relaxed font-sans">
              To drive standardization and support quality control across the global supply chain, we have made our entire package modeling engine fully open-source and free to use. Perform structural calculations, barrier projections, and dimensional calibrations without any subscription hurdles.
            </p>

            <div className="flex flex-wrap gap-4 pt-1">
              <button
                type="button"
                onClick={onExploreTools}
                className="px-6 py-3 bg-[#234734] text-white rounded font-bold text-xs hover:bg-opacity-95 transition cursor-pointer shadow-sm glow-btn"
              >
                Access All Solvers
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('database')}
                className="px-6 py-3 border border-brand-border bg-brand-bg text-brand-deep rounded font-bold text-xs hover:bg-brand-border/40 transition cursor-pointer shadow-xs"
              >
                Explore Materials Database
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* FEATURE 1 */}
            <div className="border border-brand-border/60 bg-brand-bg/50 rounded-lg p-4 space-y-2">
              <div className="w-8 h-8 rounded bg-[#7BA05B]/10 flex items-center justify-center border border-[#7BA05B]/20">
                <Check className="w-4 h-4 text-[#7BA05B]" />
              </div>
              <h4 className="text-[11px] font-bold text-brand-deep uppercase tracking-wider font-mono">51 Scientific Solvers</h4>
              <p className="text-[10px] text-brand-graphite/75 leading-relaxed font-sans">
                From corrugated box compression to flexible composite layer WVTR, model physical states dynamically.
              </p>
            </div>

            {/* FEATURE 2 */}
            <div className="border border-brand-border/60 bg-brand-bg/50 rounded-lg p-4 space-y-2">
              <div className="w-8 h-8 rounded bg-[#7BA05B]/10 flex items-center justify-center border border-[#7BA05B]/20">
                <Check className="w-4 h-4 text-[#7BA05B]" />
              </div>
              <h4 className="text-[11px] font-bold text-brand-deep uppercase tracking-wider font-mono">Verified References</h4>
              <p className="text-[10px] text-brand-graphite/75 leading-relaxed font-sans">
                Access a cohesive physical index trace matching corporate expectations and industry testing methods.
              </p>
            </div>

            {/* FEATURE 3 */}
            <div className="border border-brand-border/60 bg-brand-bg/50 rounded-lg p-4 space-y-2">
              <div className="w-8 h-8 rounded bg-[#7BA05B]/10 flex items-center justify-center border border-[#7BA05B]/20">
                <Check className="w-4 h-4 text-[#7BA05B]" />
              </div>
              <h4 className="text-[11px] font-bold text-brand-deep uppercase tracking-wider font-mono">Dynamic PDF Sheets</h4>
              <p className="text-[10px] text-brand-graphite/75 leading-relaxed font-sans">
                Compile your equations, notes, and results into a professionally formatted PDF report sheet instantly.
              </p>
            </div>

            {/* FEATURE 4 */}
            <div className="border border-brand-border/60 bg-brand-bg/50 rounded-lg p-4 space-y-2">
              <div className="w-8 h-8 rounded bg-[#7BA05B]/10 flex items-center justify-center border border-[#7BA05B]/20">
                <Check className="w-4 h-4 text-[#7BA05B]" />
              </div>
              <h4 className="text-[11px] font-bold text-brand-deep uppercase tracking-wider font-mono">Privacy Preserved</h4>
              <p className="text-[10px] text-brand-graphite/75 leading-relaxed font-sans">
                No tracking cookies or servers storing your metrics. Calculations are processed statefully in your client.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCTA({ onExploreTools }: { onExploreTools: () => void }) {
  return (
    <section className="bg-blueprint border border-brand-border bg-[#0a1410] text-[#D9DDD5] rounded-2xl p-8 md:p-14 text-center shadow-tech relative overflow-hidden bg-blueprint-dark">
      <div className="absolute inset-0 bg-dot-grid opacity-35 pointer-events-none"></div>
      
      {/* CAD technical cross decoration */}
      <div className="absolute left-6 top-6 w-3.5 h-3.5 border border-white/20 flex items-center justify-center text-[8px] font-mono text-white/30">
        +
      </div>
      <div className="absolute right-6 bottom-6 w-3.5 h-3.5 border border-white/20 flex items-center justify-center text-[8px] font-mono text-white/30">
        +
      </div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl md:text-4xl font-bold font-display text-white tracking-tight leading-tight">
          Bridge the Gap Between Structural Calculations &amp; Industrial Precision
        </h2>
        
        <p className="text-xs md:text-sm text-[#7BA05B] max-w-lg mx-auto leading-relaxed font-mono uppercase tracking-wider">
          Eliminate manual error variables. Model properly utilizing physical formulas, FEFCO standards, and ASTM parameters.
        </p>

        <p className="text-xs text-white/60 max-w-lg mx-auto leading-relaxed font-sans">
          Deploy accurate polymer structural choices and carton parameters to clear supply audits securely. Complete all calculation steps statefully inside the sandboxed workspace.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onExploreTools}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#7BA05B] text-brand-deep hover:bg-opacity-95 rounded font-extrabold text-xs transition cursor-pointer shadow-md glow-btn-sage uppercase tracking-wider font-sans"
          >
            Explore Packaging Solvers
            <ArrowRight className="w-4.5 h-4.5 text-brand-deep" />
          </button>
        </div>
        
        <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest pt-4">
          No Software Installs &bull; ISO-9002 Standardized Structural Base Sets
        </div>
      </div>
    </section>
  );
}
