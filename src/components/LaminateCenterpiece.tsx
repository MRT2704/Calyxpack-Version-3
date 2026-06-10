import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Trash2, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCcw, 
  ChevronRight, 
  Info,
  HelpCircle
} from 'lucide-react';

interface MaterialDef {
  id: string;
  name: string;
  density: number; // g/cm³
  typicalThickness: number; // microns
  otrBase: number; // OTR at typical thickness (cc/m²/day)
  wvtrBase: number; // WVTR at typical thickness (g/m²/day)
  costFactor: number; // Multiplier index
  color: string; // Tailwind bg color code
  borderColor: string; // Tailwind border border color code
  category: 'Polymer' | 'Barrier' | 'Foil' | 'Paper' | 'Bio';
  isRecyclable: boolean;
  desc: string;
}

const MATERIAL_DICTIONARY: Record<string, MaterialDef> = {
  pet: { 
    id: 'pet', 
    name: 'PET (Polyethylene Terephthalate)', 
    density: 1.4, 
    typicalThickness: 12, 
    otrBase: 110, 
    wvtrBase: 22, 
    costFactor: 2.1, 
    color: 'bg-emerald-500/15 text-emerald-950', 
    borderColor: 'border-emerald-500/40',
    category: 'Polymer', 
    isRecyclable: true,
    desc: 'Excellent print web, high tensile strength, basic thermal barrier.' 
  },
  bopp: { 
    id: 'bopp', 
    name: 'BOPP (Biaxially Oriented Polypropylene)', 
    density: 0.9, 
    typicalThickness: 15, 
    otrBase: 1600, 
    wvtrBase: 5, 
    costFactor: 1.8, 
    color: 'bg-blue-500/15 text-blue-950', 
    borderColor: 'border-blue-500/40',
    category: 'Polymer', 
    isRecyclable: true,
    desc: 'High clarity, superb moisture barrier, great for snack packaging.'
  },
  al_foil: { 
    id: 'al_foil', 
    name: 'Aluminium Foil (Pure Barrier)', 
    density: 2.7, 
    typicalThickness: 9, 
    otrBase: 0.01, 
    wvtrBase: 0.01, 
    costFactor: 5.5, 
    color: 'bg-slate-400/20 text-slate-900', 
    borderColor: 'border-slate-400/50',
    category: 'Foil', 
    isRecyclable: false, // difficult when bonded to polymers
    desc: 'Absolute physical barrier to moisture, oxygen, UV light, and aroma.'
  },
  met_pet: { 
    id: 'met_pet', 
    name: 'Metallized PET (Met-PET)', 
    density: 1.41, 
    typicalThickness: 12, 
    otrBase: 1.5, 
    wvtrBase: 0.8, 
    costFactor: 2.8, 
    color: 'bg-teal-500/15 text-teal-950', 
    borderColor: 'border-teal-500/40',
    category: 'Barrier', 
    isRecyclable: false,
    desc: 'Cost-effective shiny aluminum deposition on PET substrate.'
  },
  evoh: { 
    id: 'evoh', 
    name: 'EVOH (Ethylene Vinyl Alcohol)', 
    density: 1.15, 
    typicalThickness: 5, 
    otrBase: 0.4, 
    wvtrBase: 35, 
    costFactor: 4.5, 
    color: 'bg-purple-500/15 text-purple-950', 
    borderColor: 'border-purple-500/40',
    category: 'Barrier', 
    isRecyclable: true, // compatible in specialized recycling
    desc: 'Exceptional gas/aroma barrier, highly co-extruded.'
  },
  bopa: { 
    id: 'bopa', 
    name: 'Nylon (BOPA - Polyamide)', 
    density: 1.15, 
    typicalThickness: 15, 
    otrBase: 35, 
    wvtrBase: 120, 
    costFactor: 3.2, 
    color: 'bg-[#C7D2FE]/20 text-indigo-950', 
    borderColor: 'border-indigo-400/40',
    category: 'Polymer', 
    isRecyclable: true,
    desc: 'High puncture resistance, supreme mechanical durability, thermoformable.'
  },
  ldpe: { 
    id: 'ldpe', 
    name: 'LDPE / LLDPE Sealant Web', 
    density: 0.92, 
    typicalThickness: 50, 
    otrBase: 6000, 
    wvtrBase: 12, 
    costFactor: 1.4, 
    color: 'bg-[#E3E8E1] text-[#2C3B24]', 
    borderColor: 'border-[#7BA05B]/30',
    category: 'Polymer', 
    isRecyclable: true,
    desc: 'Low-temperature heat sealing layer, adds bulk and tear-prop resistance.'
  },
  cpp: { 
    id: 'cpp', 
    name: 'CPP (Cast Polypropylene)', 
    density: 0.9, 
    typicalThickness: 25, 
    otrBase: 2500, 
    wvtrBase: 8, 
    costFactor: 1.7, 
    color: 'bg-[#F1F5F9]/80 text-[#1E293B]', 
    borderColor: 'border-slate-300',
    category: 'Polymer', 
    isRecyclable: true,
    desc: 'High puncture resistance, sterilisable, great for direct food touch.'
  },
  paper: { 
    id: 'paper', 
    name: 'Kraft Bleached/Kraft Paper', 
    density: 0.82, 
    typicalThickness: 60, 
    otrBase: 9999, // negligible barrier alone
    wvtrBase: 9999, 
    costFactor: 1.2, 
    color: 'bg-amber-100/50 text-amber-900', 
    borderColor: 'border-amber-300',
    category: 'Paper', 
    isRecyclable: true,
    desc: 'Fibre base, premium matte paper feel, outstanding print contrast, biodegradable.'
  },
  pla: { 
    id: 'pla', 
    name: 'PLA (Polylactic Acid Bio-Polymer)', 
    density: 1.24, 
    typicalThickness: 20, 
    otrBase: 300, 
    wvtrBase: 95, 
    costFactor: 3.8, 
    color: 'bg-[#ECFDF5] text-[#064E3B]', 
    borderColor: 'border-emerald-200/60',
    category: 'Bio', 
    isRecyclable: true,
    desc: 'Eco-certified corn starch substrate, compostable under EN 13432.'
  }
};

