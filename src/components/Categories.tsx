import React from 'react';
import { 
  Box, 
  Layers, 
  Sparkles, 
  Database,
  Container,
  Flame,
  Dribbble,
  Atom,
  ChevronRight,
  ShieldAlert,
  BadgeCheck
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  subName: string;
  count: number;
  icon: React.ReactNode;
  calcTarget: string;
  standardBadge: string;
  isIndiaSpecific?: boolean;
}

export default function Categories({ onSelectCalc }: { onSelectCalc: (calcId: string) => void }) {
  const categoriesList: CategoryItem[] = [
    {
      id: 'corrugated',
      name: 'Corrugated Fiberboard',
      subName: 'Standard shippers, BCT McKee, ECT mechanics & flutes modeling',
      count: 7,
      icon: <Box className="w-5 h-5 text-brand-deep" />,
      calcTarget: 'bct',
      standardBadge: 'IS 2771 / FEFCO',
      isIndiaSpecific: true
    },
    {
      id: 'flexible',
      name: 'Flexible Laminates',
      subName: 'Polymer densities, multilayer OTR/WVTR composite simulators',
      count: 9,
      icon: <Layers className="w-5 h-5 text-brand-deep" />,
      calcTarget: 'laminate',
      standardBadge: 'ASTM F1249 / E96'
    },
    {
      id: 'bottles',
      name: 'Rigid Plastics & Bottles',
      subName: 'PET bottles weight estimation, standard dimensional profiles',
      count: 5,
      icon: <Container className="w-5 h-5 text-brand-deep" />,
      calcTarget: 'unit',
      standardBadge: 'IS 15410 PET Core',
      isIndiaSpecific: true
    },
    {
      id: 'metal',
      name: 'Aluminium Cans & Aerosols',
      subName: 'Double Seam overlaps compactness checks & tinplate profiles',
      count: 6,
      icon: <Atom className="w-5 h-5 text-brand-deep" />,
      calcTarget: 'seam',
      standardBadge: 'ISO Tinplate Overlaps'
    },
    {
      id: 'labels',
      name: 'Labels & Shrink Sleeves',
      subName: 'TD/MD shrink ratios, flat sleeve layflat clearance indexers',
      count: 5,
      icon: <Flame className="w-5 h-5 text-brand-deep" />,
      calcTarget: 'sleeve',
      standardBadge: 'TD Clearance Ratio'
    },
    {
      id: 'closures',
      name: 'Pumps & Cap Closures',
      subName: 'Standard neck finishes, torque conversions, leakage factors',
      count: 4,
      icon: <Dribbble className="w-5 h-5 text-brand-deep" />,
      calcTarget: 'unit',
      standardBadge: 'IS 3237 Standards',
      isIndiaSpecific: true
    },
    {
      id: 'cartons',
      name: 'Folding Cartons',
      subName: 'ECMA specifications, crease stiffness factors, caliper conversion',
      count: 8,
      icon: <Box className="w-5 h-5 text-brand-deep" />,
      calcTarget: 'gsm-lbs',
      standardBadge: 'ECMA Box Specs'
    },
    {
      id: 'sustainability',
      name: 'Sustainability & EPR Act',
      subName: 'Monomaterial recycling ratings, plastic limits, CPCB criteria',
      count: 12,
      icon: <Sparkles className="w-5 h-5 text-brand-sage" />,
      calcTarget: 'laminate',
      standardBadge: 'CPCB EPR 2022 Law',
      isIndiaSpecific: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <span className="p-1 px-2 text-[9px] font-mono font-bold text-[#234734] bg-[#7BA05B]/15 border border-[#7BA05B]/30 rounded uppercase tracking-wider">
            Industrial Sandbox Tools
          </span>
          <h3 className="text-3xl font-extrabold font-display text-brand-deep mt-2">Explore Packaging Categories</h3>
          <p className="text-xs text-brand-graphite/70 mt-1">
            Browse through 51 calibrated calculators, technical databases, and structural R&D references mapped to international and Bureau of Indian Standards (BIS) codes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-brand-deep bg-[#EAF3DE] border border-brand-sage/40 rounded px-3 py-2 shrink-0 shadow-xs">
          <Database className="w-3.5 h-3.5 text-[#7BA05B]" />
          <span className="font-bold">TOTAL SOLVERS: 51 ACCESSIBLE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categoriesList.map((cat) => (
          <div 
            key={cat.id}
            className="bg-white border border-brand-border rounded-xl p-5 shadow-tech hover:shadow-tech-hover hover:border-[#7BA05B]/60 hover:shadow-[#7BA05B]/5 flex flex-col justify-between group cursor-pointer transition-all duration-300 relative overflow-hidden"
            onClick={() => onSelectCalc(cat.calcTarget)}
          >
            {/* Soft decorative line graphic on top of card hover */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-brand-sage opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center border border-brand-border group-hover:bg-[#EAF3DE] group-hover:border-brand-sage/40 transition-all">
                  {cat.icon}
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-mono font-bold text-brand-graphite tracking-tight bg-brand-bg border border-brand-border rounded px-2 py-0.5">
                    {cat.count} Tools
                  </span>
                  {cat.isIndiaSpecific ? (
                    <span className="text-[8px] font-mono text-[#7BA05B] font-extrabold uppercase bg-emerald-50 border border-emerald-100 px-1 rounded">
                      🇮🇳 BIS Std
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono text-brand-graphite/40 uppercase bg-brand-bg border border-brand-border/60 px-1 rounded">
                      Glo Std
                    </span>
                  )}
                </div>
              </div>

              {/* Tag descriptor / technical badge inside card */}
              <div className="mb-2 inline-block">
                <span className="bg-[#FAFBF9] border border-brand-border text-brand-graphite/60 font-mono text-[8.5px] font-bold px-1.5 py-0.5 rounded">
                  {cat.standardBadge}
                </span>
              </div>

              <h4 className="text-sm font-display font-black text-brand-deep group-hover:text-brand-sage transition flex items-center gap-1 leading-snug">
                {cat.name}
              </h4>
              
              <p className="text-[11px] text-brand-graphite/75 mt-2 leading-relaxed">
                {cat.subName}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-brand-bg flex items-center justify-between text-[10px] font-bold text-brand-deep uppercase tracking-wider">
              <span className="group-hover:text-brand-sage transition-all">Launch workspace</span>
              <ChevronRight className="w-3.5 h-3.5 text-brand-deep group-hover:translate-x-1 group-hover:text-brand-sage transition-all" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
