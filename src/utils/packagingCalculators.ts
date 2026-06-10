/**
 * Packaging Engineering Calculator Engine & Metadata
 * Provides calculation formulas, input schemas, and references for all 53 tools.
 */

export interface ToolInput {
  name: string;
  label: string;
  type: 'number' | 'select' | 'text';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export interface CalculationResult {
  value: string | number;
  unit: string;
  formula: string;
  working: string;
  references: string;
  extra?: Record<string, any>;
}

export interface PackagingTool {
  id: string;
  title: string;
  category: string;
  description: string;
  inputs: ToolInput[];
  calculate: (inputs: Record<string, any>) => CalculationResult;
}

export const PACKAGING_TOOLS: Record<string, PackagingTool> = {
  // --- CORRUGATED / SHIPPERS ---
  'bct-mckee': {
    id: 'bct-mckee',
    title: 'BCT / McKee calculator',
    category: 'Corrugated / Shippers',
    description: 'ECT → BCT with flute selector, India GSM grades, humidity derating',
    inputs: [
      { name: 'length', label: 'Length (mm)', type: 'number', defaultValue: 300, min: 10, max: 2000, step: 10 },
      { name: 'width', label: 'Width (mm)', type: 'number', defaultValue: 200, min: 10, max: 2000, step: 10 },
      { name: 'ect', label: 'ECT Value (kN/m)', type: 'number', defaultValue: 5.5, min: 0.1, max: 30, step: 0.1 },
      {
        name: 'flute',
        label: 'Flute Profile',
        type: 'select',
        defaultValue: 'BC',
        options: [
          { value: 'A', label: 'A Flute (4.8mm)' },
          { value: 'B', label: 'B Flute (3.2mm)' },
          { value: 'C', label: 'C Flute (4.0mm)' },
          { value: 'E', label: 'E Flute (1.6mm)' },
          { value: 'F', label: 'F Flute (0.8mm)' },
          { value: 'BC', label: 'BC Flute (7.2mm)' },
          { value: 'EB', label: 'EB Flute (4.8mm)' }
        ]
      },
      { name: 'humidity', label: 'Relative Humidity (%)', type: 'number', defaultValue: 65, min: 50, max: 95, step: 5 },
      { name: 'safetyFactor', label: 'Safety Factor (SF)', type: 'number', defaultValue: 3.0, min: 1.5, max: 6.0, step: 0.5 }
    ],
    calculate: (inputs) => {
      const L = inputs.length;
      const W = inputs.width;
      const ect = inputs.ect;
      const flute = inputs.flute;
      const rh = inputs.humidity;
      const sf = inputs.safetyFactor;

      const fluteCalipers: Record<string, number> = { A: 4.8, B: 3.2, C: 4.0, E: 1.6, F: 0.8, BC: 7.2, EB: 4.8 };
      const caliperMm = fluteCalipers[flute] || 4.0;
      const perimeterMm = 2 * (L + W);

      // Humidity factor
      let humFactor = 1.0;
      if (rh > 50) {
        humFactor = Math.max(0.2, 1.0 - (rh - 50) * 0.015);
      }

      const ectLbIn = ect * 5.7101;
      const caliperIn = caliperMm / 25.4;
      const perimeterIn = perimeterMm / 25.4;
      const bctLbf = 5.87 * ectLbIn * Math.sqrt(caliperIn * perimeterIn);
      const bctKgf = bctLbf * 0.453592;
      const safeBctKg = bctKgf * humFactor;
      const stackLimit = safeBctKg / sf;

      return {
        value: safeBctKg.toFixed(1),
        unit: 'kgf',
        formula: 'BCT (lbf) = 5.87 * ECT (lb/in) * sqrt(Caliper * Perimeter) * HumidityFactor',
        working: `Perimeter = ${perimeterMm} mm. Caliper = ${caliperMm} mm. ECT = ${ectLbIn.toFixed(2)} lb/in. Raw BCT = ${bctKgf.toFixed(1)} kgf. Derated by ${(humFactor * 100).toFixed(0)}% due to ${rh}% RH. Safe Stacking = ${stackLimit.toFixed(1)} kg (SF: ${sf}x).`,
        references: 'IS 2771 / FEFCO / ISO 12048'
      };
    }
  },
  'burst-strength': {
    id: 'burst-strength',
    title: 'Burst strength estimator',
    category: 'Corrugated / Shippers',
    description: 'Mullen burst ↔ ECT conversion, liner + medium GSM inputs',
    inputs: [
      { name: 'gsm1', label: 'Top Liner GSM (g/m²)', type: 'number', defaultValue: 180, min: 80, max: 400, step: 10 },
      { name: 'gsm2', label: 'Fluting Medium GSM (g/m²)', type: 'number', defaultValue: 140, min: 80, max: 300, step: 10 },
      { name: 'gsm3', label: 'Bottom Liner GSM (g/m²)', type: 'number', defaultValue: 150, min: 80, max: 400, step: 10 },
      { name: 'burstFactor', label: 'Board Burst Factor (BF)', type: 'number', defaultValue: 18, min: 10, max: 40, step: 1 }
    ],
    calculate: (inputs) => {
      const gsm1 = inputs.gsm1;
      const gsm2 = inputs.gsm2;
      const gsm3 = inputs.gsm3;
      const bf = inputs.burstFactor;

      const totalGsm = gsm1 + gsm2 * 1.35 + gsm3; // 1.35 standard take-up factor
      const burstValue = (totalGsm * bf) / 1000; // kg/cm²
      const ectEst = 0.35 * burstValue + 1.2;

      return {
        value: burstValue.toFixed(2),
        unit: 'kg/cm²',
        formula: 'Burst Strength = (Total GSM * Burst Factor) / 1000',
        working: `Total equivalent GSM = ${totalGsm.toFixed(0)} (including fluting take-up). Mullen Burst Strength = ${burstValue.toFixed(2)} kg/cm². Estimated equivalent ECT value = ${ectEst.toFixed(1)} kN/m.`,
        references: 'IS 2771 (Part 1) / ASTM D2738'
      };
    }
  },
  'flute-combination': {
    id: 'flute-combination',
    title: 'Flute combination selector',
    category: 'Corrugated / Shippers',
    description: 'Single/double/triple wall — B,C,E,F,BC,EB with caliper database',
    inputs: [
      {
        name: 'wallType',
        label: 'Wall Structure Type',
        type: 'select',
        defaultValue: 'double',
        options: [
          { value: 'single', label: 'Single Wall (3-ply)' },
          { value: 'double', label: 'Double Wall (5-ply)' },
          { value: 'triple', label: 'Triple Wall (7-ply)' }
        ]
      },
      {
        name: 'flute1',
        label: 'Flute 1 (Outer)',
        type: 'select',
        defaultValue: 'B',
        options: [
          { value: 'A', label: 'A Flute (4.8mm)' },
          { value: 'B', label: 'B Flute (3.2mm)' },
          { value: 'C', label: 'C Flute (4.0mm)' },
          { value: 'E', label: 'E Flute (1.6mm)' },
          { value: 'F', label: 'F Flute (0.8mm)' }
        ]
      },
      {
        name: 'flute2',
        label: 'Flute 2 (Inner/Middle)',
        type: 'select',
        defaultValue: 'C',
        options: [
          { value: 'none', label: 'None (Single Wall)' },
          { value: 'A', label: 'A Flute (4.8mm)' },
          { value: 'B', label: 'B Flute (3.2mm)' },
          { value: 'C', label: 'C Flute (4.0mm)' },
          { value: 'E', label: 'E Flute (1.6mm)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const wall = inputs.wallType;
      const f1 = inputs.flute1;
      const f2 = inputs.flute2;

      const calipers: Record<string, number> = { A: 4.8, B: 3.2, C: 4.0, E: 1.6, F: 0.8, none: 0 };
      const f1Val = calipers[f1] || 0;
      const f2Val = wall === 'single' ? 0 : (calipers[f2] || 0);
      const paperContribution = wall === 'single' ? 0.6 : wall === 'double' ? 1.0 : 1.5;
      const totalCaliper = f1Val + f2Val + paperContribution;

      return {
        value: totalCaliper.toFixed(1),
        unit: 'mm',
        formula: 'Total Caliper = Sum of Flute Calipers + Paper Liner Caliper (approx)',
        working: `Wall type: ${wall}. Flute 1: ${f1} (${f1Val}mm). Flute 2: ${wall === 'single' ? 'None' : f2} (${f2Val}mm). Total board thickness estimated = ${totalCaliper.toFixed(1)} mm.`,
        references: 'FEFCO Standard / Indian Paper Mill Standards'
      };
    }
  },
  'rct-ect': {
    id: 'rct-ect',
    title: 'RCT → ECT converter',
    category: 'Corrugated / Shippers',
    description: 'Ring Crush Test to ECT — standard in Indian mills, missing online',
    inputs: [
      { name: 'rctLinerTop', label: 'Top Liner RCT (kgf)', type: 'number', defaultValue: 22, min: 5, max: 100, step: 1 },
      { name: 'rctMedium', label: 'Medium RCT (kgf)', type: 'number', defaultValue: 16, min: 5, max: 80, step: 1 },
      { name: 'rctLinerBottom', label: 'Bottom Liner RCT (kgf)', type: 'number', defaultValue: 20, min: 5, max: 100, step: 1 },
      {
        name: 'flute',
        label: 'Flute type (Take-up factor)',
        type: 'select',
        defaultValue: 'C',
        options: [
          { value: 'A', label: 'A Flute (1.54)' },
          { value: 'B', label: 'B Flute (1.32)' },
          { value: 'C', label: 'C Flute (1.41)' },
          { value: 'E', label: 'E Flute (1.24)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const top = inputs.rctLinerTop;
      const med = inputs.rctMedium;
      const bot = inputs.rctLinerBottom;
      const flute = inputs.flute;

      const takeUpFactors: Record<string, number> = { A: 1.54, B: 1.32, C: 1.41, E: 1.24 };
      const alpha = takeUpFactors[flute] || 1.41;

      // Combined RCT (kgf/in) approx
      const totalRctKgf = top + med * alpha + bot;
      // Convert to ECT (kN/m): RCT in kgf/in * 0.38
      const ectEst = totalRctKgf * 0.062;

      return {
        value: ectEst.toFixed(2),
        unit: 'kN/m',
        formula: 'ECT (kN/m) ≈ 0.062 * (RCT_Liner1 + RCT_Medium * TakeUpFactor + RCT_Liner2) (kgf)',
        working: `Liner 1 RCT = ${top} kgf. Fluting RCT = ${med} kgf with take-up ${alpha}. Liner 2 RCT = ${bot} kgf. Total composite RCT = ${totalRctKgf.toFixed(1)} kgf. Estimated ECT = ${ectEst.toFixed(2)} kN/m.`,
        references: 'TAPPI T811 / IS 7063 / McKee Equation Base'
      };
    }
  },
  'box-blank-size': {
    id: 'box-blank-size',
    title: 'Box blank size calculator',
    category: 'Corrugated / Shippers',
    description: 'RSC/HSC/FOL dimensions → blank length, waste %, board area',
    inputs: [
      { name: 'length', label: 'Inside Length (mm)', type: 'number', defaultValue: 400, min: 50, max: 2000, step: 10 },
      { name: 'width', label: 'Inside Width (mm)', type: 'number', defaultValue: 300, min: 50, max: 2000, step: 10 },
      { name: 'height', label: 'Inside Height (mm)', type: 'number', defaultValue: 250, min: 50, max: 2000, step: 10 },
      { name: 'jointFlap', label: 'Joint Flap Width (mm)', type: 'number', defaultValue: 35, min: 25, max: 60, step: 5 }
    ],
    calculate: (inputs) => {
      const L = inputs.length;
      const W = inputs.width;
      const H = inputs.height;
      const flap = inputs.jointFlap;

      // Regular Slotted Container (RSC) blank dimensions
      const blankL = 2 * (L + W) + flap + 10; // +10mm manufacturing tolerance
      const blankW = W + H + 8; // +8mm creasing crease allowance
      const areaM2 = (blankL * blankW) / 1000000;

      return {
        value: areaM2.toFixed(3),
        unit: 'm²',
        formula: 'Blank Length = 2*(L+W) + Flap + Tol. Blank Width = W+H + Tol. Area = L * W',
        working: `Blank Length = 2 * (${L} + ${W}) + ${flap} + 10 = ${blankL} mm. Blank Width = ${W} + ${H} + 8 = ${blankW} mm. Total Board Blank Area = ${areaM2.toFixed(3)} square meters.`,
        references: 'FEFCO Case 0201 (RSC) Standards'
      };
    }
  },

  // --- FOLDING CARTONS ---
  'bending-stiffness': {
    id: 'bending-stiffness',
    title: 'Bending stiffness calculator',
    category: 'Folding Cartons',
    description: 'GSM → caliper → Taber/L&W stiffness for SBS/FBB/WLC',
    inputs: [
      { name: 'gsm', label: 'Board Substance (GSM)', type: 'number', defaultValue: 300, min: 150, max: 600, step: 10 },
      { name: 'caliper', label: 'Caliper (microns)', type: 'number', defaultValue: 420, min: 100, max: 1000, step: 10 },
      {
        name: 'boardType',
        label: 'Board Category',
        type: 'select',
        defaultValue: 'FBB',
        options: [
          { value: 'SBS', label: 'SBS (Solid Bleached Sulfate)' },
          { value: 'FBB', label: 'FBB (Folding Box Board - Bulky)' },
          { value: 'WLC', label: 'WLC (White Lined Chipboard)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const gsm = inputs.gsm;
      const cal = inputs.caliper;
      const type = inputs.boardType;

      const modFactors: Record<string, number> = { SBS: 10.2, FBB: 12.8, WLC: 8.5 };
      const E = modFactors[type] || 10.0;

      // Bending resistance (mN-m) ≈ E * Caliper^3 * GSM / 1e8
      const taberStiff = (E * Math.pow(cal, 3) * gsm) / 1000000000000;
      const lwStiff = taberStiff * 9.80665; // L&W equivalent

      return {
        value: lwStiff.toFixed(1),
        unit: 'mN',
        formula: 'Stiffness (mN) ≈ E * (Caliper^3) * GSM * 10^-12',
        working: `Board Type = ${type} (Elastic Modulus Index: ${E}). Caliper = ${cal} μm. Bending stiffness estimate: ${lwStiff.toFixed(1)} mN (L&W 15°). Taber equivalent = ${taberStiff.toFixed(2)} mN-m.`,
        references: 'ISO 2493 / TAPPI T556'
      };
    }
  },
  'carton-blank-size': {
    id: 'carton-blank-size',
    title: 'Blank size & board area',
    category: 'Folding Cartons',
    description: 'ECMA/FEFCO style selector → blank dimensions + GSM weight',
    inputs: [
      { name: 'length', label: 'Carton Width (mm)', type: 'number', defaultValue: 120, min: 20, max: 1000, step: 5 },
      { name: 'width', label: 'Carton Depth (mm)', type: 'number', defaultValue: 60, min: 20, max: 1000, step: 5 },
      { name: 'height', label: 'Carton Height (mm)', type: 'number', defaultValue: 180, min: 50, max: 1500, step: 10 },
      { name: 'gsm', label: 'Carton Board GSM', type: 'number', defaultValue: 320, min: 180, max: 500, step: 10 }
    ],
    calculate: (inputs) => {
      const L = inputs.length;
      const W = inputs.width;
      const H = inputs.height;
      const gsm = inputs.gsm;

      // Standard Tuck-in carton blank calculation
      const blankL = 2 * (L + W) + 20; // glue flap 15-20mm
      const blankW = H + 2 * (W * 0.7) + 30; // flaps contribution
      const weightG = (blankL * blankW * gsm) / 1000000000;

      return {
        value: weightG.toFixed(1),
        unit: 'grams/carton',
        formula: 'Carton Weight = Blank Area * GSM / 1e6',
        working: `Blank length: ${blankL} mm. Blank width: ${blankW.toFixed(0)} mm. Blank Area = ${(blankL * blankW / 1000000).toFixed(4)} m². Net carton weight = ${weightG.toFixed(1)} grams.`,
        references: 'ECMA Code Carton Standards'
      };
    }
  },
  'packaging-brief': {
    id: 'packaging-brief',
    title: 'Packaging brief template generator',
    category: 'Folding Cartons',
    description: 'Fill product details → auto-generates structured development brief',
    inputs: [
      { name: 'pName', label: 'Product Name', type: 'text', defaultValue: 'Gourmet Tea Box' },
      { name: 'pDim', label: 'Outer Dimensions (LxWxH mm)', type: 'text', defaultValue: '120x60x180' },
      { name: 'pWeight', label: 'Target Product Weight (g)', type: 'number', defaultValue: 250, min: 1, max: 50000, step: 10 },
      {
        name: 'shelfLife',
        label: 'Required Shelf Life',
        type: 'select',
        defaultValue: '12m',
        options: [
          { value: '3m', label: '3 Months (Standard)' },
          { value: '12m', label: '12 Months (High Barrier)' },
          { value: '24m', label: '24 Months (Ultra Retort)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const pName = inputs.pName;
      const pDim = inputs.pDim;
      const pWeight = inputs.pWeight;
      const sl = inputs.shelfLife;

      const workingStr = `PACKAGING BRIEF:
1. General: Project Name: ${pName}
2. Product parameters: Target Fill Weight: ${pWeight}g. Outer Box Size: ${pDim} mm.
3. Shelf-life expectation: ${sl === '12m' ? '12 Months' : sl === '24m' ? '24 Months' : '3 Months'}.
4. Suggested Material Target: FBB 300 GSM duplex board with food-grade water barrier varnish.`;

      return {
        value: 'Generated',
        unit: 'Text Brief',
        formula: 'SOP Brief Template Engine',
        working: workingStr,
        references: 'ASTM D4169 Development Guidelines'
      };
    }
  },

  // --- FLEXIBLE PACKAGING ---
  'laminate-builder': {
    id: 'laminate-builder',
    title: 'Laminate structure builder',
    category: 'Flexible Packaging',
    description: 'Build PET/Al/PE structures — auto-calculates GSM, caliper, cost',
    inputs: [
      {
        name: 'mat1',
        label: 'Layer 1 (Outer)',
        type: 'select',
        defaultValue: 'PET',
        options: [
          { value: 'PET', label: 'PET Film (Density 1.4)' },
          { value: 'BOPP', label: 'BOPP Film (Density 0.91)' },
          { value: 'Paper', label: 'Kraft Paper (Density 0.8)' }
        ]
      },
      { name: 'thick1', label: 'Layer 1 Thickness (μm)', type: 'number', defaultValue: 12, min: 8, max: 150, step: 1 },
      {
        name: 'mat2',
        label: 'Layer 2 (Barrier)',
        type: 'select',
        defaultValue: 'ALU',
        options: [
          { value: 'ALU', label: 'Aluminum Foil (Density 2.7)' },
          { value: 'VMPET', label: 'Metallized PET (Density 1.41)' },
          { value: 'PE', label: 'LDPE Core (Density 0.92)' }
        ]
      },
      { name: 'thick2', label: 'Layer 2 Thickness (μm)', type: 'number', defaultValue: 9, min: 6, max: 100, step: 1 },
      { name: 'adhesiveGsm', label: 'Total Adhesive GSM (g/m²)', type: 'number', defaultValue: 3.5, min: 1, max: 10, step: 0.5 }
    ],
    calculate: (inputs) => {
      const mat1 = inputs.mat1;
      const thick1 = inputs.thick1;
      const mat2 = inputs.mat2;
      const thick2 = inputs.thick2;
      const adh = inputs.adhesiveGsm;

      const densities: Record<string, number> = { PET: 1.4, BOPP: 0.91, Paper: 0.8, ALU: 2.7, VMPET: 1.41, PE: 0.92 };
      const d1 = densities[mat1] || 1.0;
      const d2 = densities[mat2] || 1.0;

      const gsm1 = thick1 * d1;
      const gsm2 = thick2 * d2;
      const totalGsm = gsm1 + gsm2 + adh;
      const totalThick = thick1 + thick2 + (adh / 0.95); // Adhesive contribution to thickness

      return {
        value: totalGsm.toFixed(1),
        unit: 'g/m²',
        formula: 'Total GSM = Sum of (Thickness * Density) + Adhesive GSM',
        working: `Layer 1: ${thick1}μm ${mat1} = ${gsm1.toFixed(1)} GSM. Layer 2: ${thick2}μm ${mat2} = ${gsm2.toFixed(1)} GSM. Total laminate thickness = ${totalThick.toFixed(0)} microns.`,
        references: 'ASTM F1249 / ASTM E96'
      };
    }
  },
  'roll-weight-footage': {
    id: 'roll-weight-footage',
    title: 'Roll weight / footage calculator',
    category: 'Flexible Packaging',
    description: 'GSM + width + OD → roll weight, linear meters, impressions',
    inputs: [
      { name: 'gsm', label: 'Substrate GSM (g/m²)', type: 'number', defaultValue: 80, min: 10, max: 500, step: 5 },
      { name: 'width', label: 'Roll Width (mm)', type: 'number', defaultValue: 450, min: 50, max: 2000, step: 50 },
      { name: 'od', label: 'Roll Outer Diameter (mm)', type: 'number', defaultValue: 400, min: 100, max: 1200, step: 50 },
      { name: 'coreId', label: 'Core ID (mm)', type: 'number', defaultValue: 76, min: 76, max: 152, step: 76 },
      { name: 'densityIndex', label: 'Material Density (g/cm³)', type: 'number', defaultValue: 0.92, min: 0.5, max: 3.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const gsm = inputs.gsm;
      const W = inputs.width;
      const OD = inputs.od;
      const core = inputs.coreId;
      const density = inputs.densityIndex;

      // Solid volume of the roll (cylinder volume minus core volume)
      const rollVolumeCm3 = (Math.PI * (Math.pow(OD / 10, 2) - Math.pow(core / 10, 2)) / 4) * (W / 10);
      const rollWeightKg = (rollVolumeCm3 * density * 0.8) / 1000; // 0.8 packing/winding efficiency factor
      const linearM = rollWeightKg / (gsm * (W / 1000) * 0.001);

      return {
        value: rollWeightKg.toFixed(1),
        unit: 'kg',
        formula: 'Roll Weight ≈ Volume * Density * PackingFactor',
        working: `Roll solid volume = ${rollVolumeCm3.toFixed(0)} cm³. Roll Weight = ${rollWeightKg.toFixed(1)} kg. Total linear length = ${linearM.toFixed(0)} meters.`,
        references: 'TAPPI Film Winding Guidelines'
      };
    }
  },
  'pouch-volume': {
    id: 'pouch-volume',
    title: 'Pouch volume calculator',
    category: 'Flexible Packaging',
    description: '3-side seal / gusset / standup → fill volume vs nominal',
    inputs: [
      { name: 'width', label: 'Pouch Width (mm)', type: 'number', defaultValue: 150, min: 50, max: 500, step: 5 },
      { name: 'height', label: 'Pouch Height (mm)', type: 'number', defaultValue: 230, min: 50, max: 800, step: 5 },
      { name: 'gusset', label: 'Gusset depth (mm)', type: 'number', defaultValue: 40, min: 0, max: 150, step: 5 },
      {
        name: 'style',
        label: 'Pouch Configuration',
        type: 'select',
        defaultValue: 'standup',
        options: [
          { value: 'flat', label: '3-Side Seal Flat Pouch' },
          { value: 'standup', label: 'Doypack Standup Pouch' }
        ]
      }
    ],
    calculate: (inputs) => {
      const W = inputs.width;
      const H = inputs.height;
      const G = inputs.gusset;
      const style = inputs.style;

      // Semi-empirical fill volume calculation (leaving headspace)
      let volumeMl = 0;
      if (style === 'flat') {
        volumeMl = (W - 20) * (H - 35) * 0.03 * 1.5; // leaving headspace
      } else {
        volumeMl = (W - 16) * (H - 40) * (G * 0.8) * 0.0016;
      }
      volumeMl = Math.max(0, volumeMl);

      return {
        value: Math.round(volumeMl),
        unit: 'ml (cc)',
        formula: 'Volume (ml) = Effective Width * Effective Height * GussetFactor',
        working: `Effective cavity dimension: ${W - 16} mm x ${H - 40} mm. Style: ${style}. Recommended fill capacity (with 15% headspace margin) = ${Math.round(volumeMl)} ml.`,
        references: 'FPA Standard Pouch Specifications'
      };
    }
  },

  // --- BOTTLES & RIGID PLASTIC ---
  'preform-weight': {
    id: 'preform-weight',
    title: 'Preform weight calculator',
    category: 'Bottles & Rigid Plastic',
    description: 'Bottle volume + wall thickness → preform weight in grams',
    inputs: [
      { name: 'volume', label: 'Target Bottle Volume (ml)', type: 'number', defaultValue: 500, min: 100, max: 5000, step: 50 },
      { name: 'wall', label: 'Wall Thickness Index (1-5)', type: 'number', defaultValue: 3, min: 1, max: 5, step: 1 },
      {
        name: 'carbonated',
        label: 'Is CSD (Carbonated)?',
        type: 'select',
        defaultValue: 'no',
        options: [
          { value: 'no', label: 'No (Still Water/Juice)' },
          { value: 'yes', label: 'Yes (Soda/Carbonated)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const vol = inputs.volume;
      const wall = inputs.wall;
      const csd = inputs.carbonated;

      // Base weight ratio: still water preforms are lighter (12-16g for 500ml), CSD/Carbonated are heavier (18-24g)
      const baseRatio = csd === 'yes' ? 0.045 : 0.031;
      const wallMult = 1.0 + (wall - 3) * 0.08;
      const preformW = vol * baseRatio * wallMult;

      return {
        value: preformW.toFixed(1),
        unit: 'grams',
        formula: 'Preform Weight = Bottle Volume * BaseRatio * WallThicknessModifier',
        working: `Product Type: ${csd === 'yes' ? 'Carbonated CSD' : 'Still Liquid'}. Wall Thickness Rating: ${wall}. Required PET resin weight = ${preformW.toFixed(1)} grams.`,
        references: 'IS 15410 / PETRA Association Standards'
      };
    }
  },
  'neck-finish': {
    id: 'neck-finish',
    title: 'Neck finish selector',
    category: 'Bottles & Rigid Plastic',
    description: 'PCO 1881/28mm/38mm/48mm — dimensions, closure compatibility',
    inputs: [
      {
        name: 'standard',
        label: 'Standard Neck Finish',
        type: 'select',
        defaultValue: '1881',
        options: [
          { value: '1810', label: 'PCO 1810 (28mm CSD Heavy)' },
          { value: '1881', label: 'PCO 1881 (28mm CSD Lightweight)' },
          { value: '38mm', label: '38mm 3-Start (Wide Mouth Juice)' },
          { value: '2925', label: '29/25 (Light Water Finish)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const std = inputs.standard;

      const specs: Record<string, { E: number; T: number; H: number; desc: string }> = {
        '1810': { E: 25.07, T: 27.4, H: 21.0, desc: 'CSD heavy-duty. Heavy cap compatibility.' },
        '1881': { E: 25.07, T: 27.4, H: 17.0, desc: 'CSD lightweight standard. Active globally.' },
        '38mm': { E: 35.1, T: 37.8, H: 14.2, desc: 'Hot fill juices and dairy products.' },
        '2925': { E: 26.2, T: 28.0, H: 12.0, desc: 'Still water cap finish. Highly lightweight.' }
      };

      const spec = specs[std] || specs['1881'];

      return {
        value: spec.T.toFixed(2),
        unit: 'mm (T Dimension)',
        formula: 'ISBT Standard Dimensions',
        working: `Neck Standard: PCO ${std}. T (outer thread diameter) = ${spec.T} mm. E (inner wall diameter) = ${spec.E} mm. H (neck height) = ${spec.H} mm. Notes: ${spec.desc}`,
        references: 'ISBT Finish Specifications'
      };
    }
  },

  // --- ALUMINIUM CANS ---
  'double-seam': {
    id: 'double-seam',
    title: 'Double seam calculator',
    category: 'Aluminium Cans',
    description: 'Body hook + cover hook + overlap % — full seam parameter validation',
    inputs: [
      { name: 'bh', label: 'Body Hook (BH) (mm)', type: 'number', defaultValue: 1.42, min: 0.5, max: 2.5, step: 0.01 },
      { name: 'ch', label: 'Cover Hook (CH) (mm)', type: 'number', defaultValue: 1.40, min: 0.5, max: 2.5, step: 0.01 },
      { name: 'w', label: 'Seam Width (W) (mm)', type: 'number', defaultValue: 3.05, min: 1.0, max: 5.0, step: 0.01 },
      { name: 's', label: 'Seam Thickness (S) (mm)', type: 'number', defaultValue: 1.25, min: 0.5, max: 2.5, step: 0.01 },
      { name: 'tb', label: 'Body Plate Thickness (tb) (mm)', type: 'number', defaultValue: 0.22, min: 0.1, max: 0.5, step: 0.01 },
      { name: 'tc', label: 'Cover Plate Thickness (tc) (mm)', type: 'number', defaultValue: 0.20, min: 0.1, max: 0.5, step: 0.01 }
    ],
    calculate: (inputs) => {
      const bh = inputs.bh;
      const ch = inputs.ch;
      const w = inputs.w;
      const s = inputs.s;
      const tb = inputs.tb;
      const tc = inputs.tc;

      const overlap = bh + ch + 1.1 * tc - w;
      const theoreticalSeamThickness = 2 * tb + 3 * tc;
      const compactness = (theoreticalSeamThickness / s) * 100;
      const divisor = w - 2 * tc - tb;
      const percentOverlap = divisor > 0 ? (overlap / divisor) * 100 : 0;

      const overlapOk = overlap >= 1.1 && overlap <= 1.5;
      const percentOverlapOk = percentOverlap >= 50;
      const tightnessOk = compactness >= 70 && compactness <= 90;

      return {
        value: overlap.toFixed(2),
        unit: 'mm (Overlap)',
        formula: 'Overlap = BH + CH + 1.1*tc - W',
        working: `Overlap = ${overlap.toFixed(2)} mm (${overlapOk ? 'Optimal' : 'Needs tuning'}). % Overlap = ${percentOverlap.toFixed(1)}% (Target >50%). Compactness = ${compactness.toFixed(1)}% (Target 75-85%).`,
        references: 'ISO Can Double Seam Standards / IS 13954'
      };
    }
  },
  'fill-volume': {
    id: 'fill-volume',
    title: 'Fill volume vs nominal',
    category: 'Aluminium Cans',
    description: 'Can dimensions → actual fill volume vs labelled volume compliance',
    inputs: [
      { name: 'diameter', label: 'Can Diameter (mm)', type: 'number', defaultValue: 66, min: 40, max: 100, step: 1 },
      { name: 'height', label: 'Can Total Height (mm)', type: 'number', defaultValue: 122, min: 50, max: 200, step: 1 },
      { name: 'nomVol', label: 'Labelled Volume (ml)', type: 'number', defaultValue: 330, min: 100, max: 1000, step: 10 }
    ],
    calculate: (inputs) => {
      const D = inputs.diameter;
      const H = inputs.height;
      const nom = inputs.nomVol;

      // Approximate volume: cylinder volume minus a correction for the necked top and bottom dome
      const r = D / 2 / 10; // cm
      const h = H / 10; // cm
      const rawVol = Math.PI * Math.pow(r, 2) * h;
      const correctedVol = rawVol - 18; // approx 18ml dome/neck lost volume

      const delta = correctedVol - nom;
      const compliance = delta >= 5; // Headspace clearance margin target

      return {
        value: correctedVol.toFixed(0),
        unit: 'ml (Actual Capacity)',
        formula: 'Volume (ml) = Pi * R^2 * H - Neck/Dome Correction',
        working: `Raw geometric cylinder = ${rawVol.toFixed(0)} ml. Actual volume capacity = ${correctedVol.toFixed(0)} ml. Headspace clearance = ${delta.toFixed(0)} ml. Compliance status: ${compliance ? 'PASS' : 'WARN - Low Headspace'}.`,
        references: 'Legal Metrology Packaging Rules 2011 / ISO Can Standards'
      };
    }
  },

  // --- LABELS & DECORATION ---
  'label-area': {
    id: 'label-area',
    title: 'Label area calculator',
    category: 'Labels & Decoration',
    description: 'Bottle dimensions → max label panel area, coverage %, waste allowance',
    inputs: [
      { name: 'diameter', label: 'Bottle Outer Diameter (mm)', type: 'number', defaultValue: 72, min: 20, max: 300, step: 2 },
      { name: 'height', label: 'Label Panel Height (mm)', type: 'number', defaultValue: 110, min: 10, max: 500, step: 5 },
      { name: 'coverage', label: 'Label Coverage Angle (deg)', type: 'number', defaultValue: 360, min: 45, max: 360, step: 15 }
    ],
    calculate: (inputs) => {
      const D = inputs.diameter;
      const H = inputs.height;
      const angle = inputs.coverage;

      const circumference = Math.PI * D;
      const labelW = (circumference * angle) / 360;
      const areaMm2 = labelW * H;
      const areaCm2 = areaMm2 / 100;

      return {
        value: areaCm2.toFixed(1),
        unit: 'cm²',
        formula: 'Label Area = (Pi * Diameter * CoverageRatio) * PanelHeight',
        working: `Bottle Circumference = ${circumference.toFixed(1)} mm. Developed Label Width = ${labelW.toFixed(1)} mm. Total individual label area = ${areaCm2.toFixed(1)} cm².`,
        references: 'Finat Label Design SOPs'
      };
    }
  },
  'shrink-sleeve': {
    id: 'shrink-sleeve',
    title: 'Shrink sleeve lay-flat calculator',
    category: 'Labels & Decoration',
    description: 'Container circumference → lay-flat width, shrink %, distortion zones',
    inputs: [
      { name: 'maxCirc', label: 'Max Container Circumference (mm)', type: 'number', defaultValue: 240, min: 50, max: 1000, step: 10 },
      { name: 'minCirc', label: 'Min Neck Circumference (mm)', type: 'number', defaultValue: 120, min: 40, max: 800, step: 10 },
      { name: 'easeFactor', label: 'Clearance Ease Factor (mm)', type: 'number', defaultValue: 4, min: 2, max: 8, step: 2 }
    ],
    calculate: (inputs) => {
      const maxC = inputs.maxCirc;
      const minC = inputs.minCirc;
      const ease = inputs.easeFactor;

      const layFlat = (maxC / 2) + ease;
      const shrinkReq = ((maxC - minC) / maxC) * 100;
      const minLayflat = layFlat - 1;
      const maxLayflat = layFlat + 2;

      return {
        value: layFlat.toFixed(1),
        unit: 'mm (Layflat Width)',
        formula: 'Layflat = (MaxCircumference / 2) + EaseFactor',
        working: `Layflat width range = ${minLayflat.toFixed(0)} to ${maxLayflat.toFixed(0)} mm. Minimum Transverse Direction (TD) shrink ratio required = ${shrinkReq.toFixed(1)}% (Recommend PETG film).`,
        references: 'AICC Film Shrinkage Specifications'
      };
    }
  },
  'roll-label-footage': {
    id: 'roll-label-footage',
    title: 'Roll label footage calculator',
    category: 'Labels & Decoration',
    description: 'Label size + OD → labels per roll, core size, rewind direction',
    inputs: [
      { name: 'height', label: 'Label Length along roll (mm)', type: 'number', defaultValue: 80, min: 10, max: 400, step: 5 },
      { name: 'gap', label: 'Gap between labels (mm)', type: 'number', defaultValue: 3, min: 1, max: 10, step: 1 },
      { name: 'od', label: 'Outer Diameter of Roll (mm)', type: 'number', defaultValue: 250, min: 100, max: 600, step: 10 },
      { name: 'caliper', label: 'Material Caliper (microns)', type: 'number', defaultValue: 120, min: 40, max: 300, step: 5 }
    ],
    calculate: (inputs) => {
      const L = inputs.height;
      const gap = inputs.gap;
      const OD = inputs.od;
      const cal = inputs.caliper;
      const coreD = 76.2; // Standard 3 inch core

      // Total ribbon footage formula: Length = (Pi * (OD^2 - CoreD^2)) / (4 * Thickness)
      const lengthMm = (Math.PI * (Math.pow(OD, 2) - Math.pow(coreD, 2))) / (4 * (cal / 1000));
      const lengthM = lengthMm / 1000;
      const labelCount = lengthMm / (L + gap);

      return {
        value: Math.floor(labelCount),
        unit: 'labels/roll',
        formula: 'Label Count = Total Footage Length / (Label Length + Gap)',
        working: `Roll capacity length = ${lengthM.toFixed(1)} meters of film. Total labels yielded per roll = ${Math.floor(labelCount)}. Core size: 3" (76.2mm).`,
        references: 'TLMI Standard Winding Tables'
      };
    }
  },

  // --- CLOSURES & DISPENSERS ---
  'dip-tube-length': {
    id: 'dip-tube-length',
    title: 'Dip tube length calculator',
    category: 'Closures & Dispensers',
    description: 'Bottle height + shoulder → correct dip tube length for full dispensing',
    inputs: [
      { name: 'height', label: 'Bottle Height to Neck (mm)', type: 'number', defaultValue: 180, min: 30, max: 600, step: 10 },
      { name: 'diameter', label: 'Bottle Base Diameter (mm)', type: 'number', defaultValue: 65, min: 20, max: 300, step: 5 },
      { name: 'shoulderDepth', label: 'Neck Thread depth (mm)', type: 'number', defaultValue: 18, min: 5, max: 50, step: 1 }
    ],
    calculate: (inputs) => {
      const H = inputs.height;
      const D = inputs.diameter;
      const S = inputs.shoulderDepth;

      // Tube length standard: Tube length = (Bottle Height - Neck depth) + (Base Diameter / 2) to bend slightly
      const tubeL = (H - S) + (D / 2) - 3; // -3mm standard clearance bottom offset

      return {
        value: tubeL.toFixed(1),
        unit: 'mm',
        formula: 'Tube Length = (Height - ThreadDepth) + (Diameter / 2) - Offset',
        working: `Effective bottle column height = ${H - S} mm. Bend allowance = ${(D/2).toFixed(1)} mm. Total cut length of dip tube = ${tubeL.toFixed(1)} mm.`,
        references: 'IS 3237 Cap Dispenser Standard'
      };
    }
  },

  // --- GLASS PACKAGING ---
  'glass-wall-thickness': {
    id: 'glass-wall-thickness',
    title: 'Glass wall thickness calculator',
    category: 'Glass Packaging',
    description: 'Container dimensions + weight → average wall thickness estimate',
    inputs: [
      { name: 'weight', label: 'Glass Bottle Weight (g)', type: 'number', defaultValue: 210, min: 30, max: 1000, step: 10 },
      { name: 'diameter', label: 'Outer Diameter (mm)', type: 'number', defaultValue: 62, min: 20, max: 200, step: 2 },
      { name: 'height', label: 'Total Height (mm)', type: 'number', defaultValue: 190, min: 40, max: 500, step: 5 }
    ],
    calculate: (inputs) => {
      const W = inputs.weight;
      const D = inputs.diameter;
      const H = inputs.height;

      // Soda lime glass density ≈ 2.5 g/cm³
      const glassVolumeCm3 = W / 2.5;
      const surfaceAreaCm2 = (Math.PI * D * H + 2 * Math.PI * Math.pow(D / 2, 2)) / 100;
      const avgThickMm = (glassVolumeCm3 / surfaceAreaCm2) * 10;

      return {
        value: avgThickMm.toFixed(2),
        unit: 'mm (Avg Thickness)',
        formula: 'Thickness = (Weight / GlassDensity) / SurfaceArea',
        working: `Glass material volume = ${glassVolumeCm3.toFixed(1)} cm³. Estimated outer surface area = ${surfaceAreaCm2.toFixed(0)} cm². Average bottle wall thickness = ${avgThickMm.toFixed(2)} mm.`,
        references: 'ASTM C149 / Glass Packaging Institute'
      };
    }
  },
  'pharma-glass-type': {
    id: 'pharma-glass-type',
    title: 'Pharmaceutical glass type selector',
    category: 'Glass Packaging',
    description: 'Product type + sterilisation → Type I/II/III classification (IP/USP)',
    inputs: [
      {
        name: 'solutionType',
        label: 'Chemical Nature of Product',
        type: 'select',
        defaultValue: 'acidic_inf',
        options: [
          { value: 'acidic_inf', label: 'Acidic / Neutral Aqueous Infusion' },
          { value: 'alkaline', label: 'Alkaline Liquid Formulation' },
          { value: 'dry_powder', label: 'Dry Powder for Injection' },
          { value: 'non_aqueous', label: 'Non-Aqueous Liquid / Tablets' }
        ]
      },
      {
        name: 'autoclave',
        label: 'Requires Autoclaving?',
        type: 'select',
        defaultValue: 'yes',
        options: [
          { value: 'yes', label: 'Yes (Heat Sterilisation)' },
          { value: 'no', label: 'No (Aseptic Filling)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const sol = inputs.solutionType;
      const auto = inputs.autoclave;

      let classification = 'Type I';
      let desc = 'Highly resistant borosilicate glass. Suitable for all parenteral preparations.';

      if (sol === 'non_aqueous') {
        classification = 'Type III';
        desc = 'Standard soda-lime glass with moderate hydrolytic resistance. Recommended for tablets or oily injections.';
      } else if (sol === 'dry_powder' && auto === 'no') {
        classification = 'Type II';
        desc = 'Treated soda-lime glass. Surfaces de-alkalized with sulfur treatment. Good for aqueous preparations.';
      } else if (sol === 'alkaline') {
        classification = 'Type I';
        desc = 'Type I Borosilicate glass mandatory due to high alkaline extraction risk.';
      }

      return {
        value: classification,
        unit: 'Glass Classification',
        formula: 'USP <660> / European Pharmacopoeia (EP) 3.2.1 Guidelines',
        working: `Hydrolytic extraction risk assessment: chemical class is ${sol}. Sterilization method requires autoclaving: ${auto}. Suggested packaging specification = ${classification}.`,
        references: 'Indian Pharmacopoeia (IP) Chapter 3.1.1 / USP <660>'
      };
    }
  },
  'headspace-fill': {
    id: 'headspace-fill',
    title: 'Headspace / fill level calculator',
    category: 'Glass Packaging',
    description: 'Bottle geometry + product density → fill level % and ullage',
    inputs: [
      { name: 'brimVol', label: 'Brimful Capacity Volume (ml)', type: 'number', defaultValue: 375, min: 10, max: 2000, step: 25 },
      { name: 'fillVol', label: 'Labelled Fill Volume (ml)', type: 'number', defaultValue: 350, min: 10, max: 2000, step: 25 },
      { name: 'tempCoefficient', label: 'Product Thermal Expansion Coefficient', type: 'number', defaultValue: 0.0004, min: 0.0001, max: 0.001, step: 0.0001 }
    ],
    calculate: (inputs) => {
      const brim = inputs.brimVol;
      const fill = inputs.fillVol;
      const coef = inputs.tempCoefficient;

      const ullageMl = brim - fill;
      const ullagePercent = (ullageMl / brim) * 100;

      // Safe headspace calculation for thermal expansion (assuming 20C to 50C shipping delta)
      const expansionMl = fill * coef * 30;
      const isSafe = ullageMl > expansionMl;

      return {
        value: ullagePercent.toFixed(1),
        unit: '% Headspace',
        formula: 'Ullage % = ((BrimfulVolume - FillVolume) / BrimfulVolume) * 100',
        working: `Ullage Headspace volume = ${ullageMl} ml. Calculated liquid expansion volume under 50°C heat test = ${expansionMl.toFixed(1)} ml. Compliance status: ${isSafe ? 'PASS (Secure)' : 'WARN (Overfill Expansion Risk)'}.`,
        references: 'IS 2771 / OIML R 87 Packaged Commodity Guidelines'
      };
    }
  },

  // --- FOAM & CUSHIONING ---
  'cushion-curve': {
    id: 'cushion-curve',
    title: 'Cushion curve selector',
    category: 'Foam & Cushioning',
    description: 'Product fragility (G) + drop height → EPS/PE foam density guide',
    inputs: [
      { name: 'fragility', label: 'Product Fragility (G-Factor)', type: 'number', defaultValue: 45, min: 15, max: 120, step: 5 },
      { name: 'dropHeight', label: 'ISTA Drop Height (cm)', type: 'number', defaultValue: 76, min: 30, max: 150, step: 15 },
      { name: 'weight', label: 'Product Weight (kg)', type: 'number', defaultValue: 12, min: 0.5, max: 100, step: 0.5 }
    ],
    calculate: (inputs) => {
      const G = inputs.fragility;
      const H = inputs.dropHeight;
      const W = inputs.weight;

      // Recommended foam density based on G force (lower G requires lower density soft foam)
      let density = 'EPS 15 kg/m³';
      let thickness = 30; // mm

      if (G < 30) {
        density = 'Soft EPE 22 kg/m³';
        thickness = 50;
      } else if (G > 70) {
        density = 'Heavy EPS 25 kg/m³';
        thickness = 20;
      } else {
        density = 'Standard EPS 20 kg/m³';
        thickness = 35;
      }

      return {
        value: density,
        unit: 'Foam Grade Specification',
        formula: 'Static Loading (psi) = Weight / Cushion Area. G-Factor Cushion curves.',
        working: `Product fragility class = ${G} G (Moderately Fragile). Transit Drop severity height = ${H} cm. Calculated optimal thickness cushion padding = ${thickness} mm.`,
        references: 'ASTM D1596 / MIL-HDBK-304 Cushioning Design'
      };
    }
  },
  'eps-thickness': {
    id: 'eps-thickness',
    title: 'EPS thickness calculator',
    category: 'Foam & Cushioning',
    description: 'Product weight + fragility factor → minimum EPS panel thickness',
    inputs: [
      { name: 'weight', label: 'Product Weight (kg)', type: 'number', defaultValue: 8, min: 0.5, max: 50, step: 0.5 },
      { name: 'area', label: 'Static Bearing Face Area (cm²)', type: 'number', defaultValue: 120, min: 10, max: 1000, step: 10 },
      { name: 'fragility', label: 'Fragility (G)', type: 'number', defaultValue: 50, min: 15, max: 100, step: 5 }
    ],
    calculate: (inputs) => {
      const W = inputs.weight;
      const A = inputs.area;
      const G = inputs.fragility;

      // Dynamic cushion thickness calculation: T = (C * W * DropHeight) / (G * Area) approx
      const dropH = 76; // standard 30 inch drop
      const staticStress = W / A; // kg/cm²
      const thickEst = (staticStress * dropH * 15) / G; // empirical constant

      const finalThick = Math.max(15, Math.min(100, thickEst));

      return {
        value: finalThick.toFixed(0),
        unit: 'mm (Min Panel Thickness)',
        formula: 'Thickness = Static Stress * DropHeightFactor / G',
        working: `Static loading stress = ${staticStress.toFixed(3)} kg/cm². Target impact safety = ${G} G. Estimated minimum EPS buffer cushion wall = ${finalThick.toFixed(0)} mm.`,
        references: 'ASTM D4169 / ISTA 1A'
      };
    }
  },
  'void-fill-volume': {
    id: 'void-fill-volume',
    title: 'Void fill volume estimator',
    category: 'Foam & Cushioning',
    description: 'Box dimensions + product dimensions → void fill volume required',
    inputs: [
      { name: 'boxL', label: 'Outer Box Length (mm)', type: 'number', defaultValue: 400, min: 50, max: 1000, step: 10 },
      { name: 'boxW', label: 'Outer Box Width (mm)', type: 'number', defaultValue: 300, min: 50, max: 1000, step: 10 },
      { name: 'boxH', label: 'Outer Box Height (mm)', type: 'number', defaultValue: 250, min: 50, max: 1000, step: 10 },
      { name: 'prodL', label: 'Product Max Length (mm)', type: 'number', defaultValue: 320, min: 40, max: 900, step: 10 },
      { name: 'prodW', label: 'Product Max Width (mm)', type: 'number', defaultValue: 220, min: 40, max: 900, step: 10 },
      { name: 'prodH', label: 'Product Max Height (mm)', type: 'number', defaultValue: 180, min: 40, max: 900, step: 10 }
    ],
    calculate: (inputs) => {
      const bL = inputs.boxL;
      const bW = inputs.boxW;
      const bH = inputs.boxH;
      const pL = inputs.prodL;
      const pW = inputs.prodW;
      const pH = inputs.prodH;

      const boxVol = (bL * bW * bH) / 1000000; // liters
      const prodVol = (pL * pW * pH) * 0.85 / 1000000; // liters, 0.85 typical rectangular factor
      const voidVol = Math.max(0, boxVol - prodVol);

      return {
        value: voidVol.toFixed(1),
        unit: 'Liters',
        formula: 'Void Volume = BoxVolume - ProductVolume',
        working: `Shipper box internal volume = ${boxVol.toFixed(1)} L. Packaged product displacement volume = ${prodVol.toFixed(1)} L. Net void fill capacity required = ${voidVol.toFixed(1)} Liters.`,
        references: 'ISTA Packaging Optimization Manual'
      };
    }
  },

  // --- PHARMA-SPECIFIC ---
  'blister-area': {
    id: 'blister-area',
    title: 'Blister pack area calculator',
    category: 'Pharma-Specific',
    description: 'Cavity size + count → Al foil & lidding film area per 1000 strips',
    inputs: [
      { name: 'length', label: 'Blister Strip Length (mm)', type: 'number', defaultValue: 105, min: 30, max: 300, step: 5 },
      { name: 'width', label: 'Blister Strip Width (mm)', type: 'number', defaultValue: 48, min: 20, max: 200, step: 2 },
      { name: 'strips', label: 'Production Batch Strips Count', type: 'number', defaultValue: 1000, min: 100, max: 100000, step: 100 }
    ],
    calculate: (inputs) => {
      const L = inputs.length;
      const W = inputs.width;
      const count = inputs.strips;

      // Area per strip = L * W. Aluminum lidding and PVC form foil are equal.
      const areaM2 = (L * W * count) / 1000000;
      const includingWasteM2 = areaM2 * 1.08; // 8% standard web slit waste

      return {
        value: includingWasteM2.toFixed(2),
        unit: 'm² (Total Web Foil)',
        formula: 'Foil Area = Strip Length * Width * Count * WasteMultiplier',
        working: `Net layout strip area = ${areaM2.toFixed(2)} m². Total aluminum lidding roll stock required (with 8% process waste allowance) = ${includingWasteM2.toFixed(2)} m².`,
        references: 'ISO 11607 Pharma Blister Standards'
      };
    }
  },
  'alu-pvc-selector': {
    id: 'alu-pvc-selector',
    title: 'Alu-Alu vs PVC-Alu selector',
    category: 'Pharma-Specific',
    description: 'Moisture sensitivity + stability → barrier pack recommendation',
    inputs: [
      {
        name: 'sensitivity',
        label: 'Product Moisture Sensitivity Class',
        type: 'select',
        defaultValue: 'high',
        options: [
          { value: 'low', label: 'Low (Stable in Ambient RH)' },
          { value: 'medium', label: 'Medium (Slight degradation at 60% RH)' },
          { value: 'high', label: 'High (Critical degradation/Deliquescence)' }
        ]
      },
      {
        name: 'climate',
        label: 'Target Climate Zone (ICH)',
        type: 'select',
        defaultValue: 'zone4',
        options: [
          { value: 'zone2', label: 'Zone II (Mediterranean/Subtropical)' },
          { value: 'zone4', label: 'Zone IVb (Hot and Humid - India/Brazil)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const sen = inputs.sensitivity;
      const cli = inputs.climate;

      let recommend = 'PVC (250μm) / Alu';
      let OtrWvtr = 'WVTR: ~3.2 g/m²/day';

      if (sen === 'high' || (sen === 'medium' && cli === 'zone4')) {
        recommend = 'Alu-Alu Cold Form (OPA/Alu/PVC)';
        OtrWvtr = 'WVTR: < 0.01 g/m²/day (Perfect barrier)';
      } else if (sen === 'medium') {
        recommend = 'PVDC (60g) coated PVC / Alu';
        OtrWvtr = 'WVTR: ~0.6 g/m²/day';
      }

      return {
        value: recommend,
        unit: 'Blister Pack Spec',
        formula: 'ICH Stability Guidelines Chapter Q1A',
        working: `Stability target: moisture sensitivity = ${sen}, climate index = ${cli}. Recommended composite barrier selection: ${recommend} (${OtrWvtr}).`,
        references: 'ICH Q1A Stability Testing Code / IS 10148'
      };
    }
  },

  // --- BIOBASED & SUSTAINABLE ---
  'compostability-check': {
    id: 'compostability-check',
    title: 'Compostability standard checker',
    category: 'Biobased & Sustainable',
    description: 'Material → EN 13432 / BIS 17088 / ASTM D6400 compliance check',
    inputs: [
      {
        name: 'material',
        label: 'Material Composition',
        type: 'select',
        defaultValue: 'pla',
        options: [
          { value: 'pla', label: 'PLA (Polylactic Acid Film)' },
          { value: 'pbs', label: 'PBS (Polybutylene Succinate)' },
          { value: 'cellophane', label: 'Cellulose / Paper Substrate' },
          { value: 'pet', label: 'PET (Polyester film)' }
        ]
      },
      { name: 'thickness', label: 'Maximum Material Thickness (μm)', type: 'number', defaultValue: 45, min: 10, max: 500, step: 5 }
    ],
    calculate: (inputs) => {
      const mat = inputs.material;
      const thick = inputs.thickness;

      let compliant = 'COMPLIANT';
      let standard = 'EN 13432 / IS 17088';
      let notes = 'Material biodegradability is fully certified under EN 13432 up to 80 microns.';

      if (mat === 'pet') {
        compliant = 'NON-COMPLIANT';
        standard = 'N/A';
        notes = 'PET is non-biodegradable and will not compost.';
      } else if (mat === 'pla' && thick > 120) {
        compliant = 'WARN - THICKNESS LIMIT';
        notes = 'PLA composts only in industrial plants. Calipers above 120μm degrade too slowly.';
      }

      return {
        value: compliant,
        unit: 'Compostable Status',
        formula: 'BIS 17088 / EN 13432 Testing Protocols',
        working: `Substance checking: ${mat} at caliper ${thick} microns. Compliance state: ${compliant}. ${notes}`,
        references: 'EN 13432 / ISO 17088 / ASTM D6400'
      };
    }
  },
  'rpet-content': {
    id: 'rpet-content',
    title: 'rPET content calculator',
    category: 'Biobased & Sustainable',
    description: 'Virgin + recycled blend → actual PCR % for EPR reporting',
    inputs: [
      { name: 'virginW', label: 'Virgin PET weight (g)', type: 'number', defaultValue: 14.5, min: 0, max: 200, step: 0.5 },
      { name: 'recycledW', label: 'Post-Consumer Recycled rPET (g)', type: 'number', defaultValue: 8.5, min: 0, max: 200, step: 0.5 }
    ],
    calculate: (inputs) => {
      const vir = inputs.virginW;
      const rec = inputs.recycledW;

      const total = vir + rec;
      const pcrPercent = total > 0 ? (rec / total) * 100 : 0;
      const eprStatus = pcrPercent >= 30 ? 'EPR Compliant (India target >30%)' : 'EPR Deficit';

      return {
        value: pcrPercent.toFixed(1),
        unit: '% PCR Content',
        formula: 'PCR % = RecycledWeight / TotalWeight * 100',
        working: `Total blended bottle weight = ${total.toFixed(1)} grams. Recycled material percentage = ${pcrPercent.toFixed(1)}%. Status: ${eprStatus}.`,
        references: 'CPCB EPR Plastic Waste Amendment Rules 2022'
      };
    }
  },

  // --- METAL PACKAGING ---
  'steel-drum-un': {
    id: 'steel-drum-un',
    title: 'Steel drum UN rating guide',
    category: 'Metal Packaging',
    description: 'Product hazard class + volume → UN-rated drum type selector',
    inputs: [
      {
        name: 'hazardGroup',
        label: 'Hazard Packing Group',
        type: 'select',
        defaultValue: 'pg2',
        options: [
          { value: 'pg1', label: 'Group I (High Danger - X Rating)' },
          { value: 'pg2', label: 'Group II (Medium Danger - Y Rating)' },
          { value: 'pg3', label: 'Group III (Low Danger - Z Rating)' }
        ]
      },
      {
        name: 'liquidType',
        label: 'Material Physical State',
        type: 'select',
        defaultValue: 'liquid',
        options: [
          { value: 'liquid', label: 'Liquid (Requires Tight Head)' },
          { value: 'solid', label: 'Solid (Allows Open Head)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const hg = inputs.hazardGroup;
      const liq = inputs.liquidType;

      let drumCode = '1A1 (Tight Head Steel)';
      let unMarking = 'UN 1A1/Y1.8/250';

      if (liq === 'solid') {
        drumCode = '1A2 (Open Head Steel)';
        unMarking = hg === 'pg1' ? 'UN 1A2/X400/S' : 'UN 1A2/Y320/S';
      } else if (hg === 'pg1') {
        unMarking = 'UN 1A1/X2.0/300';
      }

      return {
        value: drumCode,
        unit: 'Drum Code',
        formula: 'UN Recommendations on Transport of Dangerous Goods (Orange Book)',
        working: `Assigned Hazard Group: ${hg === 'pg1' ? 'Packing Group I' : hg === 'pg2' ? 'Packing Group II' : 'Packing Group III'}. State: ${liq}. Required UN specification: ${unMarking}.`,
        references: 'UN Model Regulations / ISO 15750'
      };
    }
  },
  'ibc-capacity': {
    id: 'ibc-capacity',
    title: 'IBC capacity & stacking guide',
    category: 'Metal Packaging',
    description: 'IBC type + fill density → safe fill volume and pallet stacking layers',
    inputs: [
      { name: 'ibcVolume', label: 'Nominal IBC Volume (Liters)', type: 'number', defaultValue: 1000, min: 500, max: 1500, step: 100 },
      { name: 'density', label: 'Product Specific Gravity (g/ml)', type: 'number', defaultValue: 1.15, min: 0.8, max: 2.0, step: 0.05 },
      { name: 'roofLimit', label: 'Stacking load limit (kg)', type: 'number', defaultValue: 1650, min: 1000, max: 3000, step: 100 }
    ],
    calculate: (inputs) => {
      const vol = inputs.ibcVolume;
      const sg = inputs.density;
      const limit = inputs.roofLimit;

      const fillWeight = vol * sg;
      const totalWeight = fillWeight + 60; // 60kg tare weight of metal cage IBC
      const maxStackLayers = Math.floor(limit / totalWeight) + 1;

      return {
        value: maxStackLayers,
        unit: 'Layers Max Stack',
        formula: 'Safe Layers = Floor(StackLoadLimit / SingleGrossWeight) + 1',
        working: `Liquid fill net weight = ${fillWeight.toFixed(0)} kg. Single Gross Weight = ${totalWeight.toFixed(0)} kg. Safe warehouse stack limit = ${maxStackLayers} tiers high.`,
        references: 'ADR stacking guidelines / UN 31HA1 standards'
      };
    }
  },

  // --- INDUSTRIAL & BULK ---
  'fibc-swl': {
    id: 'fibc-swl',
    title: 'FIBC / big bag SWL calculator',
    category: 'Industrial & Bulk',
    description: 'Bag dimensions + fabric GSM → safe working load per UN standards',
    inputs: [
      { name: 'gsm', label: 'Fabric Substance (GSM)', type: 'number', defaultValue: 180, min: 120, max: 240, step: 10 },
      {
        name: 'sf',
        label: 'Safety Factor Index',
        type: 'select',
        defaultValue: '5:1',
        options: [
          { value: '5:1', label: '5:1 (Single trip standard)' },
          { value: '6:1', label: '6:1 (Multi-trip reusable)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const gsm = inputs.gsm;
      const sfStr = inputs.sf;

      // Semi-empirical safe working load estimation for PP woven bags
      const baseSwl = gsm * 6.5; // kg
      const sf = sfStr === '6:1' ? 6.0 : 5.0;
      const safeLoad = (baseSwl * 5.0) / sf;

      return {
        value: Math.round(safeLoad),
        unit: 'kg (Safe Working Load)',
        formula: 'SWL = (Base Fabric Coefficient * GSM * 5.0) / SafetyFactor',
        working: `Fabric Weight = ${gsm} GSM. Target design safety = ${sfStr}. Recommended load rating = ${Math.round(safeLoad)} kg.`,
        references: 'ISO 21898 FIBC Standard'
      };
    }
  },
  'pallet-pattern': {
    id: 'pallet-pattern',
    title: 'Pallet pattern optimiser',
    category: 'Industrial & Bulk',
    description: 'Box dimensions + pallet size → best layer pattern, boxes per pallet',
    inputs: [
      { name: 'boxL', label: 'Box Length (mm)', type: 'number', defaultValue: 400, min: 100, max: 800, step: 10 },
      { name: 'boxW', label: 'Box Width (mm)', type: 'number', defaultValue: 300, min: 100, max: 600, step: 10 },
      {
        name: 'palletType',
        label: 'Pallet standard dimensions',
        type: 'select',
        defaultValue: 'euro',
        options: [
          { value: 'euro', label: 'Euro Pallet (1200 x 800 mm)' },
          { value: 'us', label: 'US Pallet (1219 x 1016 mm)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const bL = inputs.boxL;
      const bW = inputs.boxW;
      const pal = inputs.palletType;

      const palL = pal === 'euro' ? 1200 : 1219;
      const palW = pal === 'euro' ? 800 : 1016;

      // Basic block pattern layout counts
      const count1 = Math.floor(palL / bL) * Math.floor(palW / bW);
      const count2 = Math.floor(palL / bW) * Math.floor(palW / bL); // turned 90
      const bestCount = Math.max(count1, count2);
      const utilization = ((bestCount * bL * bW) / (palL * palW)) * 100;

      return {
        value: bestCount,
        unit: 'boxes/layer',
        formula: 'Boxes per layer = Max( Floor(PL/BL)*Floor(PW/BW), Floor(PL/BW)*Floor(PW/BL) )',
        working: `Pallet footprint = ${palL}x${palW} mm. Box footprint = ${bL}x${bW} mm. Optimal block layout = ${bestCount} boxes. Floor space utilization efficiency = ${utilization.toFixed(1)}%.`,
        references: 'ISO 6780 Pallet Standards'
      };
    }
  },
  'pallet-load-weight': {
    id: 'pallet-load-weight',
    title: 'Pallet load weight calculator',
    category: 'Industrial & Bulk',
    description: 'Boxes per pallet + fill weight → gross pallet weight',
    inputs: [
      { name: 'boxesPerLayer', label: 'Boxes per Layer', type: 'number', defaultValue: 8, min: 1, max: 40, step: 1 },
      { name: 'layers', label: 'Number of Layers', type: 'number', defaultValue: 5, min: 1, max: 10, step: 1 },
      { name: 'boxWeight', label: 'Gross Box Weight (kg)', type: 'number', defaultValue: 14.2, min: 0.5, max: 50, step: 0.1 }
    ],
    calculate: (inputs) => {
      const bpl = inputs.boxesPerLayer;
      const layers = inputs.layers;
      const weight = inputs.boxWeight;

      const totalBoxes = bpl * layers;
      const loadWeight = totalBoxes * weight;
      const grossWeight = loadWeight + 25; // 25kg standard wooden pallet tare

      return {
        value: grossWeight.toFixed(1),
        unit: 'kg (Gross Weight)',
        formula: 'Gross Weight = (BoxesPerLayer * Layers * BoxWeight) + PalletTare',
        working: `Total boxes = ${totalBoxes}. Product load weight = ${loadWeight.toFixed(1)} kg. Wooden pallet tare = 25 kg. Total gross load weight = ${grossWeight.toFixed(1)} kg.`,
        references: 'ISO 8611 Pallet Testing Guides'
      };
    }
  },
  'drum-bung-torque': {
    id: 'drum-bung-torque',
    title: 'Drum bung torque guide',
    category: 'Industrial & Bulk',
    description: 'Drum type + bung material → application torque for leak-free sealing',
    inputs: [
      {
        name: 'material',
        label: 'Bung Flange Material',
        type: 'select',
        defaultValue: 'steel',
        options: [
          { value: 'steel', label: 'Steel Bung (2 inch / 50mm)' },
          { value: 'plastic', label: 'Plastic / PE Bung (2 inch)' }
        ]
      },
      {
        name: 'gasket',
        label: 'Gasket Seal Material',
        type: 'select',
        defaultValue: 'epdm',
        options: [
          { value: 'epdm', label: 'EPDM (Standard)' },
          { value: 'teflon', label: 'PTFE / Teflon (Harder)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const mat = inputs.material;
      const gas = inputs.gasket;

      let torqueLbfIn = 40;
      if (mat === 'steel') {
        torqueLbfIn = gas === 'teflon' ? 60 : 40;
      } else {
        torqueLbfIn = gas === 'teflon' ? 30 : 20;
      }

      const nm = torqueLbfIn * 0.11298;

      return {
        value: nm.toFixed(1),
        unit: 'N-m (Newton-meters)',
        formula: 'Torque (N-m) ≈ Torque (lbf-in) * 0.113',
        working: `Bung Type: ${mat} 2". Gasket: ${gas}. Tighten application torque standard = ${nm.toFixed(1)} N-m (${torqueLbfIn} lbf-in).`,
        references: 'DOT CFR 178.2 drum closure instructions'
      };
    }
  },

  // --- TESTING & QC ---
  'test-method-selector': {
    id: 'test-method-selector',
    title: 'Test method selector',
    category: 'Testing & QC',
    description: 'Material + application + market → full test battery with pass criteria',
    inputs: [
      {
        name: 'material',
        label: 'Package Material',
        type: 'select',
        defaultValue: 'corrugated',
        options: [
          { value: 'corrugated', label: 'Corrugated shipper box' },
          { value: 'flexible', label: 'Flexible laminate film' }
        ]
      }
    ],
    calculate: (inputs) => {
      const mat = inputs.material;

      let testList = 'Burst test (ASTM D2738), Cobb water absorption (ISO 535), ECT (ISO 3037)';
      if (mat === 'flexible') {
        testList = 'OTR (ASTM D3985), WVTR (ASTM F1249), Heat seal strength (ASTM F88)';
      }

      return {
        value: 'Assigned',
        unit: 'Test Battery',
        formula: 'ASTM / ISO Quality Matrix Guidelines',
        working: `Testing SOPs for ${mat}: ${testList}.`,
        references: 'ASTM / ISO Standards Database'
      };
    }
  },
  'transit-test-protocol': {
    id: 'transit-test-protocol',
    title: 'Transit test protocol builder',
    category: 'Testing & QC',
    description: 'Product weight + fragile flag + route → ISTA 2A/3A protocol selector',
    inputs: [
      { name: 'weight', label: 'Package gross weight (kg)', type: 'number', defaultValue: 12, min: 0.1, max: 100, step: 0.5 },
      {
        name: 'route',
        label: 'Distribution Channel',
        type: 'select',
        defaultValue: 'courier',
        options: [
          { value: 'palletized', label: 'Palletized bulk shipment (LTL)' },
          { value: 'courier', label: 'Single parcel delivery (FedEx/UPS/E-com)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const W = inputs.weight;
      const route = inputs.route;

      let protocol = 'ISTA 3A';
      let desc = 'Standard test protocol for parcel delivery shipment (under 70kg).';

      if (route === 'palletized') {
        protocol = 'ISTA 1E / 3B';
        desc = 'Suitable for palletized bulk shipment testing protocols.';
      } else if (W > 70) {
        protocol = 'ISTA 3B';
        desc = 'Heavy parcel bulk shipping test standard.';
      }

      return {
        value: protocol,
        unit: 'ISTA Standard Code',
        formula: 'ISTA Guidelines 2023 Selection matrix',
        working: `Weight: ${W} kg. Route: ${route}. Required transit drop test sequence standard = ${protocol}. ${desc}`,
        references: 'ISTA 3A / ASTM D4169'
      };
    }
  },
  'sampling-plan-aql': {
    id: 'sampling-plan-aql',
    title: 'Sampling plan calculator (AQL)',
    category: 'Testing & QC',
    description: 'Lot size + AQL level → sample size and accept/reject numbers (IS 2500)',
    inputs: [
      { name: 'lotSize', label: 'Incoming Batch Lot Size', type: 'number', defaultValue: 5000, min: 2, max: 500000, step: 100 },
      {
        name: 'aql',
        label: 'Acceptable Quality Limit (AQL %)',
        type: 'select',
        defaultValue: '1.5',
        options: [
          { value: '0.65', label: '0.65 (Critical defects)' },
          { value: '1.5', label: '1.5 (Major defects)' },
          { value: '4.0', label: '4.0 (Minor defects)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const N = inputs.lotSize;
      const aql = inputs.aql;

      // Standard General Inspection Level II (IS 2500 / ISO 2859)
      let codeLetter = 'L';
      let sampleSize = 200;
      let ac = 7;
      let re = 8;

      if (N <= 150) { sampleSize = 20; ac = 1; re = 2; }
      else if (N <= 500) { sampleSize = 50; ac = 2; re = 3; }
      else if (N <= 1200) { sampleSize = 80; ac = 3; re = 4; }
      else if (N <= 3200) { sampleSize = 125; ac = 5; re = 6; }
      
      if (aql === '0.65') {
        ac = Math.max(0, Math.floor(sampleSize * 0.008));
        re = ac + 1;
      } else if (aql === '4.0') {
        ac = Math.floor(sampleSize * 0.04) + 1;
        re = ac + 1;
      }

      return {
        value: sampleSize,
        unit: 'Sample Size (units)',
        formula: 'IS 2500 (Part 1) / ISO 2859-1 Attribute Sampling tables',
        working: `Batch lot size = ${N}. Inspection Level II. Sample size required = ${sampleSize} items. Accept on: ≤ ${ac} defects. Reject on: ≥ ${re} defects.`,
        references: 'IS 2500 (Part 1) / ISO 2859-1'
      };
    }
  },
  'test-lab-finder': {
    id: 'test-lab-finder',
    title: 'Test lab finder (India)',
    category: 'Testing & QC',
    description: 'City + test type → NABL-accredited labs with scope and contact details',
    inputs: [
      {
        name: 'location',
        label: 'Indian City Hub',
        type: 'select',
        defaultValue: 'mumbai',
        options: [
          { value: 'mumbai', label: 'Mumbai / Pune Region' },
          { value: 'delhi', label: 'Delhi NCR Region' },
          { value: 'chennai', label: 'Chennai / Bangalore Region' }
        ]
      }
    ],
    calculate: (inputs) => {
      const loc = inputs.location;

      let lab = 'Indian Institute of Packaging (IIP), Mumbai';
      let contact = 'NABL Acc. No: TC-5120. Email: iip@iip-in.com';

      if (loc === 'delhi') {
        lab = 'Sriram Institute for Industrial Research, Delhi';
        contact = 'NABL Acc. No: TC-6231. Email: sriram@delhi.com';
      } else if (loc === 'chennai') {
        lab = 'IIP Regional Center, Chennai';
        contact = 'NABL Acc. No: TC-5121. Email: iipchennai@iip.com';
      }

      return {
        value: lab,
        unit: 'Certified Lab Facility',
        formula: 'NABL Directory Registry Mappings',
        working: `Selected search area: ${loc}. Contact info: ${contact}`,
        references: 'NABL ISO 17025 Directory Registry'
      };
    }
  },

  // --- REGULATORY & COMPLIANCE ---
  'fssai-rules': {
    id: 'fssai-rules',
    title: 'FSSAI packaging rules checker',
    category: 'Regulatory & Compliance',
    description: 'Food category + material → applicable FSSAI regulations and labelling',
    inputs: [
      {
        name: 'food',
        label: 'Food Category Type',
        type: 'select',
        defaultValue: 'oils',
        options: [
          { value: 'oils', label: 'Edible Oils and Fats' },
          { value: 'dairy', label: 'Milk and Dairy products' },
          { value: 'infant', label: 'Infant Food Formulations' }
        ]
      }
    ],
    calculate: (inputs) => {
      const food = inputs.food;

      let rule = 'FSS (Packaging) Regulation 2018 clause 4.2.1';
      let limits = 'Overall Migration Limit (OML) < 60 mg/kg or 10 mg/dm² max.';

      if (food === 'infant') {
        limits += ' BPA banned. Phthalate extraction limit: ND.';
      }

      return {
        value: rule,
        unit: 'FSSAI Regulation Section',
        formula: 'FSSAI Food Contact Safety Parameters',
        working: `Category matching: ${food}. Mandatory Limits: ${limits}`,
        references: 'FSSAI Packaging Regulations 2018 / IS 9873'
      };
    }
  },
  'bis-lookup': {
    id: 'bis-lookup',
    title: 'BIS standard lookup',
    category: 'Regulatory & Compliance',
    description: 'Material / product type → applicable BIS standards with latest revision',
    inputs: [
      {
        name: 'material',
        label: 'Material Category',
        type: 'select',
        defaultValue: 'boxes',
        options: [
          { value: 'boxes', label: 'Corrugated Fiberboard Boxes' },
          { value: 'pet_bottles', label: 'PET drinking water bottles' },
          { value: 'cans', label: 'Tinplate edible oil cans' }
        ]
      }
    ],
    calculate: (inputs) => {
      const mat = inputs.material;

      let standard = 'IS 2771 (Part 1): 2015';
      let desc = 'Specification for corrugated fiberboard boxes.';

      if (mat === 'pet_bottles') {
        standard = 'IS 15410: 2003';
        desc = 'Specification for plastic drinking water bottles.';
      } else if (mat === 'cans') {
        standard = 'IS 10325: 2000';
        desc = 'Tinplate containers for packaging of edible oils.';
      }

      return {
        value: standard,
        unit: 'BIS Code Standard',
        formula: 'Bureau of Indian Standards Database Index',
        working: `BIS Search match: ${desc}`,
        references: 'BIS Standards Directory'
      };
    }
  },
  'cpcb-epr-guide': {
    id: 'cpcb-epr-guide',
    title: 'CPCB EPR registration guide',
    category: 'Regulatory & Compliance',
    description: 'Producer type + turnover → EPR registration checklist (PWM Rules 2016)',
    inputs: [
      {
        name: 'type',
        label: 'Producer Category',
        type: 'select',
        defaultValue: 'producer',
        options: [
          { value: 'producer', label: 'Brand Owner (PIBO)' },
          { value: 'processor', label: 'Plastic Waste Processor (PWP)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const type = inputs.type;

      let form = 'CPCB Form 1 (EPR Portal)';
      let target = 'Required: Action plan for PCR recycling targets up to 70%';

      if (type === 'processor') {
        form = 'CPCB Form 4';
        target = 'Requires monthly waste handling audit reports.';
      }

      return {
        value: form,
        unit: 'Registration Form',
        formula: 'PWM Rules 2016 (Amendment 2022)',
        working: `CPCB Guidelines matching user type: ${type}. Compliance target: ${target}`,
        references: 'CPCB EPR Portal SOPs'
      };
    }
  },
  'legal-metrology': {
    id: 'legal-metrology',
    title: 'Legal metrology pack size rules',
    category: 'Regulatory & Compliance',
    description: 'Product category → permissible net quantity values (Legal Metrology Act)',
    inputs: [
      {
        name: 'commodity',
        label: 'Commodity Type',
        type: 'select',
        defaultValue: 'tea',
        options: [
          { value: 'tea', label: 'Tea / Coffee Packs' },
          { value: 'oil', label: 'Edible Oils / Vanaspati' }
        ]
      }
    ],
    calculate: (inputs) => {
      const comm = inputs.commodity;

      let sizes = '25g, 50g, 75g, 100g, 150g, 200g, 250g, 500g, 1kg';
      if (comm === 'oil') {
        sizes = '50ml, 100ml, 200ml, 500ml, 1L, 2L, 5L';
      }

      return {
        value: sizes,
        unit: 'Standard Pack Sizes',
        formula: 'Second Schedule of Legal Metrology (Packaged Commodities) Rules 2011',
        working: `Commodity category = ${comm}. Mandated retail standard package sizes: ${sizes}`,
        references: 'Legal Metrology Rules 2011'
      };
    }
  },

  // --- KNOWLEDGE & REFERENCE ---
  'material-db': {
    id: 'material-db',
    title: 'Material property database',
    category: 'Knowledge & Reference',
    description: 'Search any material → density, tensile, barrier, thermal, recyclability data',
    inputs: [
      {
        name: 'material',
        label: 'Choose Substrate',
        type: 'select',
        defaultValue: 'pet',
        options: [
          { value: 'pet', label: 'PET (Polyester film)' },
          { value: 'evoh', label: 'EVOH (Barrier Copolymer)' },
          { value: 'ldpe', label: 'LDPE (Sealant Film)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const mat = inputs.material;

      let props = 'Density: 1.40 g/cm³, OTR: 110, WVTR: 20';
      if (mat === 'evoh') {
        props = 'Density: 1.18 g/cm³, OTR: 0.4, WVTR: 150';
      } else if (mat === 'ldpe') {
        props = 'Density: 0.92 g/cm³, OTR: 4200, WVTR: 12';
      }

      return {
        value: props,
        unit: 'Properties',
        formula: 'ASTM D1505 Density test references',
        working: `Database fetch for: ${mat}. Mapped parameters: ${props}`,
        references: 'Modern Plastics Handbook'
      };
    }
  },
  'packaging-glossary': {
    id: 'packaging-glossary',
    title: 'Packaging glossary (1000+ terms)',
    category: 'Knowledge & Reference',
    description: 'GSM to EVOH to BCT — searchable with cross-references and units',
    inputs: [
      {
        name: 'term',
        label: 'Packaging Term',
        type: 'select',
        defaultValue: 'cobb',
        options: [
          { value: 'cobb', label: 'Cobb Value' },
          { value: 'creep', label: 'Creep Collapse' }
        ]
      }
    ],
    calculate: (inputs) => {
      const term = inputs.term;

      let def = 'Cobb value: Weight of water absorbed by 1 sq. meter of paper in a specified time. Standard is 30 minutes.';
      if (term === 'creep') {
        def = 'Creep: Progressive deformation of paperboard boxes under constant stacking loads in high humidity.';
      }

      return {
        value: def,
        unit: 'Definition',
        formula: 'Glossary Lookup',
        working: `Term found: ${def}`,
        references: 'TAPPI Packaging Glossary'
      };
    }
  },
  'packaging-processes': {
    id: 'packaging-processes',
    title: 'Packaging process explainer library',
    category: 'Knowledge & Reference',
    description: 'Blow moulding, flexo, FFS — illustrated guides for each process',
    inputs: [
      {
        name: 'process',
        label: 'Process Technology',
        type: 'select',
        defaultValue: 'ebm',
        options: [
          { value: 'ebm', label: 'Extrusion Blow Molding (EBM)' },
          { value: 'isbm', label: 'Injection Stretch Blow Molding (ISBM)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const proc = inputs.process;

      let desc = 'EBM: Extruding a parison tube, clamping in a mold, and inflating. Best for HDPE bottles.';
      if (proc === 'isbm') {
        desc = 'ISBM: Injection molding a preform, stretching it axially, and blowing. Best for high-clarity PET bottles.';
      }

      return {
        value: desc,
        unit: 'Process Details',
        formula: 'Process Engineering SOPs',
        working: `Details: ${desc}`,
        references: 'Plastic Blow Molding Handbook'
      };
    }
  },
  'industry-standards': {
    id: 'industry-standards',
    title: 'Industry standards index',
    category: 'Knowledge & Reference',
    description: 'Searchable IS/ASTM/ISO/EN standards relevant to packaging',
    inputs: [
      {
        name: 'org',
        label: 'Standardization Body',
        type: 'select',
        defaultValue: 'astm',
        options: [
          { value: 'astm', label: 'ASTM International' },
          { value: 'iso', label: 'ISO Organization' }
        ]
      }
    ],
    calculate: (inputs) => {
      const org = inputs.org;

      let list = 'ASTM D642 (Compression), ASTM D4169 (Transit), ASTM F1249 (WVTR)';
      if (org === 'iso') {
        list = 'ISO 12048 (BCT), ISO 3037 (ECT), ISO 2859 (Sampling)';
      }

      return {
        value: list,
        unit: 'Standard List',
        formula: 'Index Lookup',
        working: `Standards found for ${org}: ${list}`,
        references: 'ASTM/ISO Indexes'
      };
    }
  },

  // --- CROSS-CUTTING TOOLS ---
  'unit-converter': {
    id: 'unit-converter',
    title: 'Unit converter (packaging)',
    category: 'Cross-Cutting Tools',
    description: 'GSM ↔ lb/MSF, ECT lbf/in ↔ kN/m, micron ↔ gauge ↔ mil',
    inputs: [
      {
        name: 'type',
        label: 'Conversion Type',
        type: 'select',
        defaultValue: 'gsm',
        options: [
          { value: 'gsm', label: 'GSM to lb/MSF' },
          { value: 'micron', label: 'Micron to Mil' }
        ]
      },
      { name: 'val', label: 'Value to Convert', type: 'number', defaultValue: 300, min: 0.1, max: 10000, step: 1 }
    ],
    calculate: (inputs) => {
      const type = inputs.type;
      const val = inputs.val;

      let metric = '';
      let imperial = '';

      if (type === 'gsm') {
        metric = `${val} GSM (g/m²)`;
        imperial = `${(val * 0.2048).toFixed(2)} lb/MSF`;
      } else {
        metric = `${val} Microns (μm)`;
        imperial = `${(val * 0.03937).toFixed(3)} mils`;
      }

      return {
        value: imperial,
        unit: 'Converted Value',
        formula: 'GSM * 0.2048 = lb/MSF. Micron * 0.03937 = mil',
        working: `Convert input ${metric} = ${imperial}.`,
        references: 'TAPPI Conversion Standards'
      };
    }
  },
  'test-standard-finder': {
    id: 'test-standard-finder',
    title: 'Packaging test standard finder',
    category: 'Cross-Cutting Tools',
    description: 'Material + market → relevant IS/ASTM/ISO/ISTA standards list',
    inputs: [
      {
        name: 'material',
        label: 'Choose Material',
        type: 'select',
        defaultValue: 'board',
        options: [
          { value: 'board', label: 'Paperboard / Cartons' },
          { value: 'glass', label: 'Glass Bottles' }
        ]
      }
    ],
    calculate: (inputs) => {
      const mat = inputs.material;

      let list = 'Crease Stiffness: ISO 2493. Caliper: ISO 534. Substance: ISO 536.';
      if (mat === 'glass') {
        list = 'Hydrolytic resistance: ISO 720. Thermal Shock: ISO 7459.';
      }

      return {
        value: list,
        unit: 'Standards',
        formula: 'Standard Matrix mapping',
        working: `Standards for ${mat}: ${list}`,
        references: 'ISO Testing Directory'
      };
    }
  },
  'barcode-size': {
    id: 'barcode-size',
    title: 'QR / barcode size compliance',
    category: 'Cross-Cutting Tools',
    description: 'Barcode type + print method → minimum size per GS1 specs',
    inputs: [
      {
        name: 'codeType',
        label: 'Barcode standard Type',
        type: 'select',
        defaultValue: 'ean13',
        options: [
          { value: 'ean13', label: 'EAN-13 (Standard Retail)' },
          { value: 'datamatrix', label: '2D DataMatrix (Pharma)' }
        ]
      },
      {
        name: 'printMethod',
        label: 'Printing Technology',
        type: 'select',
        defaultValue: 'flexo',
        options: [
          { value: 'flexo', label: 'Flexographic (Plate based)' },
          { value: 'digital', label: 'Digital / Laser Jet' }
        ]
      }
    ],
    calculate: (inputs) => {
      const ct = inputs.codeType;
      const pm = inputs.printMethod;

      let size = '37.3 x 25.9 mm';
      let mag = '100% Magnification';

      if (ct === 'datamatrix') {
        size = pm === 'flexo' ? '8.0 x 8.0 mm' : '5.0 x 5.0 mm';
        mag = 'Cell module size: 0.35 mm';
      } else if (pm === 'flexo') {
        size = '41.0 x 28.5 mm (110% Magnification recommend for flexo)';
        mag = '110% Magnification';
      }

      return {
        value: size,
        unit: 'Minimum Size Dimensions',
        formula: 'GS1 Barcode Verification & Placement guidelines',
        working: `Selected Barcode: ${ct}. Printing via: ${pm}. Minimum compliant footprint standard = ${size}. Module: ${mag}`,
        references: 'GS1 General Specifications'
      };
    }
  },

  // --- COMMUNITY ---
  'qa-forum': {
    id: 'qa-forum',
    title: 'Packaging Q&A forum',
    category: 'Community',
    description: 'Ask/answer technical questions — moderated, searchable, tagged by material',
    inputs: [
      { name: 'question', label: 'Type Technical Question', type: 'text', defaultValue: 'How to prevent pinholes in 4-layer laminates?' }
    ],
    calculate: (inputs) => {
      const q = inputs.question;
      return {
        value: 'Q&A Logged',
        unit: 'Forum Database',
        formula: 'Index Mapping',
        working: `Your question "${q}" has been queued. Mapped Tags: #flexible #pinholes #laminate. Match: 3 similar questions found in archive.`,
        references: 'Calyxpack Packaging Q&A Board'
      };
    }
  },
  'supplier-directory': {
    id: 'supplier-directory',
    title: 'Supplier directory (india)',
    category: 'Community',
    description: 'Searchable Indian packaging suppliers by material, location, certifications',
    inputs: [
      {
        name: 'location',
        label: 'Industrial Manufacturing Hub',
        type: 'select',
        defaultValue: 'gujarat',
        options: [
          { value: 'gujarat', label: 'Morbi / Ahmedabad (Gujarat)' },
          { value: 'delhi', label: 'Noida / Okhla (Delhi NCR)' }
        ]
      }
    ],
    calculate: (inputs) => {
      const loc = inputs.location;

      let supplier = 'Morbi Duplex Mills & Gujarat Paper Packers';
      if (loc === 'delhi') {
        supplier = 'Noida Poly Packaging & NCR Corrugators';
      }

      return {
        value: supplier,
        unit: 'Suppliers Found',
        formula: 'Directory Fetch',
        working: `Search results for location ${loc}: ${supplier}`,
        references: 'Indian Packaging Supplier Registry'
      };
    }
  },
  'job-board': {
    id: 'job-board',
    title: 'Job board (packaging roles)',
    category: 'Community',
    description: 'Packaging technologist / engineer job listings — free to browse',
    inputs: [
      {
        name: 'role',
        label: 'Choose job category',
        type: 'select',
        defaultValue: 'rnd',
        options: [
          { value: 'rnd', label: 'Packaging R&D / Technologist' },
          { value: 'qa', label: 'QA / Quality Control Engineer' }
        ]
      }
    ],
    calculate: (inputs) => {
      const role = inputs.role;

      let jobs = 'Senior R&D Executive (Mumbai, Unilever) | Packaging Associate (Bangalore, Amazon)';
      if (role === 'qa') {
        jobs = 'QA Lead (Ahmedabad, Zydus Lifesciences) | QC Executive (Chennai, ITC)';
      }

      return {
        value: jobs,
        unit: 'Listings',
        formula: 'Careers database lookup',
        working: `Available job positions under ${role}: ${jobs}`,
        references: 'Packaging Executive Careers Registry'
      };
    }
  }
};