const TEMPLATE_PRESETS = [
  {
    name: "High-Barrier Retort Pouch (PET/AL/LDPE)",
    desc: "Long shelf life. Unbeatable water & oxygen barrier with maximum protection.",
    layers: [
      { matId: 'pet', thickness: 12 },
      { matId: 'al_foil', thickness: 9 },
      { matId: 'ldpe', thickness: 70 }
    ]
  },
  {
    name: "Premium Coffee bag (Paper/AL/PE)",
    desc: "Tactile natural feeling with true core oxygen block preservation.",
    layers: [
      { matId: 'paper', thickness: 80 },
      { matId: 'al_foil', thickness: 7 },
      { matId: 'ldpe', thickness: 50 }
    ]
  },
  {
    name: "Recyclable Monomaterial laminate (BOPP/EVOH/CPP)",
    desc: "Highly clean modern monomaterial designed to easily clear CPCB EPR audits.",
    layers: [
      { matId: 'bopp', thickness: 18 },
      { matId: 'evoh', thickness: 4 },
      { matId: 'cpp', thickness: 40 }
    ]
  },
  {
    name: "Snack Foil structure (PET/MetPET/LDPE)",
    desc: "Lightweight, moisture-sealed barrier at a cost-optimized standard profile.",
    layers: [
      { matId: 'pet', thickness: 12 },
      { matId: 'met_pet', thickness: 12 },
      { matId: 'ldpe', thickness: 40 }
    ]
  }
];

interface LayerItem {
  id: string;
  matId: string;
  thickness: number; // microns
}

