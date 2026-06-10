import React, { useState } from 'react';
import { 
  Calculator, 
  Layers, 
  Database,
  CheckCircle, 
  AlertTriangle,
  Info,
  RotateCcw,
  ArrowRightLeft,
  Settings,
  ShieldAlert,
  HelpCircle,
  TrendingDown
} from 'lucide-react';

// Pre-defined values
const FLUTE_PROPERTIES: Record<string, { factor: number; multiplier: number; typicalCaliper: number }> = {
  'A': { factor: 5.16, multiplier: 1.54, typicalCaliper: 4.8 },
  'B': { factor: 4.87, multiplier: 1.32, typicalCaliper: 3.2 },
  'C': { factor: 4.98, multiplier: 1.41, typicalCaliper: 4.0 },
  'E': { factor: 4.76, multiplier: 1.24, typicalCaliper: 1.6 },
  'F': { factor: 4.60, multiplier: 1.15, typicalCaliper: 0.8 },
  'BC': { factor: 4.10, multiplier: 1.48, typicalCaliper: 7.2 },
  'EB': { factor: 4.15, multiplier: 1.38, typicalCaliper: 4.8 }
};

const HUMIDITY_DERATING: Record<number, number> = {
  50: 1.00,
  60: 0.90,
  70: 0.75,
  80: 0.55,
  85: 0.47,
  90: 0.35,
  95: 0.22
};

const LAMINATE_MATERIALS = [
  { id: 'pet', name: 'PET (Polyester film)', density: 1.40, typicalOtr: 110, typicalWvtr: 20 },
  { id: 'bopa', name: 'BOPA (Nylon film)', density: 1.15, typicalOtr: 35, typicalWvtr: 150 },
  { id: 'bopp', name: 'BOPP (Co-ex PP)', density: 0.91, typicalOtr: 1600, typicalWvtr: 4.5 },
  { id: 'vmpet', name: 'VM-PET (Metallized PET)', density: 1.41, typicalOtr: 1.5, typicalWvtr: 0.8 },
  { id: 'alu', name: 'Aluminium Foil (Pure Alu)', density: 2.70, typicalOtr: 0.0, typicalWvtr: 0.0 },
  { id: 'ldpe', name: 'LDPE (Sealant Poly)', density: 0.92, typicalOtr: 4200, typicalWvtr: 12 },
  { id: 'kraft', name: 'Bleached Kraft Paper', density: 0.80, typicalOtr: 9999, typicalWvtr: 9999 },
];

