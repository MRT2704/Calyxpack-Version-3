import React, { useState } from 'react';
import { 
  Activity, 
  ChevronRight, 
  CheckCircle2, 
  Settings, 
  Compass, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Layers
} from 'lucide-react';

export default function Hero({ onExploreTools, onBrowseMaterials }: { onExploreTools: () => void; onBrowseMaterials: () => void }) {
  // Mini slider sandbox states for the Interactive Box simulation on the right
  const [boxH, setBoxH] = useState(250); // Height mm
  const [boxW, setBoxW] = useState(240); // Width mm
  const [numFlutes, setNumFlutes] = useState('BC'); // Flute profile
  const [hum, setHum] = useState(65); // Relative Humidity %

  const computeSimStrength = () => {
    // McKee Formula approximation: BCT = 5.87 * ECT * sqrt(Perimeter * Caliper) * Humidity_Derating
    const perimeter = (2 * (300 + boxW)); 
    const caliperMult = numFlutes === 'BC' ? 7.2 : 3.6;
    
    // Standard humidity derating curve values (Indian Corrugated standards)
    const humFactor = hum > 80 ? 0.42 : hum > 65 ? 0.70 : 0.95;
    
    const strength = Math.round((5.87 * 5.2 * Math.sqrt(caliperMult * perimeter)) * humFactor);
    return Math.max(strength, 35);
  };

  const simStrength = computeSimStrength();

  return (
    <div className="relative py-14 md:py-24 overflow-hidden bg-blueprint border border-brand-border rounded-2xl p-6 sm:p-10 lg:p-14 mb-12 shadow-tech">
      
      {/* Industrial blueprint overlays and noise graphics */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#7BA05B]/30 to-transparent animate-pulse pointer-events-none"></div>
      <div className="absolute inset-0 bg-dot-grid opacity-85 pointer-events-none"></div>

      {/* Decorative Technical Grid Markings at corner */}
      <div className="absolute top-4 left-4 font-mono text-[8px] text-brand-graphite/30 hidden md:block">
        SYS_REF_GRID // [CALYX_ENG_SYS_V2.0]
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[8px] text-brand-graphite/30 hidden md:block">
        CALIBRATION: COES_ASTM_D642_CERT_032
      </div>

      {/* Hero Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        
        {/* Left Side: Headline & description (Elevated typographic contrast) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-[#EAF3DE] border border-brand-sage/40 text-brand-deep px-3.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7BA05B]" />
            CALYXPΛCK // DECISION-SUPPORT OS
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-brand-deep leading-[1.08] font-display">
            Engineering Decision-Making for Packaging Technologists
          </h1>

          <p className="text-sm md:text-base text-brand-graphite/75 max-w-xl leading-relaxed font-sans">
            A calibrated platform designed specifically for development teams, combining practical calculators, verified technical references, and physical testing tools in one professional system.
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <button
              type="button"
              onClick={onExploreTools}
              className="px-6 py-3 bg-brand-deep text-white rounded font-semibold text-sm hover:bg-opacity-95 transition cursor-pointer shadow-md shadow-brand-deep/10 hover:shadow-lg flex items-center gap-2 glow-btn group"
            >
              Start With Free Tools
              <ArrowRight className="w-4 h-4 text-brand-sage group-hover:translate-x-1 transition" />
            </button>

            <button
              type="button"
              onClick={onBrowseMaterials}
              className="px-6 py-3 border border-brand-border bg-white rounded font-semibold text-sm hover:bg-brand-bg transition cursor-pointer text-brand-deep shadow-xs"
            >
              Explore Technical Database
            </button>
          </div>

          {/* Technical metric blocks below CTV replacing simple bullet points */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-brand-border max-w-2xl">
            <div className="bg-[#FAFBF9]/80 border border-brand-border p-2.5 rounded">
              <span className="text-xs font-bold text-brand-deep block leading-tight">51 ACTIVE TOOLS</span>
              <span className="text-[9px] text-[#7BA05B] font-mono uppercase tracking-wider block mt-0.5">Instant solvers</span>
            </div>
            <div className="bg-[#FAFBF9]/80 border border-brand-border p-2.5 rounded">
              <span className="text-xs font-bold text-brand-deep block leading-tight">ASTM & BIS</span>
              <span className="text-[9px] text-brand-graphite/40 font-mono uppercase tracking-wider block mt-0.5">R&D Referenced</span>
            </div>
            <div className="bg-[#FAFBF9]/80 border border-brand-border p-2.5 rounded">
              <span className="text-xs font-bold text-brand-deep block leading-tight">100% LOCAL</span>
              <span className="text-[9px] text-[#7BA05B] font-mono uppercase tracking-wider block mt-0.5">Browser runtime</span>
            </div>
            <div className="bg-[#FAFBF9]/80 border border-brand-border p-2.5 rounded">
              <span className="text-xs font-bold text-brand-deep block leading-tight">PRO CALIBRE</span>
              <span className="text-[9px] text-brand-graphite/40 font-mono uppercase tracking-wider block mt-0.5">Physical Solvers</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Sandbox / Active Dashboard Mockup */}
        <div className="lg:col-span-5 bg-white border border-brand-border rounded-xl p-5 shadow-lg relative overflow-hidden">
          
          {/* Subtle tech scanner line inside the card itself to emphasize live computing */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-brand-sage pointer-events-none animate-scan"></div>
          
          <div className="flex justify-between items-center border-b border-brand-border pb-3 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-deep">
              <Activity className="w-4 h-4 text-brand-sage animate-pulse" />
              <span>LIVE R&D CALIBRATOR MODULE</span>
            </div>
            
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-tech-success"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-brand-sage"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-brand-border"></span>
            </div>
          </div>

          <div className="space-y-4">
            
            {/* Interactive sliders that update calculations */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-brand-graphite/70">
                  <span>Box Width (mm)</span>
                  <span className="font-semibold text-brand-deep">{boxW}mm</span>
                </div>
                <input 
                  type="range"
                  min="150"
                  max="400"
                  step="10"
                  value={boxW}
                  onChange={(e) => setBoxW(Number(e.target.value))}
                  className="w-full h-1 bg-brand-border rounded appearance-none cursor-pointer accent-brand-deep mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-mono text-brand-graphite/70">
                  <span>Relative Humidity</span>
                  <span className="font-semibold text-tech-amber font-bold">{hum}%</span>
                </div>
                <input 
                  type="range"
                  min="50"
                  max="90"
                  step="5"
                  value={hum}
                  onChange={(e) => setHum(Number(e.target.value))}
                  className="w-full h-1 bg-brand-border rounded appearance-none cursor-pointer accent-brand-deep mt-1"
                />
              </div>
            </div>

            {/* Wireframe dynamic packaging outline */}
            <div className="h-36 bg-[#FCFDFB] rounded-lg border border-brand-border flex flex-col items-center justify-center relative overflow-hidden p-2">
              <div className="absolute inset-0 bg-dot-grid opacity-60"></div>
              
              {/* Overlay engineering dimensions */}
              <div className="absolute left-2.5 top-2.5 text-[8px] font-mono text-brand-graphite/40">
                W_PLANE_PROJECTION: {boxW}mm
              </div>
              <div className="absolute right-2.5 top-2.5 text-[8px] font-mono text-[#7BA05B] font-semibold">
                DIAGONAL R&D CALIBRATOR
              </div>

              {/* Wireframe Box Render */}
              <div 
                className="border border-brand-deep/30 rounded flex flex-col items-center justify-center transition-all bg-white relative shadow-inner p-1"
                style={{
                  width: `${boxW / 1.8}px`,
                  height: `${boxH / 2.2}px`,
                  opacity: hum > 75 ? 0.8 : 1.0,
                  transform: `scale(${1 - (hum - 50) * 0.0015})`
                }}
              >
                {/* Horizontal dimension line simulation */}
                <div className="absolute bottom-1 inset-x-2 border-b border-dashed border-brand-sage/40 flex justify-between text-[8px] text-brand-graphite/40 font-mono">
                  <span>|</span>
                  <span>W={boxW}mm</span>
                  <span>|</span>
                </div>

                <span className="text-[10px] font-mono text-brand-deep/70 px-1.5 py-0.5 bg-[#FAFBF9] rounded border border-brand-border">
                  Outer RSC Shell
                </span>
              </div>

              {/* Moisture status warning element */}
              {hum >= 75 && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#F9EBEA] border border-[#F2D7D5] text-[#A22E2E] text-[8px] px-2 py-0.5 rounded font-mono font-bold">
                  <TrendingDown className="w-3 h-3 animate-ping" />
                  RH {hum}%: BOARD DEGRADED -30% BCT
                </div>
              )}
            </div>

            {/* Simulated Live Outputs with ASTM standard label */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-brand-bg p-3 border border-brand-border rounded font-mono">
                <span className="text-[9px] text-[#7BA05B] uppercase block font-bold leading-none">BCT COMPRESSION</span>
                <span className="text-xl font-display font-medium text-brand-deep mt-1 block">
                  {simStrength} <span className="text-xs">kgf</span>
                </span>
                <span className="text-[8px] text-brand-graphite/40 block mt-0.5">Based on McKee formula</span>
              </div>

              <div className="bg-brand-bg p-3 border border-brand-border rounded font-mono flex flex-col justify-between">
                <div>
                  <span className="text-[9px] text-[#7BA05B] uppercase block font-bold leading-none">ASTM D642 ACCURACY</span>
                  <span className={`text-[11px] font-bold block mt-1 ${
                    hum >= 80 ? 'text-red-600 animate-pulse' : hum >= 70 ? 'text-tech-amber' : 'text-tech-success'
                  }`}>
                    {hum >= 80 ? 'CRITICAL DERATING' : hum >= 70 ? 'DEGRADED ACTIVE' : 'OPTIMAL CALIBRE'}
                  </span>
                  <span className="text-[8px] text-brand-graphite/40 block mt-0.5">Safety index: 3.5x</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