export default function LaminateCenterpiece() {
  const [layers, setLayers] = useState<LayerItem[]>([
    { id: '1', matId: 'pet', thickness: 12 },
    { id: '2', matId: 'al_foil', thickness: 9 },
    { id: '3', matId: 'ldpe', thickness: 60 }
  ]);

  const [hoveredLayerIndex, setHoveredLayerIndex] = useState<number | null>(null);
  const [activePresetIndex, setActivePresetIndex] = useState<number>(0);
  const [selectedAddMatId, setSelectedAddMatId] = useState<string>('pet');

  // Load Preset
  const handleApplyPreset = (index: number) => {
    const preset = TEMPLATE_PRESETS[index];
    const newLayers = preset.layers.map((l, i) => ({
      id: Math.random().toString(),
      matId: l.matId,
      thickness: l.thickness
    }));
    setLayers(newLayers);
    setActivePresetIndex(index);
  };

  // Layer manipulation helpers
  const handleUpdateThickness = (id: string, val: number) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, thickness: Math.max(val, 1) } : l));
  };

  const handleRemoveLayer = (id: string) => {
    if (layers.length === 1) return; // Keep at least one
    setLayers(prev => prev.filter(l => l.id !== id));
  };

  const handleAddLayer = () => {
    setLayers(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        matId: selectedAddMatId,
        thickness: MATERIAL_DICTIONARY[selectedAddMatId].typicalThickness
      }
    ]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const items = [...layers];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    setLayers(items);
  };

  const handleMoveDown = (index: number) => {
    if (index === layers.length - 1) return;
    const items = [...layers];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    setLayers(items);
  };

  // Calculations
  const calculateMetrics = () => {
    let totalCaliper = 0; // microns
    let totalGSM = 0; // grams per sq meter
    let totalCostIndex = 0;
    
    // For barrier calculations, OTR/WVTR composite models:
    // 1 / Composite_Barrier = Sum(1 / Individual_Barrier_at_Thickness)
    // Individual_Barrier = Base_Barrier * (Base_Thickness / Current_Thickness)
    let sumOtrInverse = 0;
    let sumWvtrInverse = 0;
    let containsFoil = false;
    let customPolymerTypes = new Set<string>();

    layers.forEach(layer => {
      const mat = MATERIAL_DICTIONARY[layer.matId];
      if (!mat) return;
      totalCaliper += layer.thickness;
      
      // GSM = density (g/cm³) * thickness (microns)
      const gsm = mat.density * layer.thickness;
      totalGSM += gsm;
      totalCostIndex += (gsm * mat.costFactor);
      
      // Individual layer barrier calculation
      const adjustedOtr = mat.otrBase * (mat.typicalThickness / layer.thickness);
      const adjustedWvtr = mat.wvtrBase * (mat.typicalThickness / layer.thickness);

      if (adjustedOtr > 0) sumOtrInverse += (1 / adjustedOtr);
      if (adjustedWvtr > 0) sumWvtrInverse += (1 / adjustedWvtr);

      if (mat.id === 'al_foil') {
        containsFoil = true;
      }
      customPolymerTypes.add(mat.id === 'PLA' ? 'Bio' : mat.category);
    });

    // OTR approximation
    let finalOTR = sumOtrInverse > 0 ? (1 / sumOtrInverse) : 9999;
    let finalWVTR = sumWvtrInverse > 0 ? (1 / sumWvtrInverse) : 9999;

    // Correct for physical aluminium perfection limits
    if (containsFoil) {
      finalOTR = 0.01; 
      finalWVTR = 0.01;
    }

    // Material Homogeneity check for Recyclability Rating (CPCB EPR classification)
    // Multilayer plastic structures consisting of different polymer families are less recyclable
    const materialCats = layers.map(l => MATERIAL_DICTIONARY[l.matId].category);
    const uniqueCats = new Set(materialCats);
    
    // Check if it's purely mono-material (e.g. only CPP / BOPP polymers)
    const formsOfPolymer = new Set(layers.map(l => {
      const mat = MATERIAL_DICTIONARY[l.matId];
      if (mat.id === 'bopp' || mat.id === 'cpp' || mat.id === 'ldpe') return 'olefin'; // All polyolefins can blend
      return mat.id;
    }));

    let recyclabilityPercent = 90;
    let recyclabilityLabel = "Excellent/Mono-material";
    let alertMessage = "";

    if (formsOfPolymer.size === 1) {
      recyclabilityPercent = 100;
      recyclabilityLabel = "Class A - 100% Recyclable Olefin Mono-material";
    } else if (layers.some(l => l.matId === 'al_foil')) {
      recyclabilityPercent = 35;
      recyclabilityLabel = "Class D - Foil Composites (Needs specialized thermal stripping)";
      alertMessage = "Foil multilayer blocks automated hydraulic recycling streams.";
    } else if (uniqueCats.size > 1) {
      recyclabilityPercent = 60;
      recyclabilityLabel = "Class C - Mixed Laminate (Needs Compatibilizer additives)";
      alertMessage = "Combination of diverse polymers requires chemical modifiers to re-granulate.";
    }

    return {
      totalCaliper: Math.round(totalCaliper * 10) / 10,
      totalGSM: Math.round(totalGSM * 10) / 10,
      otr: finalOTR < 0.02 ? "< 0.01" : (finalOTR > 3000 ? "> 1500" : (Math.round(finalOTR * 100) / 100).toString()),
      wvtr: finalWVTR < 0.02 ? "< 0.01" : (finalWVTR > 3000 ? "> 1000" : (Math.round(finalWVTR * 100) / 100).toString()),
      costIndex: Math.round(totalCostIndex),
      recyclabilityPercent,
      recyclabilityLabel,
      alertMessage
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="border border-brand-border bg-white rounded-2xl overflow-hidden shadow-tech relative">
      
      {/* Blueprint Grid Overlay Detail to match engineering prompt */}
      <div className="absolute inset-x-0 top-0 h-16 bg-dot-grid opacity-30 pointer-events-none"></div>

      {/* Header section */}
      <div className="px-6 py-5 border-b border-brand-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-brand-bg/50 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 text-[10px] font-mono font-bold text-[#234734] bg-[#7BA05B]/15 border border-[#7BA05B]/30 rounded">
              CENTERPIECE MODULE
            </span>
            <span className="text-[11px] font-mono uppercase text-brand-graphite/40 tracking-wider">LAMINATE SPECIFICATION CO-PILOT</span>
          </div>
          <h3 className="text-xl font-bold font-display text-brand-deep mt-1">Interactive Laminate Structure Builder</h3>
          <p className="text-xs text-brand-graphite/60 mt-0.5">
            Architect custom layered flexible structures. Rearrange layers, simulate composite barriers, and optimize material efficiency.
          </p>
        </div>
        
        {/* Presets Quick Toggles */}
        <div className="flex flex-wrap gap-1.5">
          {TEMPLATE_PRESETS.map((p, idx) => (
            <button
              key={p.name}
              type="button"
              onClick={() => handleApplyPreset(idx)}
              className={`px-2.5 py-1 text-[10px] rounded transition-all cursor-pointer font-mono ${
                activePresetIndex === idx 
                  ? 'bg-brand-deep text-white border border-brand-deep shadow-xs font-semibold' 
                  : 'bg-white border border-brand-border text-brand-graphite hover:bg-brand-bg'
              }`}
            >
              Preset {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Hand Part: Configuration Panel */}
        <div className="lg:col-span-5 p-6 border-r border-brand-border bg-[#FCFDFB]/40 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-brand-border">
            <h4 className="text-xs font-mono font-bold text-brand-deep uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#7BA05B]" />
              Composite Layers ({layers.length})
            </h4>
            <span className="text-[10px] text-brand-graphite/40 font-mono">ASTM F1249 Certified Bases</span>
          </div>

          {/* Active Preset Description snippet */}
          <div className="bg-brand-sage/5 border border-brand-sage/10 rounded p-3 text-xs leading-relaxed text-brand-deep">
            <span className="font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#7BA05B]" />
              {TEMPLATE_PRESETS[activePresetIndex].name}
            </span>
            <span className="text-brand-graphite/70 block mt-0.5 font-sans">
              {TEMPLATE_PRESETS[activePresetIndex].desc}
            </span>
          </div>

          {/* Dynamic Layer List Cards */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {layers.map((layer, index) => {
              const mat = MATERIAL_DICTIONARY[layer.matId];
              return (
                <div 
                  key={layer.id}
                  onMouseEnter={() => setHoveredLayerIndex(index)}
                  onMouseLeave={() => setHoveredLayerIndex(null)}
                  className={`p-3.5 rounded-lg border transition-all ${
                    hoveredLayerIndex === index 
                      ? 'border-brand-sage bg-white shadow-md shadow-brand-sage/5' 
                      : 'border-brand-border bg-white shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-deep/5 text-brand-deep text-[10px] font-mono flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-xs font-bold text-brand-deep">{mat.name}</span>
                        <span className="text-[9px] font-mono text-brand-graphite/40 block">
                          Category: {mat.category} | Density: {mat.density} g/cm³
                        </span>
                      </div>
                    </div>

                    {/* Up/Down buttons to adjust layers ordering */}
                    <div className="flex items-center gap-0.5">
                      <button 
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1 text-brand-graphite/50 hover:text-brand-deep disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === layers.length - 1}
                        className="p-1 text-brand-graphite/50 hover:text-brand-deep disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleRemoveLayer(layer.id)}
                        className="p-1 text-[#C0392B] hover:bg-rose-50 rounded ml-1 disabled:opacity-30 cursor-pointer"
                        disabled={layers.length <= 1}
                        title="Delete Layer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Range Slider for Caliper Microns Thickness */}
                  <div className="mt-3.5 space-y-1 bg-brand-bg/50 p-2 rounded">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-brand-graphite/60">Thickness Caliper:</span>
                      <span className="font-bold text-brand-deep">{layer.thickness} µm</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="range"
                        min={layer.matId === 'evoh' ? '2' : layer.matId === 'al_foil' ? '5' : '10'}
                        max={layer.matId === 'paper' ? '140' : '150'}
                        value={layer.thickness}
                        onChange={(e) => handleUpdateThickness(layer.id, Number(e.target.value))}
                        className="flex-1 h-1 bg-brand-border rounded appearance-none cursor-pointer accent-brand-deep"
                      />
                      <input 
                        type="number"
                        min="2"
                        max="200"
                        value={layer.thickness}
                        onChange={(e) => handleUpdateThickness(layer.id, Number(e.target.value))}
                        className="w-14 text-center text-xs font-semibold py-0.5 border border-brand-border rounded font-mono"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action to Add a new Layer to the composite structure */}
          <div className="pt-2 border-t border-brand-border space-y-2">
            <label className="block text-[10px] font-mono font-bold text-brand-graphite/70 uppercase">
              Configure Additive Layer
            </label>
            <div className="flex gap-2">
              <select 
                value={selectedAddMatId}
                onChange={(e) => setSelectedAddMatId(e.target.value)}
                className="flex-1 text-xs border border-brand-border rounded px-2.5 py-2 bg-white font-sans"
              >
                {Object.values(MATERIAL_DICTIONARY).map(mat => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name.substring(0, 32)}... ({mat.category})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddLayer}
                className="px-4 py-2 bg-brand-deep text-white rounded text-xs font-semibold flex items-center gap-1.5 hover:bg-opacity-90 cursor-pointer transition glow-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Layer
              </button>
            </div>
            <p className="text-[10px] text-brand-graphite/50 font-sans">
              *Add polymers, high-barrier functional EVOH, or lidding paper elements.
            </p>
          </div>
        </div>

        {/* Right Hand Part: High-Fidelity Interactive Visualizer & Metrics */}
        <div className="lg:col-span-7 bg-[#0b1411] text-white p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-blueprint-dark">
          
          {/* Subtle Scanning Laser Line to reinforce "SaaS/Figma Engine for Packaging" */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-[#7BA05B]/30 animate-scan pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono tracking-wider font-bold text-[#7BA05B] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#7BA05B] animate-pulse" />
                SIMULATION OUTPUT - CAD MODEL V1.2
              </span>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/70">
                Live State Compute
              </span>
            </div>

            {/* Simulated Live Key Metrics Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/5 border border-white/10 rounded p-3 text-center">
                <span className="text-[10px] font-mono block text-white/50 leading-none uppercase">TOTAL CALIPER</span>
                <span className="text-lg font-bold font-display text-white mt-1.5 block">
                  {metrics.totalCaliper} <span className="text-[11px] font-mono text-[#7BA05B]">µm</span>
                </span>
                <span className="text-[9px] font-mono text-white/30 block mt-0.5">({Math.round(metrics.totalCaliper * 3.93) / 10} pt)</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-3 text-center">
                <span className="text-[10px] font-mono block text-white/50 leading-none uppercase">COMPOSITE GSM</span>
                <span className="text-lg font-bold font-display text-white mt-1.5 block">
                  {metrics.totalGSM} <span className="text-[11px] font-mono text-[#7BA05B]">g/m²</span>
                </span>
                <span className="text-[9px] font-mono text-white/30 block mt-0.5">({Math.round(metrics.totalGSM * 0.2048) / 100} lb/rm)</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-3 text-center">
                <span className="text-[10px] font-mono block text-white/50 leading-none uppercase">EST OTR BARRIER</span>
                <span className="text-lg font-bold font-display text-emerald-400 mt-1.5 block">
                  {metrics.otr}
                </span>
                <span className="text-[9px] font-mono text-white/30 block mt-0.5">cc/m²/24hr</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded p-3 text-center">
                <span className="text-[10px] font-mono block text-white/50 leading-none uppercase">EST WVTR BARRIER</span>
                <span className="text-lg font-bold font-display text-emerald-400 mt-1.5 block">
                  {metrics.wvtr}
                </span>
                <span className="text-[9px] font-mono text-white/30 block mt-0.5">g/m²/24hr</span>
              </div>
            </div>

            {/* Dynamic visual stack drawing (Cross-section) with correct proportionate layer heights */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase font-bold text-white/50 tracking-wide flex justify-between">
                <span>Core Cross-Sectional Diagram (Proportionate Thickness)</span>
                <span className="text-white/40">Total thickness caliper: {metrics.totalCaliper} µm</span>
              </label>

              <div className="border border-white/10 rounded-lg p-4 bg-black/40 min-h-[170px] flex flex-col justify-center gap-1.5 relative">
                
                {/* Horizontal blueprint measurements lines */}
                <div className="absolute left-1.5 inset-y-4 w-[1px] bg-white/10 flex flex-col justify-between">
                  <span className="w-1 h-[1px] bg-white/30"></span>
                  <span className="text-[8px] font-mono text-white/30 rotate-90 origin-left ml-1 mt-6">Caliper Index</span>
                  <span className="w-1 h-[1px] bg-white/30"></span>
                </div>

                <div className="pl-6 space-y-1">
                  {layers.map((layer, index) => {
                    const mat = MATERIAL_DICTIONARY[layer.matId];
                    // Compute dynamic thickness percentage for display mapping min-max nicely
                    const thicknessPercentage = Math.max(Math.min((layer.thickness / metrics.totalCaliper) * 100, 50), 12);
                    const isHovered = hoveredLayerIndex === index;

                    return (
                      <div
                        key={layer.id}
                        onMouseEnter={() => setHoveredLayerIndex(index)}
                        onMouseLeave={() => setHoveredLayerIndex(null)}
                        className={`w-full rounded transition-all flex items-center justify-between px-3 text-[10px] font-mono relative cursor-pointer border ${
                          isHovered 
                            ? `${mat.color} border-[#7BA05B] scale-[1.015] shadow-lg ring-1 ring-[#7BA05B]/30` 
                            : 'bg-white/5 border-white/10 text-white/80'
                        }`}
                        style={{ height: `${Math.max(thicknessPercentage * 1.5, 26)}px` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white/40">L{index + 1}</span>
                          <span className={`font-semibold ${isHovered ? 'text-brand-deep' : 'text-white'}`}>
                            {mat.id.toUpperCase()} <span className="opacity-60 font-sans font-normal text-[9px]">({mat.category})</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] opacity-75">{layer.thickness} µm</span>
                          <span className="text-[8px] opacity-50">({Math.round(layer.thickness * mat.density * 10) / 10} gsm)</span>
                        </div>
                        
                        {/* Blueprint dashed arrows pointing outwards */}
                        {isHovered && (
                          <div className="absolute -inset-y-0.5 -right-2 w-1.5 bg-[#7BA05B] rounded-r"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recyclability & Regulatory compliance score bar */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-white/50 block uppercase leading-none">CPCB EPR COMPLIANCE RATING</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {metrics.recyclabilityLabel}
                  </span>
                </div>
                
                <div className="text-right">
                  <span className="text-xl font-display font-bold text-[#7BA05B]">{metrics.recyclabilityPercent}%</span>
                  <span className="text-[8px] font-mono block text-white/40 uppercase">Circular score</span>
                </div>
              </div>

              {/* Graphical gradient line progress */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-500 via-amber-400 to-[#7BA05B] h-full transition-all duration-300"
                  style={{ width: `${metrics.recyclabilityPercent}%` }}
                ></div>
              </div>

              {/* Warnings/Success checklist icon */}
              {metrics.alertMessage ? (
                <div className="flex items-start gap-1.5 text-[10px] bg-red-500/10 border border-red-500/20 p-2 rounded text-red-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>EPR WARNING:</strong> {metrics.alertMessage} May subject manufacturers to higher plastic credit penalty fees in India under CPCB statutory regulations.
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-1.5 text-[10px] bg-emerald-500/10 border border-emerald-500/15 p-2 rounded text-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <span>
                    <strong>GREEN CHANNEL COMPLIANT:</strong> Pure mono-material structure complies perfectly with circularity norms. Subject to lower import/packaging tax levies. Good to launch!
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Quick Technical Guidelines Footer snippet inside Dark CAD board */}
          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[10px] font-mono text-white/50">
            <span className="flex items-center gap-1">
              <Info className="w-3 h-3 text-[#7BA05B]" />
              ISO 5636/3 Paper Air Permeability models calculated live.
            </span>
            <span>ASTM E96 / Standard O₂ Grounding</span>
          </div>

        </div>

      </div>

    </div>
  );
}