export default function Calculators({ activeCalcId, onSwitchTab }: { activeCalcId?: string; onSwitchTab?: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState<string>(activeCalcId || 'bct');

  // React to prop updates from outside
  React.useEffect(() => {
    if (activeCalcId) {
      setActiveTab(activeCalcId);
    }
  }, [activeCalcId]);

  // 1. McKee / BCT States
  const [bctLength, setBctLength] = useState<number>(300); // mm
  const [bctWidth, setBctWidth] = useState<number>(200);  // mm
  const [bctHeight, setBctHeight] = useState<number>(250); // mm
  const [bctEct, setBctEct] = useState<number>(5.5);       // kNs/m or kN/m
  const [bctFlute, setBctFlute] = useState<string>('BC');
  const [bctHumidity, setBctHumidity] = useState<number>(65); // %
  const [bctSafetyFactor, setBctSafetyFactor] = useState<number>(3.0);
  const [linerGsmTop, setLinerGsmTop] = useState<number>(180);
  const [mediumGsm, setMediumGsm] = useState<number>(140);
  const [linerGsmBottom, setLinerGsmBottom] = useState<number>(150);

  // McKee BCT calculation:
  // McKee Simple: BCT = 5.87 * ECT * sqrt( Caliper * Perimeter )
  // Perimeter in inches, caliper in inches, ECT in lb/in, BCT in lb. 
  // Let's implement the Standard Metric formula which works directly:
  // BCT (Newton) = 1.82 * ECT * (Perimeter / 1000)^0.52 * Caliper^0.48 * (1/SF) * HumidityFactor
  const computeBct = () => {
    const perimeterMm = 2 * (bctLength + bctWidth); // in mm
    const caliperMm = FLUTE_PROPERTIES[bctFlute]?.typicalCaliper || 4.0;
    
    // Find humidity derating
    const humKeys = Object.keys(HUMIDITY_DERATING).map(Number).sort((a,b) => a-b);
    let humFactor = 1.0;
    if (bctHumidity <= 50) humFactor = 1.0;
    else if (bctHumidity >= 95) humFactor = 0.22;
    else {
      // Linear interpolation
      for (let i = 0; i < humKeys.length - 1; i++) {
        if (bctHumidity >= humKeys[i] && bctHumidity <= humKeys[i+1]) {
          const ratio = (bctHumidity - humKeys[i]) / (humKeys[i+1] - humKeys[i]);
          humFactor = HUMIDITY_DERATING[humKeys[i]] + ratio * (HUMIDITY_DERATING[humKeys[i+1]] - HUMIDITY_DERATING[humKeys[i]]);
          break;
        }
      }
    }

    // McKee simplified formula: BCT (lbf) = 5.87 × ECT (lb/in) × √( caliper (in) × perimeter (in) )
    // The constant 5.87 is only valid for imperial units, so convert metric inputs first.
    const ectLbPerIn = bctEct * 5.7101;       // kN/m → lb/in
    const caliperIn = caliperMm / 25.4;        // mm → inches
    const perimeterIn = perimeterMm / 25.4;    // mm → inches
    const bctLbf = 5.87 * ectLbPerIn * Math.sqrt(caliperIn * perimeterIn);
    // Convert lbf → kgf (1 lbf = 0.453592 kgf)
    const bctKgf = bctLbf * 0.453592;
    const safeBctKgf = bctKgf * humFactor;
    const stackLimitKg = safeBctKgf / bctSafetyFactor;

    return {
      rawBctKg: bctKgf,
      actualBctKg: safeBctKgf,
      safebctN: safeBctKgf * 9.80665,
      stackLimitKg,
      caliper: caliperMm,
      perimeter: perimeterMm,
      humFactor
    };
  };

  const bctResult = computeBct();

  // 2. Double Seam States
  const [seamBodyHook, setSeamBodyHook] = useState<number>(1.42); // mm
  const [seamCoverHook, setSeamCoverHook] = useState<number>(1.40); // mm
  const [seamThickness, setSeamThickness] = useState<number>(1.25); // mm
  const [seamWidth, setSeamWidth] = useState<number>(3.05); // mm
  const [seamBodyThickness, setSeamBodyThickness] = useState<number>(0.22); // mm
  const [seamCoverThickness, setSeamCoverThickness] = useState<number>(0.20); // mm

  // Double Seam Metrics:
  // Overlap = (Body Hook + Cover Hook + Cover Thickness) - Seam Width (approx)
  // More precisely, Overlap = (BH + CH + tc) - W
  // Compactness (Tightness %): ideally 75% - 85%
  // % Overlap: standard target is > 55%
  // Let's compute:
  const computeDoubleSeam = () => {
    const overlap = seamBodyHook + seamCoverHook + 1.1 * seamCoverThickness - seamWidth;
    const theoreticalSeamThickness = (2 * seamBodyThickness) + (3 * seamCoverThickness);
    const compactness = (theoreticalSeamThickness / seamThickness) * 100;
    
    // Percent Overlap = (Overlap / (Seam Width - 2 * tc - tb)) * 100
    const divisor = seamWidth - (2 * seamCoverThickness) - seamBodyThickness;
    const percentOverlap = divisor > 0 ? (overlap / divisor) * 100 : 0;

    // Standard assessment thresholds
    const overlapOk = overlap >= 1.1 && overlap <= 1.5;
    const percentOverlapOk = percentOverlap >= 50;
    const tightnessOk = compactness >= 70 && compactness <= 90;

    return {
      overlap,
      compactness,
      percentOverlap,
      overlapOk,
      percentOverlapOk,
      tightnessOk,
      theoreticalSeamThickness
    };
  };

  const seamResult = computeDoubleSeam();

  // 3. Shrink Sleeve States
  const [shrinkContainerCirc, setShrinkContainerCirc] = useState<number>(240); // mm
  const [shrinkMaxCirc, setShrinkMaxCirc] = useState<number>(240); // in case irregular
  const [shrinkMinCirc, setShrinkMinCirc] = useState<number>(120); // neck
  const [calcMode, setCalcMode] = useState<'diameter' | 'circumference'>('circumference');
  const [inputVal, setInputVal] = useState<number>(75); // diameter mm
  const [shrinkTolerance, setShrinkTolerance] = useState<number>(4); // mm (lay-flat ease factor)

  const handleSleeveCalc = () => {
    let containerCirc = shrinkContainerCirc;
    if (calcMode === 'diameter') {
      containerCirc = inputVal * Math.PI;
    }
    
    // Layflat Width (Lf) = (Perimeter / 2) + Ease Factor
    // Ease factor is typically 2-6mm for smooth sleeve insertion on the packaging line
    const layFlat = (containerCirc / 2) + shrinkTolerance;
    
    // To cover the neck, calculate shrink ratio needed to shrink to neck:
    // Shrink Ratio Needed (%) = ((Max Circumference - Min Circumference) / Max Circumference) * 100
    const shrinkRatio = ((shrinkMaxCirc - shrinkMinCirc) / shrinkMaxCirc) * 100;
    
    // Safe film width range
    const minSleeveLayflat = layFlat - 1;
    const maxSleeveLayflat = layFlat + 2;

    return {
      layFlat,
      shrinkRatioNeeded: shrinkRatio,
      recommendedLayflatRange: `${minSleeveLayflat.toFixed(1)} - ${maxSleeveLayflat.toFixed(1)} mm`,
      recomRatio: Math.min(Math.ceil(shrinkRatio + 10), 75) // typical sleeve has 10% safety index, max 75-80%
    };
  };

  const sleeveResult = handleSleeveCalc();

  // 4. Laminate Structure States
  interface Layer {
    id: number;
    materialId: string;
    microns: number;
    adhesiveGsm: number;
  }

  const [laminateLayers, setLaminateLayers] = useState<Layer[]>([
    { id: 1, materialId: 'pet', microns: 12, adhesiveGsm: 0 },
    { id: 2, materialId: 'vmpet', microns: 12, adhesiveGsm: 1.8 },
    { id: 3, materialId: 'ldpe', microns: 40, adhesiveGsm: 2.0 }
  ]);

  const addLayer = () => {
    const nextId = laminateLayers.length > 0 ? Math.max(...laminateLayers.map(l => l.id)) + 1 : 1;
    setLaminateLayers([...laminateLayers, { id: nextId, materialId: 'ldpe', microns: 30, adhesiveGsm: 1.8 }]);
  };

  const removeLayer = (id: number) => {
    setLaminateLayers(laminateLayers.filter(l => l.id !== id));
  };

  const updateLayer = (id: number, fields: Partial<Layer>) => {
    setLaminateLayers(laminateLayers.map(l => l.id === id ? { ...l, ...fields } : l));
  };

  const computeLaminate = () => {
    let totalGsm = 0;
    let totalCaliper = 0;
    let combinedOtr = 9999;
    let combinedWvtr = 9999;
    
    // Basic approximate barrier calculations for standard laminate structures
    // (O2 resistance is additive in inverse resistance, like parallel resistors: 1/R = sum(1/Ri))
    let otrInverseSum = 0;
    let wvtrInverseSum = 0;

    laminateLayers.forEach(layer => {
      const mat = LAMINATE_MATERIALS.find(m => m.id === layer.materialId);
      if (mat) {
        // GSM = Density * thickness (microns)
        const layerGsm = mat.density * layer.microns;
        totalGsm += layerGsm + layer.adhesiveGsm;
        totalCaliper += layer.microns;

        // Calculate contribution to barrier
        // Barrier gets better with greater thickness: Ri = Standard_barrier * (Base_Thickness / Current_Thickness)
        // For simplicity: Ri = mat.barrier / thickness
        // We handle metal foil (zero transmission) as perfect barrier:
        const specOtr = mat.typicalOtr === 0 ? 0.001 : mat.typicalOtr * (12 / layer.microns);
        const specWvtr = mat.typicalWvtr === 0 ? 0.001 : mat.typicalWvtr * (12 / layer.microns);

        otrInverseSum += (1 / specOtr);
        wvtrInverseSum += (1 / specWvtr);
      }
    });

    combinedOtr = otrInverseSum > 0 ? (1 / otrInverseSum) : 9999;
    combinedWvtr = wvtrInverseSum > 0 ? (1 / wvtrInverseSum) : 9999;

    // Check Recyclability
    // Packaging containing alu foil or multi-materials can be hard to recycle
    const containAlu = laminateLayers.some(l => l.materialId === 'alu');
    const isMonoMaterial = laminateLayers.filter(l => l.materialId !== 'ldpe').every(l => l.materialId === laminateLayers[0].materialId);
    let recycleScore = 'Composite - Hard to Recycle';
    let recycleColor = 'text-tech-amber';

    if (laminateLayers.length === 1) {
      recycleScore = 'Fully Recyclable (Mono-polymer)';
      recycleColor = 'text-tech-success';
    } else if (!containAlu && (laminateLayers.every(l => l.materialId === 'bopp' || l.materialId === 'ldpe'))) {
      recycleScore = 'Polyolefin Mix (Recyclable in PE stream)';
      recycleColor = 'text-tech-success';
    } else if (containAlu) {
      recycleScore = 'Barrier Composite (Specialized Recovery Mandatory)';
      recycleColor = 'text-red-600';
    }

    return {
      totalGsm,
      totalCaliper,
      combinedOtr: containAlu ? 0.0 : Math.max(combinedOtr, 0.05),
      combinedWvtr: containAlu ? 0.0 : Math.max(combinedWvtr, 0.05),
      recycleScore,
      recycleColor
    };
  };

  const laminateResult = computeLaminate();

  // 5. Unit Converter States
  const [convType, setConvType] = useState<'gsm-lbs' | 'caliper' | 'ect-force' | 'torque'>('gsm-lbs');
  const [convVal, setConvVal] = useState<number>(300);

  const performConversion = () => {
    switch(convType) {
      case 'gsm-lbs':
        // 1 g/m² = 0.2048 lb per 1000 sq ft (MSF)
        // 1 g/m² = 0.6144 lb per 3000 sq ft (Ream) = 0.2048 × 3
        return {
          metric: `${convVal} GSM (g/m²)`,
          imperial: `${(convVal * 0.2048).toFixed(2)} lb/MSF (Pounds per 1000 sq ft)`,
          extra: `${(convVal * 0.6144).toFixed(2)} lb/Ream (3000 sq ft)`
        };
      case 'caliper':
        // 1 micron = 0.03937 mil = 3.937 gauge
        return {
          metric: `${convVal} microns (μm)`,
          imperial: `${(convVal * 0.03937).toFixed(3)} pt/mil`,
          extra: `${(convVal * 4.0).toFixed(0)} gauge (Standard Film gauge)`
        };
      case 'ect-force':
        // 1 ECT value (lb/in) = 0.175 kN/m
        return {
          metric: `${(convVal * 0.175).toFixed(3)} kN/m`,
          imperial: `${convVal} lb/in (ECT)`,
          extra: `${(convVal * 0.17858).toFixed(3)} kgf/cm`
        };
      case 'torque':
        // 1 lbf-in = 0.113 N-m
        return {
          metric: `${(convVal * 0.113).toFixed(3)} N-m (Newton-meters)`,
          imperial: `${convVal} lbf-in (Pound-force inch)`,
          extra: `${(convVal * 1.15).toFixed(2)} kgf-cm`
        };
      default:
        return { metric: '', imperial: '', extra: '' };
    }
  };

  const conversionResult = performConversion();

  return (
    <div className="bg-white border border-brand-border rounded-xl shadow-tech overflow-hidden">
      {/* Side-by-side Technical Side Tabs for Desktop */}
      <div className="flex flex-col md:flex-row min-h-[580px]">
        
        {/* Metric Directory Index */}
        <div className="w-full md:w-56 bg-[#F7F8F5] md:border-r border-[#D9DDD5] p-4 flex flex-col gap-6 flex-shrink-0 font-sans">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3 px-1">Calculators</h3>
            <ul className="space-y-1.5 w-full">
              <li>
                <button 
                  type="button"
                  onClick={() => setActiveTab('bct')}
                  className={`flex items-center justify-between w-full text-left p-2 rounded text-sm transition-all cursor-pointer ${
                    activeTab === 'bct' 
                      ? 'bg-white border border-[#D9DDD5] shadow-sm text-[#7BA05B] font-semibold' 
                      : 'text-gray-600 hover:bg-[#EAECE6]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={activeTab === 'bct' ? 'text-[#7BA05B]' : 'opacity-50'}>⊞</span>
                    <span className={activeTab === 'bct' ? 'text-[#234734]' : ''}>BCT Calculator</span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    activeTab === 'bct' ? 'bg-[#7BA05B] text-white' : 'bg-[#EAECE6] text-gray-500'
                  }`}>v2.4</span>
                </button>
              </li>

              <li>
                <button 
                  type="button"
                  onClick={() => setActiveTab('seam')}
                  className={`flex items-center justify-between w-full text-left p-2 rounded text-sm transition-all cursor-pointer ${
                    activeTab === 'seam' 
                      ? 'bg-white border border-[#D9DDD5] shadow-sm text-[#7BA05B] font-semibold' 
                      : 'text-gray-600 hover:bg-[#EAECE6]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={activeTab === 'seam' ? 'text-[#7BA05B]' : 'opacity-50'}>⊟</span>
                    <span className={activeTab === 'seam' ? 'text-[#234734]' : ''}>Double Seam</span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    activeTab === 'seam' ? 'bg-[#7BA05B] text-white' : 'bg-[#EAECE6] text-gray-500'
                  }`}>Free</span>
                </button>
              </li>

              <li>
                <button 
                  type="button"
                  onClick={() => setActiveTab('sleeve')}
                  className={`flex items-center justify-between w-full text-left p-2 rounded text-sm transition-all cursor-pointer ${
                    activeTab === 'sleeve' 
                      ? 'bg-white border border-[#D9DDD5] shadow-sm text-[#7BA05B] font-semibold' 
                      : 'text-gray-600 hover:bg-[#EAECE6]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={activeTab === 'sleeve' ? 'text-[#7BA05B]' : 'opacity-50'}>⊡</span>
                    <span className={activeTab === 'sleeve' ? 'text-[#234734]' : ''}>Shrink Sleeve</span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    activeTab === 'sleeve' ? 'bg-[#7BA05B] text-white' : 'bg-[#EAECE6] text-gray-500'
                  }`}>Free</span>
                </button>
              </li>

              <li>
                <button 
                  type="button"
                  onClick={() => setActiveTab('laminate')}
                  className={`flex items-center justify-between w-full text-left p-2 rounded text-sm transition-all cursor-pointer ${
                    activeTab === 'laminate' 
                      ? 'bg-white border border-[#D9DDD5] shadow-sm text-[#7BA05B] font-semibold' 
                      : 'text-gray-600 hover:bg-[#EAECE6]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={activeTab === 'laminate' ? 'text-[#7BA05B]' : 'opacity-50'}>◰</span>
                    <span className={activeTab === 'laminate' ? 'text-[#234734]' : ''}>Laminate Builder</span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    activeTab === 'laminate' ? 'bg-[#7BA05B] text-white' : 'bg-[#EAECE6] text-gray-500'
                  }`}>Free</span>
                </button>
              </li>

              <li>
                <button 
                  type="button"
                  onClick={() => setActiveTab('unit')}
                  className={`flex items-center justify-between w-full text-left p-2 rounded text-sm transition-all cursor-pointer ${
                    activeTab === 'unit' 
                      ? 'bg-white border border-[#D9DDD5] shadow-sm text-[#7BA05B] font-semibold' 
                      : 'text-gray-600 hover:bg-[#EAECE6]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={activeTab === 'unit' ? 'text-[#7BA05B]' : 'opacity-50'}>◰</span>
                    <span className={activeTab === 'unit' ? 'text-[#234734]' : ''}>Unit Converter</span>
                  </div>
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    activeTab === 'unit' ? 'bg-[#7BA05B] text-white' : 'bg-[#EAECE6] text-gray-500'
                  }`}>Free</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-auto p-3 bg-[#EAECE6] rounded-lg border border-[#D9DDD5]">
            <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-mono text-[#2B2B2B]">DB: 12.4k Ready</span>
            </div>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-grow p-6 md:p-8">
          
          {/* CALCULATOR 1: BCT MCKEE */}
          {activeTab === 'bct' && (
            <div>
              <div className="border-b border-brand-border pb-4 mb-6">
                <span className="text-xs font-mono text-tech-blue font-semibold uppercase tracking-wider">Corrugated Shipper Design</span>
                <h3 className="text-2xl font-semibold font-display text-brand-deep mt-1">Box Compression Test (BCT) McKee Solver</h3>
                <p className="text-sm text-brand-graphite/70 mt-1">
                  Predict vertical top-load strength of RSC shipper boxes based on ECT, dimensions, flute profiles, and Indian humidity guidelines.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-5">
                  <div className="border-l-2 border-brand-deep pl-3 py-1 bg-brand-bg/50">
                    <span className="text-xs font-mono font-bold text-brand-deep">1. Box Dimensions (mm)</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Length (L)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={bctLength} 
                          onChange={(e) => setBctLength(Math.max(10, Number(e.target.value)))}
                          className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-brand-graphite/40">mm</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Width (W)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={bctWidth} 
                          onChange={(e) => setBctWidth(Math.max(10, Number(e.target.value)))}
                          className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-brand-graphite/40">mm</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Height (H)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={bctHeight} 
                          onChange={(e) => setBctHeight(Math.max(10, Number(e.target.value)))}
                          className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-brand-graphite/40">mm</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-l-2 border-brand-deep pl-3 py-1 bg-brand-bg/50 mt-4">
                    <span className="text-xs font-mono font-bold text-brand-deep">2. Strength Parameters</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">ECT Value (Edgewise Crush Test)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.1"
                          value={bctEct} 
                          onChange={(e) => setBctEct(Math.max(0.1, Number(e.target.value)))}
                          className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-brand-graphite/40">kN/m</span>
                      </div>
                      <p className="text-[10px] text-brand-graphite/50 mt-1">Typical range: 3.5 to 11.0 kN/m</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Flute Profile Selector</label>
                      <select 
                        value={bctFlute}
                        onChange={(e) => setBctFlute(e.target.value)}
                        className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white"
                      >
                        {Object.entries(FLUTE_PROPERTIES).map(([flute, prop]) => (
                          <option key={flute} value={flute}>
                            {flute} Flute (Thickness: {prop.typicalCaliper}mm)
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-brand-graphite/50 mt-1">Controls structural thickness multiplier</p>
                    </div>
                  </div>

                  <div className="border-l-2 border-brand-deep pl-3 py-1 bg-brand-bg/50 mt-4">
                    <span className="text-xs font-mono font-bold text-brand-deep">3. Environment & Storage Settings</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between">
                        <label className="block text-xs font-semibold text-brand-graphite mb-1">Relative Humidity (RH)</label>
                        <span className="text-xs font-mono text-tech-amber font-semibold">{bctHumidity}%</span>
                      </div>
                      <input 
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        value={bctHumidity}
                        onChange={(e) => setBctHumidity(Number(e.target.value))}
                        className="w-full accent-brand-deep cursor-pointer"
                      />
                      <p className="text-[10px] text-brand-graphite/50 mt-0.5">Humidity degrades board stiffness significantly</p>
                    </div>

                    <div>
                      <div className="flex justify-between">
                        <label className="block text-xs font-semibold text-brand-graphite mb-1">Safety Factor (SF)</label>
                        <span className="text-xs font-mono text-brand-deep font-semibold">{bctSafetyFactor}x</span>
                      </div>
                      <input 
                        type="range"
                        min="2.0"
                        max="5.0"
                        step="0.5"
                        value={bctSafetyFactor}
                        onChange={(e) => setBctSafetyFactor(Number(e.target.value))}
                        className="w-full accent-brand-deep cursor-pointer"
                      />
                      <p className="text-[10px] text-brand-graphite/50 mt-0.5">3.0x is standard for warehouse stacking</p>
                    </div>
                  </div>
                </div>

                {/* Outputs View */}
                <div className="bg-brand-bg border border-brand-border rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 bg-brand-deep/5 px-2 py-1 rounded w-fit mb-4">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-deep" />
                      <span className="text-[10;px] font-mono text-brand-deep font-bold uppercase tracking-wider">Metric Output Model</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-brand-graphite/60 block">Nominal Box Compression Test (BCT)</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-display font-bold text-brand-deep">{(bctResult.rawBctKg).toFixed(1)}</span>
                          <span className="text-sm font-semibold text-brand-graphite/60">kgf</span>
                        </div>
                        <p className="text-[11px] text-brand-graphite/50">Base target strength under standard testing conditions (23°C / 50% RH)</p>
                      </div>

                      <div className="h-[1px] bg-brand-border"></div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-brand-graphite/60 block flex items-center gap-1">
                            RH Adjusted BCT
                            <TrendingDown className="w-3 h-3 text-tech-amber" />
                          </span>
                          <span className="text-xl font-display font-medium text-tech-amber mt-0.5 block">
                            {(bctResult.actualBctKg).toFixed(1)} kgf
                          </span>
                          <span className="text-[10px] text-brand-graphite/50">RH factor derated to {(bctResult.humFactor * 100).toFixed(0)}%</span>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-brand-graphite/60 block">Safe Stacking Limit</span>
                          <span className="text-xl font-display font-semibold text-tech-success mt-0.5 block">
                            {(bctResult.stackLimitKg).toFixed(1)} kg
                          </span>
                          <span className="text-[10px] text-brand-graphite/50">Safe bottom box load limit</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Summary Spec */}
                  <div className="mt-8 bg-white border border-brand-border/60 rounded p-4">
                    <div className="text-xs font-semibold text-brand-deep mb-2 flex items-center gap-1.5 border-b border-brand-border pb-1.5">
                      <Info className="w-3.5 h-3.5" />
                      Engineering Reference
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-[11px] font-mono">
                      <div>Perimeter: <span className="text-brand-deep font-semibold">{bctResult.perimeter} mm</span></div>
                      <div>Caliper: <span className="text-brand-deep font-semibold">{bctResult.caliper} mm</span></div>
                      <div>Formula: <span className="text-brand-deep font-bold text-[10px]">McKinney Metric</span></div>
                      <div>ISO Ref: <span className="text-brand-deep font-semibold underline">ISO 12048</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 2: DOUBLE SEAM CAN */}
          {activeTab === 'seam' && (
            <div>
              <div className="border-b border-brand-border pb-4 mb-6">
                <span className="text-xs font-mono text-tech-blue font-semibold uppercase tracking-wider">Metal Can Packaging</span>
                <h3 className="text-2xl font-semibold font-display text-brand-deep mt-1">Double Seam Parameter Validator</h3>
                <p className="text-sm text-brand-graphite/70 mt-1">
                  Validate the integrity of metal can double seams. Overlap, tightness, and compacting parameters automatically verified.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                  <div className="border-l-2 border-brand-deep pl-3 py-1 bg-brand-bg/50">
                    <span className="text-xs font-mono font-bold text-brand-deep">Seam Hook Dimensions (mm)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Body Hook (BH)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={seamBodyHook} 
                        onChange={(e) => setSeamBodyHook(Math.max(0.1, Number(e.target.value)))}
                        className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                      />
                      <p className="text-[10px] text-brand-graphite/50 mt-1">Target range: 1.30 - 1.55 mm</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Cover Hook (CH)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={seamCoverHook} 
                        onChange={(e) => setSeamCoverHook(Math.max(0.1, Number(e.target.value)))}
                        className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                      />
                      <p className="text-[10px] text-brand-graphite/50 mt-1">Target range: 1.30 - 1.55 mm</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Seam Width (W) (Seam Height)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={seamWidth} 
                        onChange={(e) => setSeamWidth(Math.max(0.1, Number(e.target.value)))}
                        className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                      />
                      <p className="text-[10px] text-brand-graphite/50 mt-1">Typical: 2.80 - 3.20 mm</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Seam Thickness (S)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={seamThickness} 
                        onChange={(e) => setSeamThickness(Math.max(0.1, Number(e.target.value)))}
                        className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                      />
                      <p className="text-[10px] text-brand-graphite/50 mt-1">Target range: 1.10 - 1.35 mm</p>
                    </div>
                  </div>

                  <div className="border-l-2 border-brand-deep pl-3 py-1 bg-brand-bg/50 mt-4">
                    <span className="text-xs font-mono font-bold text-brand-deep">Metal Thickness Specifications</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Body Plate Thickness</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={seamBodyThickness} 
                        onChange={(e) => setSeamBodyThickness(Math.max(0.01, Number(e.target.value)))}
                        className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Cover/End Plate Thickness</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={seamCoverThickness} 
                        onChange={(e) => setSeamCoverThickness(Math.max(0.01, Number(e.target.value)))}
                        className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Outputs Panel */}
                <div className="bg-brand-bg border border-brand-border rounded-lg p-6 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center bg-[#2B2B2B] text-white p-3 rounded font-mono text-xs">
                      <span>CAN SEAM DIAGRAM KEY</span>
                      <span className="text-[#7BA05B] font-bold">BH + CH &gt; Overlap</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-brand-graphite/70">Calculated Seam Overlap</span>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${
                          seamResult.overlapOk ? 'bg-tech-success/15 text-tech-success' : 'bg-tech-amber/15 text-tech-amber'
                        }`}>
                          {seamResult.overlapOk ? 'PASS-Optimal' : 'WARN - Low'}
                        </span>
                      </div>
                      <div className="text-2xl font-display font-bold text-brand-deep">
                        {seamResult.overlap.toFixed(2)} <span className="text-xs font-sans text-brand-graphite/60">mm</span>
                      </div>
                      <p className="text-[11px] text-brand-graphite/50 mt-0.5">Minimum recommended overlap is 1.10 mm to avoid leakages.</p>
                    </div>

                    <div className="h-[1px] bg-brand-border"></div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-semibold text-brand-graphite/60 block">% Overlap (Overlap Ratio)</span>
                        <span className={`text-lg font-display font-medium block mt-0.5 ${
                          seamResult.percentOverlapOk ? 'text-brand-deep' : 'text-tech-amber'
                        }`}>
                          {seamResult.percentOverlap.toFixed(1)}%
                        </span>
                        <p className="text-[10px] text-brand-graphite/50">Target index is &gt; 55%</p>
                      </div>

                      <div>
                        <span className="text-xs font-semibold text-brand-graphite/60 block">Seam Compactness (Tightness)</span>
                        <span className={`text-lg font-display font-medium block mt-0.5 ${
                          seamResult.tightnessOk ? 'text-brand-deep' : 'text-tech-amber'
                        }`}>
                          {seamResult.compactness.toFixed(1)}%
                        </span>
                        <p className="text-[10px] text-brand-graphite/50">Target range: 75% to 85%</p>
                      </div>
                    </div>
                  </div>

                  {/* Warning Board */}
                  {(!seamResult.overlapOk || !seamResult.percentOverlapOk) && (
                    <div className="mt-6 bg-tech-amber/5 border border-tech-amber/20 rounded p-3 flex gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-tech-amber flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-brand-graphite">
                        <span className="font-semibold text-tech-amber">Critical Warning:</span> Overlap is below standard safety parameters. Increase chuck pressure, adjust roll seamer, or re-verify Plate Thickness.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 3: SHRINK SLEEVE LAYFLAT */}
          {activeTab === 'sleeve' && (
            <div>
              <div className="border-b border-brand-border pb-4 mb-6">
                <span className="text-xs font-mono text-tech-blue font-semibold uppercase tracking-wider">Labels & SLEEVES</span>
                <h3 className="text-2xl font-semibold font-display text-brand-deep mt-1">Shrink Sleeve Layflat width Solver</h3>
                <p className="text-sm text-brand-graphite/70 mt-1">
                  Compute core sleeve lay-flat dimensions and shrink criteria for PVC, PETG, or OPS container labels.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-5">
                  <div className="border-l-2 border-brand-deep pl-3 py-1 bg-brand-bg/50">
                    <span className="text-xs font-mono font-bold text-brand-deep">Core Inputs</span>
                  </div>

                  <div className="flex gap-4 border-b border-brand-border pb-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        checked={calcMode === 'circumference'} 
                        onChange={() => setCalcMode('circumference')}
                        className="accent-brand-deep"
                      />
                      <span>Circumference Method</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        checked={calcMode === 'diameter'} 
                        onChange={() => setCalcMode('diameter')}
                        className="accent-brand-deep"
                      />
                      <span>Diameter Method</span>
                    </label>
                  </div>

                  {calcMode === 'circumference' ? (
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Max Container Circumference</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={shrinkContainerCirc} 
                          onChange={(e) => {
                            setShrinkContainerCirc(Number(e.target.value));
                            setShrinkMaxCirc(Math.max(Number(e.target.value), shrinkMaxCirc));
                          }}
                          className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-brand-graphite/40 font-mono">mm</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Max Container Diameter</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={inputVal} 
                          onChange={(e) => setInputVal(Number(e.target.value))}
                          className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-brand-graphite/40 font-mono">mm</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Neck/Min Circumference</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={shrinkMinCirc} 
                          onChange={(e) => setShrinkMinCirc(Number(e.target.value))}
                          className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                        />
                        <span className="absolute right-2 top-2 text-[10px] text-brand-graphite/40 font-mono">mm</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-brand-graphite mb-1">Ease Factor (Clearance)</label>
                      <select 
                        value={shrinkTolerance}
                        onChange={(e) => setShrinkTolerance(Number(e.target.value))}
                        className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white"
                      >
                        <option value={2}>2 mm (High precision line)</option>
                        <option value={4}>4 mm (Standard - Recommended)</option>
                        <option value={6}>6 mm (Manual / Loose fit)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sleeve Output view */}
                <div className="bg-brand-bg border border-brand-border rounded-lg p-6 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div>
                      <span className="text-xs font-semibold text-brand-graphite/60 block">Recommended Label Lay-flat Width</span>
                      <div className="text-3xl font-display font-extrabold text-[#234734] mt-1">
                        {sleeveResult.layFlat.toFixed(1)} <span className="text-sm font-semibold text-brand-graphite/60 font-sans">mm</span>
                      </div>
                      <p className="text-[11px] text-brand-graphite/60 mt-0.5">Recommended seam lay-flat specifying width range: <strong>{sleeveResult.recommendedLayflatRange}</strong></p>
                    </div>

                    <div className="h-[1px] bg-brand-border"></div>

                    <div>
                      <span className="text-xs font-semibold text-brand-graphite/60 block">Transverse TD Shrinkage Needed</span>
                      <div className="text-xl font-display font-medium text-tech-blue mt-1">
                        {sleeveResult.shrinkRatioNeeded.toFixed(1)}% <span className="text-xs font-normal font-sans text-brand-graphite/60">Minimum</span>
                      </div>
                      <p className="text-[11px] text-brand-graphite/50 mt-1">Recommended film selection shrink index: <strong>{sleeveResult.recomRatio}% TD PETG</strong></p>
                    </div>
                  </div>

                  <div className="bg-white border p-3.5 rounded mt-4">
                    <span className="text-xs font-bold text-brand-deep flex items-center gap-1.5 border-b border-brand-border pb-1 mb-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Sleeve Material Options
                    </span>
                    <ul className="text-[10px] text-brand-graphite/80 space-y-1 font-mono">
                      <li>• <strong>PETG:</strong> 60-75% shrink, high clarity, standard</li>
                      <li>• <strong>PVC:</strong> 40-50% shrink, cost effective, restricted</li>
                      <li>• <strong>OPS:</strong> 55-65% shrink, minimal crease/frowning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 4: LAMINATE BUILDER */}
          {activeTab === 'laminate' && (
            <div>
              <div className="border-b border-brand-border pb-4 mb-6">
                <span className="text-xs font-mono text-tech-amber font-semibold uppercase tracking-wider">Premium Feature • Multilayer Solvers</span>
                <h3 className="text-2xl font-semibold font-display text-brand-deep mt-1">Laminate Structure & Barrier Builder</h3>
                <p className="text-sm text-brand-graphite/70 mt-1">
                  Draft, configure, and calculate structural attributes (total GSM, overall caliper, inverse OTR/WVTR barrier approximations) of multilayer flexible laminates.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Builder Layers List */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-brand-border pb-2">
                    <span className="text-xs font-mono font-bold text-brand-deep">Structure Stack (Top to Bottom)</span>
                    <button 
                      type="button"
                      onClick={addLayer}
                      className="text-xs bg-brand-deep hover:bg-brand-deep/90 text-white font-medium px-2.5 py-1 rounded-md transition"
                    >
                      + Add Layer
                    </button>
                  </div>

                  <div className="space-y-3">
                    {laminateLayers.map((layer, index) => {
                      const selectedMat = LAMINATE_MATERIALS.find(m => m.id === layer.materialId);
                      return (
                        <div 
                          key={layer.id} 
                          className="flex items-center gap-3 p-3 bg-brand-bg border border-brand-border rounded-lg relative hover:border-brand-sage/60 transition"
                        >
                          <span className="text-xs font-mono font-bold text-brand-deep w-6">{index + 1}.</span>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-grow">
                            <div className="col-span-1">
                              <label className="text-[9px] font-semibold text-brand-graphite/60 uppercase block mb-0.5">Material</label>
                              <select 
                                value={layer.materialId}
                                onChange={(e) => updateLayer(layer.id, { materialId: e.target.value })}
                                className="w-full text-xs border border-brand-border rounded p-1.5 focus:ring-1 bg-white"
                              >
                                {LAMINATE_MATERIALS.map(m => (
                                  <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-[9px] font-semibold text-brand-graphite/60 uppercase block mb-0.5">Thickness</label>
                              <div className="relative">
                                <input 
                                  type="number"
                                  value={layer.microns}
                                  onChange={(e) => updateLayer(layer.id, { microns: Math.max(1, Number(e.target.value)) })}
                                  className="w-full text-xs border border-brand-border rounded p-1 bg-white font-mono text-center"
                                />
                                <span className="absolute right-1 top-1.5 text-[8px] text-brand-graphite/40">μm</span>
                              </div>
                            </div>

                            <div>
                              <label className="text-[9px] font-semibold text-brand-graphite/60 uppercase block mb-0.5">Adh./Ext. GSM</label>
                              <div className="relative">
                                <input 
                                  type="number"
                                  step="0.1"
                                  value={layer.adhesiveGsm}
                                  onChange={(e) => updateLayer(layer.id, { adhesiveGsm: Math.max(0, Number(e.target.value)) })}
                                  className="w-full text-xs border border-brand-border rounded p-1 bg-white font-mono text-center"
                                />
                                <span className="absolute right-1 top-1.5 text-[8px] text-brand-graphite/40">g/m²</span>
                              </div>
                            </div>
                          </div>

                          {laminateLayers.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => removeLayer(layer.id)}
                              className="text-xs text-red-500 hover:text-red-700 p-1 mt-3"
                              title="Delete layer"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total calculated specs */}
                <div className="bg-brand-bg border border-brand-border rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 bg-brand-sage/10 text-brand-deep px-3 py-1 rounded w-fit mb-4 text-xs font-semibold">
                      <Layers className="w-3.5 h-3.5" />
                      Simulated Attributes
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-brand-graphite/60">Total Estimated GSM</span>
                          <span className="text-2xl font-display font-bold text-brand-deep block mt-0.5">
                            {laminateResult.totalGsm.toFixed(1)} <span className="text-xs font-sans text-brand-graphite/60 font-medium">g/m²</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-brand-graphite/60">Composite Caliper</span>
                          <span className="text-2xl font-display font-bold text-brand-deep block mt-0.5">
                            {laminateResult.totalCaliper.toFixed(1)} <span className="text-xs font-sans text-brand-graphite/60 font-medium">μm</span>
                          </span>
                        </div>
                      </div>

                      <div className="h-[1px] bg-brand-border"></div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-semibold text-brand-graphite/60 block">Approx. OTR (O₂ barrier)</span>
                          <span className="text-base font-mono font-medium text-brand-deep block mt-1">
                            {laminateResult.combinedOtr.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-brand-graphite/50 block">cc / m² / day / tm</span>
                        </div>

                        <div>
                          <span className="text-xs font-semibold text-brand-graphite/60 block">Approx. WVTR (Moisture)</span>
                          <span className="text-base font-mono font-medium text-brand-deep block mt-1">
                            {laminateResult.combinedWvtr.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-brand-graphite/50 block">g / m² / day</span>
                        </div>
                      </div>

                      <div className="h-[1px] bg-brand-border"></div>

                      <div>
                        <span className="text-xs font-semibold text-brand-graphite/60 block">EPR Recyclability Compliance</span>
                        <span className={`text-sm font-semibold block mt-1 ${laminateResult.recycleColor}`}>
                          {laminateResult.recycleScore}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 bg-[#2B2B2B] text-white p-3.5 rounded text-[11px] font-mono leading-relaxed">
                    <span className="text-[#7BA05B] font-semibold block mb-1">ENGINEERING FOCUS:</span>
                    Barriers are theoretical guidelines computed under dry testing variables (23°C, 0% RH OTR / 37.8°C, 90% RH WVTR). Physical values depend on extrusion parameters.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CALCULATOR 5: GENERAL UNIT CONVERTER */}
          {activeTab === 'unit' && (
            <div>
              <div className="border-b border-brand-border pb-4 mb-6">
                <span className="text-xs font-mono text-tech-blue font-semibold uppercase tracking-wider">Fast Calculations</span>
                <h3 className="text-2xl font-semibold font-display text-brand-deep mt-1">Industrial Packaging Unit Converter</h3>
                <p className="text-sm text-brand-graphite/70 mt-1">
                  Instantly switch between metric scales and empirical industrial values used by converters in India, US, and Europe.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-graphite mb-1.5">Conversion Category</label>
                    <select 
                      value={convType}
                      onChange={(e) => setConvType(e.target.value as any)}
                      className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                    >
                      <option value="gsm-lbs">GSM ↔ lb/MSF / lb/Ream (Paper Metric)</option>
                      <option value="caliper">Micron ↔ Mil / Gauge (Plastics & Boards)</option>
                      <option value="ect-force">ECT lbf/in ↔ kN/m / kgf/cm (Shipper Strength)</option>
                      <option value="torque">Torque lbf-in ↔ N-m / kgf-cm (Closures)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-brand-graphite mb-1.5">Enter Value to Convert</label>
                    <input 
                      type="number" 
                      value={convVal} 
                      onChange={(e) => setConvVal(Number(e.target.value))}
                      className="w-full text-sm border border-brand-border rounded p-2 focus:ring-1 bg-white font-mono"
                    />
                  </div>
                </div>

                {/* Outputs */}
                <div className="bg-brand-bg border border-brand-border rounded-lg p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-semibold text-brand-graphite/60 uppercase tracking-widest block">Converted Metrics</span>
                    
                    <div className="space-y-3 font-mono">
                      <div className="bg-white px-3.5 py-2.5 rounded border border-brand-border">
                        <span className="text-[10px] text-brand-graphite/50 block">Standard Metric</span>
                        <span className="text-sm font-semibold text-brand-deep">{conversionResult.metric}</span>
                      </div>
                      
                      <div className="bg-white px-3.5 py-2.5 rounded border border-brand-border">
                        <span className="text-[10px] text-brand-graphite/50 block">Imperial Equivalent</span>
                        <span className="text-sm font-semibold text-brand-deep">{conversionResult.imperial}</span>
                      </div>

                      <div className="bg-white px-3.5 py-2.5 rounded border border-brand-border">
                        <span className="text-[10px] text-brand-graphite/50 block">Alternative Unit</span>
                        <span className="text-sm font-semibold text-brand-deep">{conversionResult.extra}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
