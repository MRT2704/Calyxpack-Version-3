import React, { useState, useRef, useEffect } from 'react';
import { sanitizeInput } from '../utils/sanitize';
import { 
  Search, 
  CornerDownLeft, 
  Compass, 
  Calculator, 
  FileText, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SuggestionItem {
  id: string;
  name: string;
  code: string;
  category: string;
  type: 'calculator' | 'standard' | 'article';
  desc: string;
}

const SUGGESTIONS_POOL: SuggestionItem[] = [
  { id: 'bct', name: 'Box Compression Test (BCT) McKee Calculator', code: 'McKee Eq.', category: 'Corrugated', type: 'calculator', desc: 'McKee formula metric, humidity adjustment, safety factor index' },
  { id: 'seam', name: 'Double Seam Capping Parameter Solver', code: 'ISO seam', category: 'Metal', type: 'calculator', desc: 'Checks seaming hooks overlap compactness and thickness warnings' },
  { id: 'laminate', name: 'Multilayer Laminate Spec & Barrier Simulator', code: 'ASTM F1249', category: 'Flexible', type: 'calculator', desc: 'Select polymers, calculate composite gsm, caliper, inverse OTR/WVTR' },
  { id: 'sleeve', name: 'Shrink Sleeve Layflat Label Calculator', code: 'TD Ratio', category: 'Flexible', type: 'calculator', desc: 'Computes sleeve layflat clearance width and required TD ratios' },
  { id: 'unit', name: 'Industrial Packaging Unit Converter Check', code: 'GSM/Mil', category: 'General', type: 'calculator', desc: 'Convert GSM to lb/MSF, microns to mils, torque scales' },
  { id: 'is-2771', name: 'IS 2771 - Corrugated Boxes Specification', code: 'BIS Code', category: 'Database', type: 'standard', desc: 'Indian standard criteria, burst indices, water absorbency limits' },
  { id: 'astm-d642', name: 'ASTM D642 Compression Testing Standard', code: 'ASTM Code', category: 'Database', type: 'standard', desc: 'ASTM standard testing operations, stack simulations' },
  { id: 'astm-f1249', name: 'ASTM F1249 Moisture Transmission (WVTR) Film Standard', code: 'ASTM Code', category: 'Database', type: 'standard', desc: 'Modulated infrared sensor substrate moisture tests' },
  { id: 'cpcb-epr-2022', name: 'CPCB EPR Plastic Recycling Guidelines', code: 'CPCB EPR', category: 'Circularity', type: 'standard', desc: 'Thickness limits and target recycling levels in India' }
];

interface FloatingSearchProps {
  onSelectResult: (tab: string, calcId?: string) => void;
}

export default function FloatingSearch({ onSelectResult }: FloatingSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Click outside to collapse suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter pool based on search query
  const filteredSuggestions = query.trim() === '' 
    ? SUGGESTIONS_POOL.slice(0, 4) // Show 4 default favorites when empty but focused
    : SUGGESTIONS_POOL.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.code.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.desc.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (item: SuggestionItem) => {
    if (item.type === 'calculator') {
      onSelectResult('calculators', item.id);
    } else if (item.type === 'standard') {
      onSelectResult('database');
    }
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto z-30 mb-10">
      
      {/* Outer Glow container */}
      <div className={`p-1.5 rounded-xl transition-all duration-300 ${
        isFocused 
          ? 'bg-gradient-to-r from-brand-deep/20 via-[#7BA05B]/30 to-brand-deep/20 shadow-lg scale-[1.01]' 
          : 'bg-[#F2F4F0] border border-brand-border/80'
      }`}>
        
        {/* Input Bar markup */}
        <div className="bg-white rounded-lg flex items-center justify-between px-4 py-3.5 shadow-sm border border-brand-border/60">
          <div className="flex items-center gap-3.5 flex-1 select-none">
            <Search className={`w-5 h-5 transition ${isFocused ? 'text-[#7BA05B]' : 'text-brand-graphite/40'}`} />
            
            <input 
              type="text"
              value={query}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setQuery(sanitizeInput(e.target.value))}
              placeholder="Search ASTM, FEFCO, checkers, double seam overlap, CPCB metrics..."
              className="w-full text-xs md:text-sm font-mono text-brand-deep border-none bg-transparent placeholder:text-brand-graphite/40 focus:ring-0 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Quick Helper code tags indicators */}
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-mono text-brand-graphite/40 bg-brand-bg px-2 py-1 rounded border border-brand-border">
              <CornerDownLeft className="w-2.5 h-2.5" />
              <span>Jump to module</span>
            </span>
          </div>
        </div>

      </div>

      {/* Float Suggestions overlay list */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
          
          {/* Categorized suggestions container */}
          <div className="bg-brand-bg/50 px-4 py-2 border-b border-brand-border text-[10px] uppercase font-mono tracking-wider font-bold text-brand-graphite/50 flex justify-between items-center">
            <span>{query ? `ESTIMATED PREDICTIVE SOLVERS (${filteredSuggestions.length})` : 'POPULAR R&D SPEED ACTIONS'}</span>
            <span>PRECISE ENGINEERING SEARCH</span>
          </div>

          {filteredSuggestions.length > 0 ? (
            <div className="divide-y divide-brand-border max-h-[300px] overflow-y-auto">
              {filteredSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent losing focus
                    handleSelect(item);
                  }}
                  className="w-full text-left px-5 py-3.5 hover:bg-[#7BA05B]/5 flex items-center justify-between transition group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded bg-[#F7F8F5] border border-brand-border flex items-center justify-center flex-shrink-0 group-hover:bg-[#EAF3DE] group-hover:border-brand-sage transition-all">
                      {item.type === 'calculator' ? (
                        <Calculator className="w-4 h-4 text-brand-deep" />
                      ) : (
                        <FileText className="w-4 h-4 text-brand-sage" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-bold text-brand-deep leading-tight group-hover:text-[#43673F] transition font-sans">
                          {item.name}
                        </span>
                        <span className="text-[8px] font-mono font-bold bg-[#7BA05B]/10 text-[#234734] border border-[#7BA05B]/15 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {item.code}
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-graphite/50 mt-1 leading-normal font-sans">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-brand-graphite/30 group-hover:text-brand-deep transition-all">
                    <span className="text-[9px] font-mono font-semibold hidden sm:inline-flex uppercase">SOLVE</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-brand-graphite/55">
              🚫 No specific packaging equations match "{query}". Try "BCT", "Seam", "Laminate", or "EPR".
            </div>
          )}

          {/* Quick Click Search Recommendations pills at footer of search list */}
          <div className="px-4 py-3 bg-[#FCFDFB] border-t border-brand-border text-[11px] font-mono flex items-center flex-wrap gap-2 text-brand-graphite/70">
            <span className="text-brand-graphite/40">Suggested standards guides:</span>
            {['ASTM D642', 'IS 2771', 'FEFCO 210', 'EPR Targets'].map(tag => (
              <button
                key={tag}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setQuery(tag);
                }}
                className="px-2 py-0.5 bg-white border border-brand-border rounded text-[10px] text-brand-deep hover:border-[#7BA05B] transition"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      )}
      
    </div>
  );
}
