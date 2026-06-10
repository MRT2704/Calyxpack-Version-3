import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  Calculator, 
  Sparkles, 
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface SearchItem {
  id: string;
  type: 'calculator' | 'standard' | 'article';
  tab: string;
  name: string;
  desc: string;
  tag: string;
}

const SEARCHABLE_ITEMS: SearchItem[] = [
  { id: 'bct', type: 'calculator', tab: 'calculators', name: 'Box Compression Test (BCT) McKee Calculator', desc: 'McKee formula metric, humidity adjustment, safety factor index', tag: 'Corrugated' },
  { id: 'seam', type: 'calculator', tab: 'calculators', name: 'Double Seam Capping parameter solver', desc: 'Checks seaming hooks overlap compactness and thickness warnings', tag: 'Metal' },
  { id: 'sleeve', type: 'calculator', tab: 'calculators', name: 'Shrink Sleeve Layflat label calculator', desc: 'Computes sleeve layflat clearance width and required TD ratios', tag: 'Flexible' },
  { id: 'laminate', type: 'calculator', tab: 'calculators', name: 'Multilayer Laminate Structure & Barrier Simulator', desc: 'Select polymers, calculate composite gsm, caliper, inverse OTR/WVTR', tag: 'Flexible' },
  { id: 'unit', type: 'calculator', tab: 'calculators', name: 'Industrial Packaging Unit Converter', desc: 'Convert GSM to lb/MSF, microns to mils, torque scales', tag: 'General' },
  
  { id: 'is-2771', type: 'standard', tab: 'database', name: 'IS 2771 - Corrugated Boxes Specification', desc: 'Indian standard criteria, burst indices, water absorbency limits', tag: 'BIS Code' },
  { id: 'astm-d642', type: 'standard', tab: 'database', name: 'ASTM D642 Compression Testing Standard', desc: 'ASTM standard testing operations, stack simulations', tag: 'ASTM Code' },
  { id: 'astm-f1249', type: 'standard', tab: 'database', name: 'ASTM F1249 Moisture Transmission (WVTR) Film Standard', desc: 'Modulated infrared sensor substrate moisture tests', tag: 'ASTM Code' },
  { id: 'cpcb-epr-2022', type: 'standard', tab: 'database', name: 'CPCB EPR Plastic Recycling guidelines', desc: 'Thickness limits and target recycling levels in India', tag: 'CPCB EPR' },

  { id: 'corru-collapse-physics', type: 'article', tab: 'articles', name: 'Physics of Corrugated Shipper Box Collapse', desc: 'Relative humidity effects, cellulose slips and creep models', tag: 'Journal' },
  { id: 'retort-sealing-failures', type: 'article', tab: 'articles', name: 'Retort Pouches leakages & Pinholing Diagnostics', desc: 'Channel seal integrity, 4-layer laminates autoclave curves', tag: 'Journal' }
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (tab: string, calcId?: string) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectResult }: SearchModalProps) {
  const [query, setQuery] = useState('');

  // Handle hotkey combinations (Cmd+K, Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = SEARCHABLE_ITEMS.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase()) ||
    item.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-brand-graphite/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-20">
      
      {/* Search Dialogue Box */}
      <div 
        className="bg-white border border-brand-border rounded-xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
      >
        
        {/* Input area */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-brand-border bg-brand-bg/60">
          <Search className="w-5 h-5 text-brand-graphite/40 flex-shrink-0" />
          <input 
            type="text"
            placeholder="Type code, standard, or solver name..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(sanitizeInput(e.target.value))}
            className="w-full text-sm font-mono bg-transparent border-none outline-none focus:ring-0 text-brand-graphite placeholder:text-brand-graphite/40"
          />
          <button 
            type="button"
            onClick={onClose}
            className="text-[10px] font-mono font-semibold bg-brand-border text-brand-graphite px-1.5 py-0.5 rounded cursor-pointer hover:bg-brand-border/80"
          >
            ESC
          </button>
        </div>

        {/* Results Stream */}
        <div className="max-h-[350px] overflow-y-auto divide-y divide-brand-border">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectResult(item.tab, item.id);
                  onClose();
                }}
                className="w-full text-left px-5 py-3 hover:bg-brand-sage/5 flex items-center justify-between group transition cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-brand-bg border border-brand-border flex items-center justify-center flex-shrink-0 group-hover:bg-brand-sage/10 group-hover:border-brand-sage/30">
                    {item.type === 'calculator' && <Calculator className="w-4 h-4 text-brand-deep" />}
                    {item.type === 'standard' && <FileText className="w-4 h-4 text-brand-deep" />}
                    {item.type === 'article' && <Globe className="w-4 h-4 text-brand-deep" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-brand-deep leading-tight group-hover:text-brand-sage transition">
                        {item.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-brand-border/60 text-brand-graphite/70 uppercase">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-graphite/50 mt-1 font-sans line-clamp-1">{item.desc}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-brand-graphite/30 group-hover:translate-x-1 group-hover:text-brand-deep transition" />
              </button>
            ))
          ) : (
            <div className="p-10 text-center text-xs text-brand-graphite/45 font-mono">
              No calibrated packaging logs match your input.
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className="bg-brand-bg px-4 py-2 border-t border-brand-border flex items-center justify-between text-[10px] font-mono text-brand-graphite/40">
          <div className="flex gap-4">
            <span>↑↓ Navigation</span>
            <span>↵ Select</span>
          </div>
          <span>Active Packages: 38 nodes</span>
        </div>

      </div>

    </div>
  );
}
