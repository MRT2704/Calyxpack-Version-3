import React, { useState } from 'react';
import { StandardsRef } from '../types';
import { 
  Search, 
  FileText, 
  ChevronRight, 
  Filter, 
  Download,
  ShieldCheck,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const STANDARDS_DATA: StandardsRef[] = [
  // Corrugated Standards
  {
    id: 'is-2771',
    code: 'IS 2771 (Part 1)',
    title: 'Indian Standard - Corrugated Fiberboard Boxes Specification (Part 1)',
    org: 'BIS',
    category: 'Corrugated',
    summary: 'Specifies requirements for single-walled and double-walled corrugated fiberboard boxes for packaging of general materials.',
    parameters: 'Bursting Strength (Min 10-24 kg/cm²), Cobb Value (Max 110 g/m² in 30min), Substance weight tolerance +/- 5%'
  },
  {
    id: 'astm-d642',
    code: 'ASTM D642',
    title: 'Standard Test Method for Determining Compressive Resistance of Shipping Containers',
    org: 'ASTM',
    category: 'Corrugated',
    summary: 'Determines the ability of box shippers to withstand compressive forces, simulating mechanical stack distributions.',
    parameters: 'Compression Velocity: 13 +/- 3 mm per minute, continuous recording of load-deflection values, mandatory conditioning at 23°C / 50% RH'
  },
  {
    id: 'fefco-no9',
    code: 'FEFCO No. 9',
    title: 'Determination of the Edgewise Crush Resistance of Corrugated Fiberboard',
    org: 'FEFCO',
    category: 'Corrugated',
    summary: 'Describes parameters to perform Edgewise Crush Test (ECT) on a fluted board section with vertical flute configurations.',
    parameters: 'Sample dimension 100 x 25 mm, rigid plate type testing apparatus, ECT expressed in kN/m'
  },
  
  // Plastics / Flexible Standards
  {
    id: 'astm-f1249',
    code: 'ASTM F1249',
    title: 'Water Vapor Transmission Rate (WVTR) Through Plastic Film Using a Modulated Infrared Sensor',
    org: 'ASTM',
    category: 'Flexible',
    summary: 'Primary international standard to measure moisture barrier properties of single or multi-layer functional flexible substrates.',
    parameters: 'Expressed as g/m²/day, testing variables set at 37.8°C / 90% RH'
  },
  {
    id: 'astm-d3985',
    code: 'ASTM D3985',
    title: 'Oxygen Gas Transmission Rate (OTR) Using a Coulometric Sensor',
    org: 'ASTM',
    category: 'Flexible',
    summary: 'Core methodology to establish oxygen transmission metrics of plastic sheets, films, laminates and co-extrusions.',
    parameters: 'Expressed as cc/m²/day/atm, measured at 23°C in dry nitrogen environment'
  },
  {
    id: 'is-15410',
    code: 'IS 15410',
    title: 'Plastic Drinking Water Bottles (Rigid PET Container Guidelines)',
    org: 'BIS',
    category: 'Rigid',
    summary: 'Prescribes quality expectations, environmental limits, and material restrictions for rigid polyethylene terephthalate water containers.',
    parameters: 'Overall migration limits &lt; 60 mg/kg, acetaldehyde extraction &lt; 1.0 ppm, drop vertical height test合格'
  },

  // Metal Standards
  {
    id: 'is-13954',
    code: 'IS 13954',
    title: 'Double Cold-Reduced Tinplate Can Specifications',
    org: 'BIS',
    category: 'Metal',
    summary: 'Specifies physical quality and dimensional tolerance levels for double-reduced tin containers designed for edible oil and food processing.',
    parameters: 'Temper designation T-57, coating thickness testing per IS 12591, double seam tightness target &gt; 75%'
  },
  
  // Sustainability Standards
  {
    id: 'cpcb-epr-2022',
    code: 'CPCB EPR Rules',
    title: 'Extended Producer Responsibility (EPR) Guidelines for Plastic Waste Management',
    org: 'CPCB',
    category: 'Sustainability',
    summary: 'EPR guidelines regulating the target collection, reuse, recycling, and thickness levels of single-use and flexible rigid plastics in India.',
    parameters: 'Minimum thickness of single-use carriers 120 microns, recycling target levels up to 70%, categorizes materials from Category I to IV'
  }
];

export default function Database() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [selectedOrg, setSelectedOrg] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<StandardsRef>(STANDARDS_DATA[0]);

  // Filters
  const filteredStandards = STANDARDS_DATA.filter((std) => {
    const matchesSearch = 
      std.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      std.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCat === 'All' || std.category === selectedCat;
    const matchesOrg = selectedOrg === 'All' || std.org === selectedOrg;

    return matchesSearch && matchesCat && matchesOrg;
  });

  const categories = ['All', 'Corrugated', 'Flexible', 'Rigid', 'Metal', 'Sustainability'];
  const orgs = ['All', 'ASTM', 'BIS', 'FEFCO', 'CPCB'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
      
      {/* Search & Filter Left Sidebar - 7 columns */}
      <div className="lg:col-span-7 flex flex-col gap-4 bg-white border border-brand-border rounded-xl p-5 shadow-tech">
        
        {/* Title and Search Control */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-brand-border pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-brand-deep tracking-wider uppercase">Reference Hub</span>
            <h3 className="text-xl font-semibold font-display text-brand-deep">Packaging Technical database</h3>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-brand-graphite/40" />
            <input 
              type="text" 
              placeholder="Search IS, ASTM, Cobb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-mono border border-brand-border rounded-lg pl-9 pr-3 py-2.5 bg-brand-bg/60 placeholder:text-brand-graphite/45"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-brand-graphite/40 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Domain:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded transition ${
                  selectedCat === cat 
                    ? 'bg-brand-deep text-white shadow-sm' 
                    : 'bg-brand-bg text-brand-graphite/70 border border-brand-border hover:bg-brand-border/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Org Badges */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-brand-graphite/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Bodies:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {orgs.map((org) => (
              <button
                key={org}
                type="button"
                onClick={() => setSelectedOrg(org)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded transition ${
                  selectedOrg === org 
                    ? 'bg-brand-sage text-white shadow-sm font-bold' 
                    : 'bg-brand-bg text-brand-graphite/70 border border-brand-border hover:bg-brand-border/40'
                }`}
              >
                {org}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Index Table */}
        <div className="border border-brand-border rounded-lg overflow-hidden flex-grow min-h-[300px]">
          <div className="grid grid-cols-12 bg-brand-bg/85 border-b border-brand-border px-3.5 py-2 text-[10px] font-mono font-bold text-brand-graphite/60">
            <div className="col-span-3">SPECIFICATION CODE</div>
            <div className="col-span-6">OFFICIAL DESCRIPTIVE TITLE</div>
            <div className="col-span-3 text-right">DOMAIN</div>
          </div>

          <div className="divide-y divide-brand-border max-h-[360px] overflow-y-auto">
            {filteredStandards.length > 0 ? (
              filteredStandards.map((std) => (
                <button
                  key={std.id}
                  type="button"
                  onClick={() => setSelectedItem(std)}
                  className={`w-full text-left grid grid-cols-12 px-3.5 py-3 text-xs font-medium transition cursor-pointer ${
                    selectedItem.id === std.id 
                      ? 'bg-brand-sage/10 border-l-3 border-brand-deep' 
                      : 'hover:bg-brand-bg/50 border-l-3 border-transparent'
                  }`}
                >
                  <div className="col-span-3 font-mono font-bold text-brand-deep flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-brand-deep/50 flex-shrink-0" />
                    <span>{std.code}</span>
                  </div>
                  
                  <div className="col-span-6 pr-4 truncate text-brand-graphite">
                    {std.title}
                  </div>

                  <div className="col-span-3 text-right text-[10px] font-mono font-semibold text-brand-graphite/60">
                    {std.category}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-brand-graphite/40 font-mono">
                No matching industrial standards found. Adjust filtering parameters.
              </div>
            )}
          </div>
        </div>

        <div className="text-[11px] font-mono text-brand-graphite/50 flex items-center gap-1.5 mt-1">
          <span>Database synchronises monthly with ASTM, Bureau of Indian Standards (BIS), and Fefco parameters.</span>
        </div>
      </div>

      {/* Structured Info Card on the Right - 5 columns */}
      <div className="lg:col-span-5 bg-brand-bg border border-brand-border rounded-xl p-6 shadow-tech flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start border-b border-brand-border pb-4 mb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-tech-blue uppercase tracking-widest bg-tech-blue/10 px-2 py-0.5 rounded">
                Validated Reference Code
              </span>
              <h4 className="text-xl font-display font-black text-brand-deep tracking-tight mt-1">
                {selectedItem.code}
              </h4>
            </div>

            <div className="font-mono text-xs bg-[#2B2B2B] text-white px-2.5 py-1 rounded font-bold">
              {selectedItem.org}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-brand-graphite/50 block">Descriptive Scope</span>
              <p className="text-xs text-brand-graphite/85 mt-1 leading-relaxed">
                {selectedItem.title}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-brand-graphite/50 block">Technical Overview</span>
              <p className="text-xs text-brand-graphite/75 mt-1 leading-relaxed">
                {selectedItem.summary}
              </p>
            </div>

            <div className="bg-white border border-brand-border rounded p-4">
              <span className="text-[10px] font-mono uppercase font-bold text-brand-deep block flex items-center gap-1.5 border-b border-brand-border pb-1 mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-brand-deep" />
                SOP Key Testing parameters
              </span>
              <div className="text-xs font-mono text-brand-graphite/90 leading-relaxed font-semibold">
                {selectedItem.parameters}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="flex-grow bg-brand-deep hover:bg-brand-deep/90 text-white font-medium text-xs py-2 px-3 rounded-md flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
            onClick={() => alert(`Standard ASTM/BIS ${selectedItem.code} parameter details mapped successfully.`)}
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF Spec Summary
          </button>
          
          <a
            href="https://www.bis.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="border border-brand-border bg-white text-brand-graphite hover:bg-brand-bg transition font-semibold text-xs py-2 px-3 rounded-md flex items-center justify-center gap-1"
          >
            Official Website
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>

    </div>
  );
}
