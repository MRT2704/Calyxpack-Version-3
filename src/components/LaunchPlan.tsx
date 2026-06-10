import React, { useState, lazy, Suspense } from 'react';
import { 
  Box, 
  Package, 
  Layers, 
  Layers2, 
  Database as DbIcon, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Search, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
const LazyDynamicCalculatorModal = lazy(() => import('./DynamicCalculatorModal'));
import { PACKAGING_TOOLS } from '../utils/packagingCalculators';

interface ToolItem {
  t: string; // title
  d: string; // description
  tags: string[]; // tags like 'edge', 'ai', 'reg', 'workflow'
}

interface SectionGroup {
  id: string;
  label: string;
  bg: string;
  ic: string;
  icon: any; // Lucide icon
  tools: ToolItem[];
}

const PHASES_METADATA = {
  1: {
    title: "Phase 1 — Free Tier (51 Active Tools)",
    sub: "Launched & Unlocked. Every tool in this phase is 100% free with no login or registration needed to support speed and reliability for packaging professionals.",
    badge: "Active",
    badgeColor: "bg-[#7BA05B]/10 text-[#234734] border-[#7BA05B]/20",
    timeline: "Currently Live",
    highlights: ["No Registration Required", "100% Client-Side Solvers", "Instant PDF Explanations"]
  },
  2: {
    title: "Phase 2 — Pro Tier (50 Tools - Deferred Roadmap)",
    sub: "Advanced composite estimation models, complex seal optimization solvers, and full torque compliance guides. Currently on holds to prioritize 100% free accessibility.",
    badge: "Planning",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
    timeline: "Proposed Month 3–6",
    highlights: ["High-Fidelity Simulators", "Workflow Assistance", "Performance Benchmarks"]
  },
  3: {
    title: "Phase 3 — Premium & Enterprise (30 Tools - Deferred Roadmap)",
    sub: "AI-powered reverse-engineering engines and custom CPCB EPR automatic compliance builders. Postponed to keep the platform flat and democratized.",
    badge: "Planning",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
    timeline: "Proposed Month 7+",
    highlights: ["AI Grounding", "Enterprise Bulk Configs", "BOM Multi-Calculations"]
  }
};

const PHASES_DATA: Record<number, SectionGroup[]> = {
  1: [
    {id:"corr",label:"Corrugated & Shippers",bg:"#EAF3DE",ic:"#27500A",icon:Box,tools:[
      {t:"BCT / McKee calculator",d:"ECT → BCT with flute selector, India GSM grades, humidity derating",tags:["edge"]},
      {t:"Burst strength estimator",d:"Mullen burst ↔ ECT conversion, liner + medium GSM inputs",tags:[]},
      {t:"Flute combination selector",d:"Single/double/triple wall — B,C,E,F,BC,EB with caliper database",tags:["edge"]},
      {t:"RCT → ECT converter",d:"Ring Crush Test to ECT — standard in Indian mills, missing online",tags:["edge"]},
      {t:"Box blank size calculator",d:"RSC/HSC/FOL dimensions → blank length, waste %, board area",tags:[]},
    ]},
    {id:"carton",label:"Folding Cartons",bg:"#E6F1FB",ic:"#0C447C",icon:Package,tools:[
      {t:"Bending stiffness calculator",d:"GSM → caliper → Taber/L&W stiffness for SBS/FBB/WLC",tags:[]},
      {t:"Blank size & board area",d:"ECMA/FEFCO style selector → blank dimensions + GSM weight",tags:[]},
      {t:"Packaging brief template generator",d:"Fill product details → auto-generates structured development brief",tags:["workflow"]},
    ]},
    {id:"flex",label:"Flexible Packaging",bg:"#FBEAF0",ic:"#993556",icon:Layers,tools:[
      {t:"Laminate structure builder",d:"Build PET/Al/PE structures — auto-calculates GSM, caliper, cost",tags:["edge"]},
      {t:"Roll weight / footage calculator",d:"GSM + width + OD → roll weight, linear meters, impressions",tags:[]},
      {t:"Pouch volume calculator",d:"3-side seal / gusset / standup → fill volume vs nominal",tags:[]},
    ]},
    {id:"rigid",label:"Bottles & Rigid Plastic",bg:"#EEEDFE",ic:"#534AB7",icon:Layers2,tools:[
      {t:"Preform weight calculator",d:"Bottle volume + wall thickness → preform weight in grams",tags:[]},
      {t:"Neck finish selector",d:"PCO 1881/28mm/38mm/48mm — dimensions, closure compatibility",tags:[]},
    ]},
    {id:"cans",label:"Aluminium Cans",bg:"#FAEEDA",ic:"#854F0B",icon:Cpu,tools:[
      {t:"Double seam calculator",d:"Body hook + cover hook + overlap % — full seam parameter validation",tags:["edge"]},
      {t:"Fill volume vs nominal",d:"Can dimensions → actual fill volume vs labelled volume compliance",tags:[]},
    ]},
    {id:"labels",label:"Labels & Decoration",bg:"#E1F5EE",ic:"#0F6E56",icon:Sparkles,tools:[
      {t:"Label area calculator",d:"Bottle dimensions → max label panel area, coverage %, waste allowance",tags:[]},
      {t:"Shrink sleeve lay-flat calculator",d:"Container circumference → lay-flat width, shrink %, distortion zones",tags:["edge"]},
      {t:"Roll label footage calculator",d:"Label size + OD → labels per roll, core size, rewind direction",tags:[]},
    ]},
    {id:"closures",label:"Closures & Dispensers",bg:"#FAECE7",ic:"#993C1D",icon:Sparkles,tools:[
      {t:"Dip tube length calculator",d:"Bottle height + shoulder → correct dip tube length for full dispensing",tags:[]},
    ]},
    {id:"glass",label:"Glass Packaging",bg:"#FBEAF0",ic:"#72243E",icon:Sparkles,tools:[
      {t:"Glass wall thickness calculator",d:"Container dimensions + weight → average wall thickness estimate",tags:["edge"]},
      {t:"Pharmaceutical glass type selector",d:"Product type + sterilisation → Type I/II/III classification (IP/USP)",tags:["edge"]},
      {t:"Headspace / fill level calculator",d:"Bottle geometry + product density → fill level % and ullage",tags:[]},
    ]},
    {id:"foam",label:"Foam & Cushioning",bg:"#F1EFE8",ic:"#5F5E5A",icon:Box,tools:[
      {t:"Cushion curve selector",d:"Product fragility (G) + drop height → EPS/PE foam density guide",tags:["edge"]},
      {t:"EPS thickness calculator",d:"Product weight + fragility factor → minimum EPS panel thickness",tags:["edge"]},
      {t:"Void fill volume estimator",d:"Box dimensions + product dimensions → void fill volume required",tags:[]},
    ]},
    {id:"pharma",label:"Pharma-Specific",bg:"#FCEBEB",ic:"#A32D2D",icon:Cpu,tools:[
      {t:"Blister pack area calculator",d:"Cavity size + count → Al foil & lidding film area per 1000 strips",tags:["edge"]},
      {t:"Alu-Alu vs PVC-Alu selector",d:"Moisture sensitivity + stability → barrier pack recommendation",tags:["edge"]},
    ]},
    {id:"bio",label:"Biobased & Sustainable",bg:"#E1F5EE",ic:"#085041",icon:Sparkles,tools:[
      {t:"Compostability standard checker",d:"Material → EN 13432 / BIS 17088 / ASTM D6400 compliance check",tags:["edge"]},
      {t:"rPET content calculator",d:"Virgin + recycled blend → actual PCR % for EPR reporting",tags:["edge"]},
    ]},
    {id:"metal",label:"Metal Packaging",bg:"#FAEEDA",ic:"#854F0B",icon:Box,tools:[
      {t:"Steel drum UN rating guide",d:"Product hazard class + volume → UN-rated drum type selector",tags:["edge"]},
      {t:"IBC capacity & stacking guide",d:"IBC type + fill density → safe fill volume and pallet stacking layers",tags:[]},
    ]},
    {id:"industrial",label:"Industrial & Bulk",bg:"#F1EFE8",ic:"#444441",icon:Box,tools:[
      {t:"FIBC / big bag SWL calculator",d:"Bag dimensions + fabric GSM → safe working load per UN standards",tags:["edge"]},
      {t:"Pallet pattern optimiser",d:"Box dimensions + pallet size → best layer pattern, boxes per pallet",tags:["edge"]},
      {t:"Pallet load weight calculator",d:"Boxes per pallet + fill weight → gross pallet weight",tags:[]},
      {t:"Drum bung torque guide",d:"Drum type + bung material → application torque for leak-free sealing",tags:[]},
    ]},
    {id:"testing",label:"Testing & QC",bg:"#FCEBEB",ic:"#A32D2D",icon:DbIcon,tools:[
      {t:"Test method selector",d:"Material + application + market → full test battery with pass criteria",tags:["edge"]},
      {t:"Transit test protocol builder",d:"Product weight + fragile flag + route → ISTA 2A/3A protocol selector",tags:[]},
      {t:"Sampling plan calculator (AQL)",d:"Lot size + AQL level → sample size and accept/reject numbers (IS 2500)",tags:[]},
      {t:"Test lab finder (India)",d:"City + test type → NABL-accredited labs with scope and contact details",tags:["edge"]},
    ]},
    {id:"regulatory",label:"Regulatory & Compliance",bg:"#E6F1FB",ic:"#0C447C",icon:DbIcon,tools:[
      {t:"FSSAI packaging rules checker",d:"Food category + material → applicable FSSAI regulations and labelling",tags:["edge"]},
      {t:"BIS standard lookup",d:"Material / product type → applicable BIS standards with latest revision",tags:["edge"]},
      {t:"CPCB EPR registration guide",d:"Producer type + turnover → EPR registration checklist (PWM Rules 2016)",tags:["edge"]},
      {t:"Legal metrology pack size rules",d:"Product category → permissible net quantity values (Legal Metrology Act)",tags:["edge"]},
    ]},
    {id:"knowledge",label:"Knowledge & Reference",bg:"#EAF3DE",ic:"#27500A",icon:DbIcon,tools:[
      {t:"Material property database",d:"Search any material → density, tensile, barrier, thermal, recyclability data",tags:[]},
      {t:"Packaging glossary (1000+ terms)",d:"GSM to EVOH to BCT — searchable with cross-references and units",tags:[]},
      {t:"Packaging process explainer library",d:"Blow moulding, flexo, FFS — illustrated guides for each process",tags:[]},
      {t:"Industry standards index",d:"Searchable IS/ASTM/ISO/EN standards relevant to packaging",tags:[]},
    ]},
    {id:"cross",label:"Cross-Cutting Tools",bg:"#EEEDFE",ic:"#534AB7",icon:Cpu,tools:[
      {t:"Unit converter (packaging)",d:"GSM ↔ lb/MSF, ECT lbf/in ↔ kN/m, micron ↔ gauge ↔ mil",tags:["edge"]},
      {t:"Packaging test standard finder",d:"Material + market → relevant IS/ASTM/ISO/ISTA standards list",tags:["edge"]},
      {t:"QR / barcode size compliance",d:"Barcode type + print method → minimum size per GS1 specs",tags:["edge"]},
    ]},
    {id:"community",label:"Community",bg:"#E1F5EE",ic:"#0F6E56",icon:Sparkles,tools:[
      {t:"Packaging Q&A forum",d:"Ask/answer technical questions — moderated, searchable, tagged by material",tags:[]},
      {t:"Supplier directory (India)",d:"Searchable Indian packaging suppliers by material, location, certifications",tags:["edge"]},
      {t:"Job board (packaging roles)",d:"Packaging technologist / engineer job listings — free to browse",tags:[]},
    ]},
  ],
  2: [
    {id:"corr",label:"Corrugated & Shippers",bg:"#EAF3DE",ic:"#27500A",icon:Box,tools:[
      {t:"Stacking load calculator",d:"Safe stack height, safety factor (2×–4×), storage duration correction",tags:[]},
      {t:"Corrugated cost estimator",d:"Kraft GSM pricing → per-box cost in INR with wastage factor",tags:["edge"]},
    ]},
    {id:"carton",label:"Folding Cartons",bg:"#E6F1FB",ic:"#0C447C",icon:Package,tools:[
      {t:"Carton compression estimator",d:"Top load strength prediction based on board grade and dimension",tags:[]},
      {t:"Crease rule selector",d:"Board caliper → recommended crease depth, matrix, channel width",tags:[]},
      {t:"Print surface compatibility",d:"Board type vs ink/coating/finish compatibility checker",tags:[]},
    ]},
    {id:"flex",label:"Flexible Packaging",bg:"#FBEAF0",ic:"#993556",icon:Layers,tools:[
      {t:"OTR / WVTR estimator",d:"Barrier property prediction for multilayer laminates vs shelf life",tags:[]},
      {t:"Seal strength calculator",d:"Heat seal parameters → burst pressure and peel strength estimate",tags:[]},
      {t:"Retort suitability checker",d:"Structure layers → retort / non-retort / microwave compatibility",tags:[]},
      {t:"Ink coverage estimator",d:"Design coverage % → ink consumption per 1000 impressions + cost",tags:[]},
    ]},
    {id:"rigid",label:"Bottles & Rigid Plastic",bg:"#EEEDFE",ic:"#534AB7",icon:Layers2,tools:[
      {t:"Top load estimator",d:"Wall thickness + resin + bottle geometry → vertical load capacity",tags:[]},
      {t:"CO₂ retention calculator",d:"PET wall thickness → carbonation shelf life for CSD products",tags:[]},
      {t:"Light transmission checker",d:"Clear vs amber vs coloured PET → UV transmission % for product protection",tags:[]},
    ]},
    {id:"cans",label:"Aluminium Cans",bg:"#FAEEDA",ic:"#854F0B",icon:Cpu,tools:[
      {t:"Axial load strength",d:"Wall gauge + alloy → column strength and stacking load rating",tags:[]},
      {t:"Internal pressure rating",d:"Can dimensions + gauge → max internal pressure for carbonated content",tags:[]},
    ]},
    {id:"labels",label:"Labels & Decoration",bg:"#E1F5EE",ic:"#0F6E56",icon:Sparkles,tools:[
      {t:"Label material selector",d:"Application environment → paper vs PP vs PE vs PET recommendation",tags:[]},
      {t:"Adhesive / tack selector",d:"Surface type + temp range → permanent / removable / freezer adhesive",tags:[]},
    ]},
    {id:"closures",label:"Closures & Dispensers",bg:"#FAECE7",ic:"#993C1D",icon:Sparkles,tools:[
      {t:"Dosage / output calculator",d:"Pump stroke volume → doses per bottle, actuation force requirements",tags:["edge"]},
      {t:"Closure torque guide",d:"Neck finish + closure type → application / removal torque range",tags:[]},
    ]},
    {id:"glass",label:"Glass Packaging",bg:"#FBEAF0",ic:"#72243E",icon:Sparkles,tools:[
      {t:"Thermal shock resistance estimator",d:"Fill temp + ambient → shock risk score for soda-lime vs borosilicate",tags:[]},
      {t:"Glass bottle weight optimiser",d:"Current spec vs lightweighted option → grams saved, CO₂ impact, cost delta",tags:[]},
      {t:"Internal pressure rating (glass)",d:"Wall thickness + glass grade → max internal pressure for CSD/beer",tags:[]},
    ]},
    {id:"foam",label:"Foam & Cushioning",bg:"#F1EFE8",ic:"#5F5E5A",icon:Box,tools:[
      {t:"Air pillow vs bubble wrap comparator",d:"Product weight + void volume → material weight, cost, CO₂ comparison",tags:[]},
      {t:"Foam-in-place yield calculator",d:"Foam density + cavity volume → chemical yield, coverage per set",tags:[]},
      {t:"Drop height fragility tester guide",d:"Product category → ISTA/ASTM D5276 test protocol selector",tags:[]},
    ]},
    {id:"pharma",label:"Pharma-Specific",bg:"#FCEBEB",ic:"#A32D2D",icon:Cpu,tools:[
      {t:"Desiccant sizing calculator",d:"Pack volume + WVTR + shelf life → silica gel / mol sieve quantity (g)",tags:[]},
      {t:"Serialisation label area checker",d:"Pack size → area for 2D DataMatrix at required module size",tags:[]},
      {t:"Cold-chain packaging selector",d:"Product temp range + transit duration → VIP/EPS/PCM solution guide",tags:[]},
    ]},
    {id:"bio",label:"Biobased & Sustainable",bg:"#E1F5EE",ic:"#085041",icon:Sparkles,tools:[
      {t:"Carbon footprint calculator",d:"Material type + weight → CO₂ equivalent per 1000 units",tags:[]},
      {t:"Packaging weight reducer",d:"Current spec vs lightweighted option → material saved, cost delta",tags:[]},
      {t:"LCA quick score",d:"Material + process route → simplified life cycle impact vs benchmark",tags:[]},
      {t:"Recyclability checker (India streams)",d:"Packaging structure → recyclable / not in India's waste infrastructure",tags:["edge"]},
    ]},
    {id:"metal",label:"Metal Packaging",bg:"#FAEEDA",ic:"#854F0B",icon:Box,tools:[
      {t:"Aerosol can pressure rating",d:"Can dimensions + propellant type → rated burst pressure, wall stress",tags:[]},
      {t:"Aluminium foil barrier calculator",d:"Foil gauge → OTR/WVTR transmission rates for laminate use",tags:[]},
      {t:"Seam integrity checker (3-piece cans)",d:"Side seam overlap + solder width → leak risk assessment",tags:[]},
    ]},
    {id:"industrial",label:"Industrial & Bulk",bg:"#F1EFE8",ic:"#444441",icon:Box,tools:[
      {t:"Valve bag vent area estimator",d:"Fill rate + product bulk density → required vent area for de-aeration",tags:[]},
      {t:"Stretch wrap tension calculator",d:"Load weight + film gauge → wraps required and film elongation",tags:[]},
    ]},
    {id:"testing",label:"Testing & QC",bg:"#FCEBEB",ic:"#A32D2D",icon:DbIcon,tools:[
      {t:"OOS result decision tree",d:"Failed test + result value → guided: retest, quarantine, or reject",tags:[]},
      {t:"Accelerated shelf life test planner",d:"Real shelf life target + Q10 factor → test temp, duration, checkpoints",tags:[]},
      {t:"Accelerated aging calculator",d:"Q10 model → real shelf life to accelerated test duration converter",tags:[]},
    ]},
    {id:"regulatory",label:"Regulatory & Compliance",bg:"#E6F1FB",ic:"#0C447C",icon:DbIcon,tools:[
      {t:"Import/export packaging compliance",d:"Destination country → EU packaging directive, REACH, FDA requirements",tags:[]},
      {t:"Hazardous goods labelling guide",d:"UN number + class → GHS/UN label requirements for pack and carton",tags:[]},
    ]},
    {id:"workflow",label:"Workflow & Project Tools",bg:"#FAECE7",ic:"#712B13",icon:Sparkles,tools:[
      {t:"New pack development checklist",d:"Product type → stage-gate checklist from brief to approval",tags:[]},
      {t:"Packaging change control form",d:"Guided form documenting pack changes with impact assessment",tags:[]},
      {t:"Packaging trial plan builder",d:"New material + machine → trial parameters, checkpoints, data sheet",tags:[]},
      {t:"Complaint investigation template",d:"Consumer/trade complaint → 8D-style investigation and CAPA template",tags:[]},
    ]},
    {id:"cost",label:"Procurement & Cost",bg:"#FAEEDA",ic:"#633806",icon:Sparkles,tools:[
      {t:"GSM to price estimator (India)",d:"Board/film/foil GSM + width → indicative INR/kg and INR/1000 units",tags:["edge"]},
      {t:"MOQ feasibility checker",d:"Annual volume + supplier MOQ → feasibility, inventory cost, break-even",tags:[]},
      {t:"Import duty calculator (packaging)",d:"HS code + origin → customs duty + GST for packaging imports into India",tags:["edge"]},
    ]},
    {id:"cross",label:"Cross-Cutting Tools",bg:"#EEEDFE",ic:"#534AB7",icon:Cpu,tools:[
      {t:"Moisture equilibrium calculator",d:"Product Aw + ambient RH → packaging WVTR required for shelf life",tags:[]},
    ]},
    {id:"community",label:"Community",bg:"#E1F5EE",ic:"#0F6E56",icon:Sparkles,tools:[
      {t:"Pack spec sharing library",d:"Upload anonymised spec sheets — community reference for common formats",tags:[]},
    ]},
    {id:"knowledge",label:"Knowledge & Reference",bg:"#EAF3DE",ic:"#27500A",icon:DbIcon,tools:[
      {t:"Case study library",d:"Packaging failure + redesign stories — filterable by material, problem type",tags:[]},
    ]},
  ],
  3: [
    {id:"corr",label:"Corrugated & Shippers",bg:"#EAF3DE",ic:"#27500A",icon:Box,tools:[
      {t:"BIS / CPCB compliance check",d:"Check shipper against BIS 1483 & CPCB e-commerce rules",tags:["edge"]},
    ]},
    {id:"carton",label:"Folding Cartons",bg:"#E6F1FB",ic:"#0C447C",icon:Package,tools:[
      {t:"Carton cost estimator (India)",d:"GSM + size + printing → per-carton cost in INR",tags:["edge"]},
    ]},
    {id:"flex",label:"Flexible Packaging",bg:"#FBEAF0",ic:"#993556",icon:Layers,tools:[
      {t:"Recyclability score (EPR/CPCB)",d:"Laminate structure → PCR/recyclability % per EPR / CPCB norms",tags:["edge","reg"]},
    ]},
    {id:"rigid",label:"Bottles & Rigid Plastic",bg:"#EEEDFE",ic:"#534AB7",icon:Layers2,tools:[
      {t:"Drop test estimator",d:"Fill weight + drop height + material → failure probability score",tags:[]},
    ]},
    {id:"cans",label:"Aluminium Cans",bg:"#FAEEDA",ic:"#854F0B",icon:Cpu,tools:[
      {t:"Lacquer compatibility guide",d:"Product pH + formulation → recommended internal lacquer system",tags:[]},
    ]},
    {id:"closures",label:"Closures & Dispensers",bg:"#FAECE7",ic:"#993C1D",icon:Sparkles,tools:[
      {t:"Formulation compatibility checker",d:"Product pH + solvents → pump/closure material compatibility",tags:[]},
    ]},
    {id:"pharma",label:"Pharma-Specific",bg:"#FCEBEB",ic:"#A32D2D",icon:Cpu,tools:[
      {t:"Child-resistant pack compliance",d:"Check against IS 9873 / ISO 8317 for CRC closures and blister designs",tags:["reg"]},
      {t:"IV bag compatibility checker",d:"Drug formulation + contact time → PP vs PVC bag recommendation",tags:[]},
    ]},
    {id:"bio",label:"Biobased & Sustainable",bg:"#E1F5EE",ic:"#085041",icon:Sparkles,tools:[
      {t:"EPR fee estimator (India)",d:"Material type + weight + category → EPR fee under CPCB Rules 2022",tags:["edge","reg"]},
      {t:"Plastic reduction target tracker",d:"Current plastic intensity → delta to CPCB reduction targets by year",tags:["reg"]},
    ]},
    {id:"industrial",label:"Industrial & Bulk",bg:"#F1EFE8",ic:"#444441",icon:Box,tools:[
      {t:"Dangerous goods packaging selector",d:"Hazard class + quantity → UN-approved packaging type (ADR/IATA)",tags:["edge","reg"]},
    ]},
    {id:"testing",label:"Testing & QC",bg:"#FCEBEB",ic:"#A32D2D",icon:DbIcon,tools:[
      {t:"AI test report interpreter",d:"Upload lab report → AI flags OOS results, explains and suggests next steps",tags:["ai"]},
    ]},
    {id:"regulatory",label:"Regulatory & Compliance",bg:"#E6F1FB",ic:"#0C447C",icon:DbIcon,tools:[
      {t:"Regulation summariser (AI)",d:"Paste BIS/FSSAI/CPCB regulation → AI extracts packaging requirements",tags:["ai","reg"]},
    ]},
    {id:"ai",label:"AI-Powered Tools",bg:"#EEEDFE",ic:"#3C3489",icon:Sparkles,tools:[
      {t:"AI packaging brief interpreter",d:"Paste product brief → suggests material, format, barrier, closure, label",tags:["ai"]},
      {t:"Failure mode analyser (AI)",d:"Describe packaging failure → AI diagnoses root cause, corrective actions",tags:["ai"]},
      {t:"Spec sheet auto-writer (AI)",d:"Enter parameters → AI drafts full packaging specification document",tags:["ai"]},
      {t:"Competitor pack reverse-engineer",d:"Upload pack photo → AI identifies likely materials, structure, print process",tags:["ai"]},
    ]},
    {id:"workflow",label:"Workflow & Project",bg:"#FAECE7",ic:"#712B13",icon:Sparkles,tools:[
      {t:"Supplier audit checklist generator",d:"Packaging category → customisable audit checklist with scoring",tags:[]},
      {t:"PDF spec sheet generator",d:"Fill any tool → export branded packaging spec sheet as PDF",tags:[]},
    ]},
    {id:"cost",label:"Procurement & Cost",bg:"#FAEEDA",ic:"#633806",icon:Sparkles,tools:[
      {t:"Packaging material price index",d:"Monthly trend of kraft, PET, aluminium, BOPP, glass prices in India",tags:["edge"]},
      {t:"Total cost of packaging (TCP) calculator",d:"Material + print + convert + freight + waste → full TCP per unit INR",tags:[]},
    ]},
    {id:"cross",label:"Cross-Cutting Tools",bg:"#EEEDFE",ic:"#534AB7",icon:Cpu,tools:[
      {t:"Migration risk screener (food contact)",d:"Packaging material + food type → migration risk (BfR / EU 10/2011)",tags:["edge","reg"]},
      {t:"Packaging BOM cost builder",d:"Multi-component pack → BOM with unit costs, total landed cost/1000 units",tags:[]},
      {t:"Supplier comparison matrix",d:"Enter 3 supplier specs → auto-rank by performance, cost, sustainability",tags:[]},
    ]},
    {id:"community",label:"Community & Platform",bg:"#E1F5EE",ic:"#0F6E56",icon:Sparkles,tools:[
      {t:"Expert consultation booking",d:"Book 30-min paid session with packaging expert for spec review",tags:[]},
    ]},
    {id:"knowledge",label:"Knowledge & Reference",bg:"#EAF3DE",ic:"#27500A",icon:DbIcon,tools:[
      {t:"Packaging innovation tracker",d:"Monthly digest of new materials, processes, sustainability innovations",tags:[]},
    ]},
  ]
};

export default function LaunchPlan() {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalToolId, setModalToolId] = useState<string>('');

  const meta = PHASES_METADATA[activePhase as keyof typeof PHASES_METADATA];
  const sectionGroups = PHASES_DATA[activePhase] || [];

  // Gather categories available for the active phase
  const catSet = new Set<string>();
  catSet.add("All");
  sectionGroups.forEach(sec => catSet.add(sec.label));
  const categoriesList = Array.from(catSet);

  // Filter sections and tools
  const filteredSections = sectionGroups.map(sec => {
    // Category filter check
    if (selectedCat !== "All" && sec.label !== selectedCat) {
      return null;
    }

    // Filter tools inside this section by search query
    const filteredTools = sec.tools.filter(tool => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return tool.t.toLowerCase().includes(q) || tool.d.toLowerCase().includes(q);
    });

    if (filteredTools.length === 0) return null;

    return {
      ...sec,
      tools: filteredTools
    };
  }).filter(Boolean) as SectionGroup[];

  const phaseSizes = {
    1: 51,
    2: 50,
    3: 30
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Statement */}
      <div className="border border-brand-border bg-white rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#7BA05B] uppercase tracking-wider block">LAUNCH STRATEGY ROADMAP</span>
            <h2 className="text-3xl font-bold font-display text-brand-deep">Calyxpack – Your Professional Packaging Toolbox</h2>
            <p className="text-xs text-brand-graphite/60 font-sans max-w-2xl mt-1 leading-relaxed">
              Instantly access 51 free, client‑side calculators covering corrugated, flexible, rigid, and more. No sign‑up required – start solving packaging challenges right away.
            </p>
            <button className="mt-4 px-4 py-2 bg-brand-deep text-white rounded hover:bg-opacity-90 transition" onClick={() => { const el = document.getElementById('tool-grid'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
              Get Started
            </button>
          </div>
          <div className="flex-shrink-0 bg-[#F0F2ED] border border-[#D9DDD5] text-brand-deep px-4 py-3 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#7BA05B] flex-shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-brand-graphite block">ACTIVE PLAN STATE</span>
              <span className="text-xs font-bold font-display">Free Tier Launched</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Level Metric Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#D9DDD5] p-4 rounded-lg text-center">
          <span className="text-2xl font-bold font-display text-brand-deep block">131</span>
          <span className="text-[10px] text-brand-graphite/50 font-mono uppercase tracking-wider block mt-1">Total System MVPs</span>
        </div>
        <div className="bg-[#EAF3DE] border border-brand-sage/20 p-4 rounded-lg text-center relative overflow-hidden">
          <div className="absolute top-1.5 right-1.5 bg-[#7BA05B] text-white text-[8px] font-mono px-1 py-0.5 rounded leading-none uppercase font-bold">LIVE</div>
          <span className="text-2xl font-bold font-display text-[#27500A] block">51</span>
          <span className="text-[10px] text-[#3B6D11]/60 font-mono uppercase tracking-wider block mt-1">Phase 1 (Free)</span>
        </div>
        <div className="bg-white border border-[#D9DDD5] p-4 rounded-lg text-center opacity-80">
          <span className="text-2xl font-bold font-display text-gray-400 block">50</span>
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mt-1">Phase 2 (Pro - Deferred)</span>
        </div>
        <div className="bg-white border border-[#D9DDD5] p-4 rounded-lg text-center opacity-80">
          <span className="text-2xl font-bold font-display text-gray-400 block">30</span>
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider block mt-1">Phase 3 (Premium - Deferred)</span>
        </div>
      </div>

      {/* Tier Switch Selection Tabs */}
      <div className="flex flex-col sm:flex-row bg-[#F2F4F0] border border-brand-border rounded-lg overflow-hidden p-1 shadow-inner gap-1">
        <button
          type="button"
          onClick={() => { setActivePhase(1); setSelectedCat("All"); }}
          className={`flex-1 py-3 px-4 text-center rounded transition-all cursor-pointer ${
            activePhase === 1 
              ? 'bg-white text-brand-deep font-bold shadow-sm border border-brand-border/60' 
              : 'text-brand-graphite/70 hover:text-brand-deep hover:bg-white/40'
          }`}
        >
          <div className="text-xs font-semibold leading-tight flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#7BA05B]" />
            Phase 1 · Free Tier
          </div>
          <div className="text-[9px] font-mono mt-0.5 tracking-wider uppercase opacity-85 text-[#7BA05B] font-bold">51 Tools · Fully Active</div>
        </button>

        <button
          type="button"
          onClick={() => { setActivePhase(2); setSelectedCat("All"); }}
          className={`flex-1 py-3 px-4 text-center rounded transition-all cursor-pointer ${
            activePhase === 2 
              ? 'bg-white text-blue-900 font-bold shadow-sm border border-blue-100' 
              : 'text-brand-graphite/60 hover:text-brand-deep hover:bg-white/40'
          }`}
        >
          <div className="text-xs font-semibold leading-tight flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Phase 2 · Pro Tier
          </div>
          <div className="text-[9px] font-mono mt-0.5 tracking-wider uppercase opacity-85 text-blue-600 font-bold">50 Tools · Deferred / Roadmap</div>
        </button>

        <button
          type="button"
          onClick={() => { setActivePhase(3); setSelectedCat("All"); }}
          className={`flex-1 py-3 px-4 text-center rounded transition-all cursor-pointer ${
            activePhase === 3 
              ? 'bg-white text-amber-900 font-bold shadow-sm border border-amber-100' 
              : 'text-brand-graphite/60 hover:text-brand-deep hover:bg-white/40'
          }`}
        >
          <div className="text-xs font-semibold leading-tight flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Phase 3 · Premium
          </div>
          <div className="text-[9px] font-mono mt-0.5 tracking-wider uppercase opacity-85 text-amber-600 font-bold">30 Tools · Deferred / Roadmap</div>
        </button>
      </div>

      {/* Phase Metadata description card */}
      <div className={`p-5 rounded-lg border leading-relaxed ${
        activePhase === 1 
          ? 'bg-[#EAF3DE]/30 border-brand-sage/20 text-brand-deep' 
          : activePhase === 2 
          ? 'bg-blue-50/20 border-blue-100 text-blue-950' 
          : 'bg-amber-50/20 border-amber-100 text-amber-950'
      }`}>
        <div className="flex items-start gap-4">
          <div className="hidden sm:block p-2 bg-white rounded border border-brand-border flex-shrink-0 mt-0.5 shadow-sm">
            {activePhase === 1 ? (
              <CheckCircle2 className="w-5 h-5 text-[#7BA05B]" />
            ) : (
              <Clock className="w-5 h-5 text-brand-graphite/40" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2.5">
              <h3 className="text-base font-bold font-display">{meta.title}</h3>
              <span className={`text-[9px] font-mono uppercase font-bold border px-2 py-0.5 rounded-full ${meta.badgeColor}`}>
                {meta.badge}
              </span>
              <span className="text-[10px] font-mono text-brand-graphite/60 font-semibold">• Planned: {meta.timeline}</span>
            </div>
            <p className="text-xs text-brand-graphite/75 leading-relaxed font-sans">{meta.sub}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {meta.highlights.map(h => (
                <span key={h} className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#D9DDD5]/60 text-brand-graphite/70 rounded shadow-sm">
                  ✓ {h}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b border-brand-border pb-4">
        
        {/* Category Filters Carousel / row */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto py-1">
          {categoriesList.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                selectedCat === cat 
                  ? 'bg-brand-deep text-white border border-brand-deep shadow-sm' 
                  : 'bg-white border border-[#D9DDD5] text-brand-graphite/75 hover:bg-[#F0F2ED] hover:text-brand-deep'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Local Search input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-brand-graphite/40" />
          <input
            type="text"
            placeholder={`Search ${phaseSizes[activePhase as keyof typeof phaseSizes]} tools in this phase...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 bg-white border border-brand-border rounded font-mono placeholder:font-mono"
          />
        </div>

      </div>

      {/* Target Results Panel */}
      <div className="space-y-8">
        {filteredSections.length > 0 ? (
          filteredSections.map(sec => {
            const IconComponent = sec.icon;
            return (
              <div key={sec.id} className="space-y-3">
                
                {/* Section Header heading */}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center filter saturate-[0.85] shadow-xs"
                    style={{ backgroundColor: sec.bg }}
                  >
                    <IconComponent className="w-4 h-4" style={{ color: sec.ic }} />
                  </div>
                  <h4 className="text-sm font-bold font-display text-brand-deep">{sec.label}</h4>
                  <span className="text-[10px] font-mono bg-[#F0F2ED] border border-[#D9DDD5] px-2 py-0.5 rounded text-brand-graphite/60 font-semibold ml-1.5">
                    {sec.tools.length} {sec.tools.length === 1 ? 'tool' : 'tools'}
                  </span>
                </div>

                {/* Sub Tools Grid cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {sec.tools.map(tool => (
                    <div 
                      key={tool.t} 
                      data-tool-id={(() => {
                        const found = Object.entries(PACKAGING_TOOLS).find(([, v]) => v.title === tool.t);
                        return found ? found[0] : '';
                      })()}
                      className="bg-white border border-[#D9DDD5]/70 rounded-lg p-3.5 flex flex-col justify-between hover:border-brand-sage/55 transition shadow-xs group cursor-pointer"
                      onClick={() => {
                        const found = Object.entries(PACKAGING_TOOLS).find(([, v]) => v.title === tool.t);
                        if (found) setModalToolId(found[0]);
                        setModalOpen(true);
                      }}
                    >
                      <div>
                        <h5 className="text-xs font-bold text-brand-deep leading-tight group-hover:text-[#43673F] transition font-sans">
                          {tool.t}
                        </h5>
                        <p className="text-[11px] text-brand-graphite/60 mt-1.5 leading-relaxed font-sans">
                          {tool.d}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        {tool.tags.includes("edge") && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 font-bold uppercase tracking-wider rounded bg-brand-sage/12 text-[#234734] border border-brand-sage/15">
                            YOUR EDGE
                          </span>
                        )}
                        {tool.tags.includes("ai") && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 font-bold uppercase tracking-wider rounded bg-purple-50 text-purple-700 border border-purple-100">
                            AI-POWERED
                          </span>
                        )}
                        {tool.tags.includes("reg") && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 font-bold uppercase tracking-wider rounded bg-rose-50 text-rose-700 border border-rose-100">
                            REGULATORY
                          </span>
                        )}
                        {tool.tags.includes("workflow") && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 font-bold uppercase tracking-wider rounded bg-blue-50 text-blue-700 border border-blue-100">
                            WORKFLOW
                          </span>
                        )}
                        <span className={`text-[8px] font-mono ml-auto font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          activePhase === 1 
                            ? 'bg-brand-sage/5 text-[#7BA05B]' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {activePhase === 1 ? "FREE" : "DEFERRED"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="h-[1px] bg-[#D9DDD5]/30 pt-2" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 border border-dashed border-brand-border rounded-lg bg-white">
            <Info className="w-8 h-8 text-brand-graphite/30 mx-auto" />
            <h5 className="text-sm font-semibold text-brand-deep mt-2">No matching solvers found</h5>
            <p className="text-xs text-brand-graphite/50 mt-1 max-w-sm mx-auto">
              Refine your category toggle or type check values above as there are no items matching "{searchQuery}" inside Phase {activePhase}.
            </p>
          </div>
        )}
      </div>
          {/* Dynamic Calculator Modal */}
          <Suspense fallback={<div className="fixed inset-0 bg-white/80 flex items-center justify-center">Loading...</div>}>
            <LazyDynamicCalculatorModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              initialToolId={modalToolId}
            />
          </Suspense>

    </div>
  );
}
