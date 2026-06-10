import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft,
  Share2,
  Tag,
  Bookmark
} from 'lucide-react';

const JOURNAL_ARTICLES: NewsArticle[] = [
  {
    id: 'corru-collapse-physics',
    title: 'Anatomy of Corrugated Shipper Box Collapses: Moisture and Creep Physics',
    category: 'Failure Analysis',
    author: 'K. Sridhar, Packaging Lead Developer',
    date: 'May 14, 2026',
    readTime: '8 min read',
    summary: 'A critical breakdown of how relative humidity (RH) above 65% triggers spontaneous fiber slip and creep failure in shipping boxes, and McKee formula correction algorithms.',
    tags: ['Corrugated', 'Failure Analysis', 'McKee', 'SOP'],
    content: [
      'Corrugated shipping boxes undergo rapid structural strength degradation when relative humidity (RH) indexes raise inside freight containers. In India, warehouse environments during monsoons regularly hover between 80% to 95% RH. This article addresses the physics of creep failure in paperboard materials.',
      'Under static loads, paper fibers experience stress relaxation. Cellulose molecules are hydrophilic; moisture acts as a plasticizer inside the fiber matrix, softening the amorphous regions of the cellulose skeleton. This introduces micro-slips along the corrugated medium peaks (the flutes), weakening the flat crush support indices.',
      'According to industrial studies, a shipper box stored at 90% RH retains only about 35% of its nominal dry compression test (BCT) capacity. Using a safety factor calculation of 3x is standard, but failure will still occur if creep rates exceed structural stability limits.',
      'Engineering countermeasures include designing with water-resistant starches (wet-strength additives), substituting standard virgin flutes with semi-synthetic medium lines, or switching from C-flute to higher density BC double-wall boards to optimize critical vertical buckling radii.'
    ]
  },
  {
    id: 'retort-sealing-failures',
    title: 'Retort Pouches: Combating Channel Leaking and Micro-Pinholes in Foil Laminates',
    category: 'Flexible Packaging',
    author: 'Dr. Anita Roy, Materials Scientist',
    date: 'April 28, 2026',
    readTime: '12 min read',
    summary: 'An investigative study on troubleshooting seal channel leakage and thermal stress pinholing in aluminium-alloy flexible pouches during autoclave processing (121°C).',
    tags: ['Autoclave', 'Rigid Barrier', 'Aluminium Foil', 'Leakage'],
    content: [
      'Flexible retort pouches represent a highly efficient alternative to rigid metal cans. However, subjecting 4-layer laminates (typically PET/Alu/Nylon/RCPP) to thermal sterilization variables (118°C - 121°C) introduces significant physical pressures.',
      'A primary source of retort failure is channel leaks. These occur when tiny food particle residues or fats contaminate the seal interface area during automated pouch filling. During subsequent autoclave heating, moisture trapped in these residues vaporizes, forming pressurized channels through which anaerobic bacteria can enter.',
      'Another critical degradation mechanism is foil cracking (flex cracking). While aluminium foil (typically 7-9 microns) acts as an absolute barrier to moisture and oxygen, Nylon (BOPA) layers are included as a buffer. Under thermal cycles, material tension mismatch causes micro-pinholing in the metal matrix.',
      'Quality assurance requires implementing helium leak trace systems and validating seal strength values (minimum 40N/15mm width per Indian Standards). Switching from classic inline bar heat sealers to ultrasonic seal configurations completely clears contaminants from seal nodes prior to thermal fusion.'
    ]
  },
  {
    id: 'double-seam-trouble',
    title: 'Double Seaming Diagnostics: Troubleshooting False Seams and Droops',
    category: 'Metal Containers',
    author: 'Marcus Vance, Chief Engineering Auditor',
    date: 'March 18, 2026',
    readTime: '10 min read',
    summary: 'Diagnostics SOP for metal closures. Identifying body droops, fractured seam layers, and chuck slippage using computerized section analyzers.',
    tags: ['Double Seam', 'Steel', 'Canning', 'SOP'],
    content: [
      'Metal cans rely exclusively on the physical engagement of the tinplate flanges to establish a hermetic seal. The double seaming process occurs in two phases: first-operation curling, and second-operation compacting.',
      'A false seam occurs when the body hook and cover hook fail to interlock, turning under instead of overlapping. This failure is particularly dangerous because from a pure visual inspection the can looks normal, meaning leakages only express during transit.',
      'Droops usually form at the seam crossover node, where the side seam seam lines meet the end double seam. Excess metal gathers, creating a downward loop. Droops are diagnosed using computerized double seam section projectors which measure overlap lengths at 0.01mm scaling.',
      'Resolving seaming deficits requires maintaining seaming chuck alignments, ensuring lift-pressure calibration (minimum 40 kgf for carbonated products), and replacing worn-out seaming rolls whose groove profiles have deviated from theoretical CAD configurations.'
    ]
  }
];

export default function Articles() {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = JOURNAL_ARTICLES.find(art => art.id === selectedArticleId);

  if (selectedArticle) {
    return (
      <div className="bg-white border border-brand-border rounded-xl p-6 md:p-8 shadow-tech max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => setSelectedArticleId(null)}
          className="flex items-center gap-1.5 text-xs text-brand-sage hover:text-brand-deep font-bold uppercase tracking-wider mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Articles Journal
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] uppercase tracking-wider font-mono bg-brand-deep/5 text-brand-deep font-bold px-2 py-0.5 rounded">
            {selectedArticle.category}
          </span>
          <span className="text-xs text-brand-graphite/40">•</span>
          <span className="text-xs font-mono text-brand-graphite/50 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {selectedArticle.readTime}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-display font-medium text-brand-deep tracking-tight mb-4">
          {selectedArticle.title}
        </h3>

        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-brand-border py-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-sage/20 rounded-full flex items-center justify-center text-brand-deep font-semibold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold block text-brand-deep">{selectedArticle.author}</span>
              <span className="text-[10px] font-mono text-brand-graphite/50 block flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {selectedArticle.date}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => alert('Article link copied to clipboard.')}
              className="p-1.5 border border-brand-border rounded hover:bg-brand-bg text-brand-graphite/70"
              title="Share Article"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={() => alert('Article added to technical reading bookmarks.')}
              className="p-1.5 border border-brand-border rounded hover:bg-brand-bg text-brand-graphite/70"
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 text-sm text-brand-graphite/85 leading-relaxed font-sans">
          <p className="font-semibold text-brand-deep text-base italic border-l-3 border-brand-sage pl-4 font-display">
            {selectedArticle.summary}
          </p>

          {selectedArticle.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-brand-border flex flex-wrap gap-2">
          {selectedArticle.tags.map(tag => (
            <span key={tag} className="text-xs font-mono bg-brand-bg text-brand-graphite/70 border border-brand-border rounded-full px-3 py-1 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-brand-border pb-4 mb-8">
        <span className="text-xs font-mono text-tech-blue font-semibold uppercase tracking-wider">Packaging Journals</span>
        <h3 className="text-2xl font-semibold font-display text-brand-deep mt-1">Research & Technical papers</h3>
        <p className="text-sm text-brand-graphite/70 mt-1">
          Explore diagnostics, failed packaging analyses, substrate physical reports, and materials engineering papers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {JOURNAL_ARTICLES.map((article) => (
          <div 
            key={article.id} 
            className="bg-white border border-brand-border rounded-xl overflow-hidden shadow-tech shadow-tech-hover flex flex-col justify-between"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-wider">
                <span className="text-brand-deep font-bold bg-brand-sage/15 rounded px-2 py-0.5">
                  {article.category}
                </span>
                <span className="text-brand-graphite/50 block flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              <h4 className="text-lg font-display font-semibold text-brand-deep leading-snug tracking-tight hover:text-brand-sage transition mb-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedArticleId(article.id)}
                  className="text-left cursor-pointer"
                >
                  {article.title}
                </button>
              </h4>

              <p className="text-xs text-brand-graphite/75 leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="bg-brand-bg px-5 py-3 border-t border-brand-border flex items-center justify-between">
              <span className="text-[10px] font-mono text-brand-graphite/50">
                {article.date}
              </span>
              <button
                type="button"
                onClick={() => setSelectedArticleId(article.id)}
                className="text-[11px] font-bold text-brand-deep hover:text-brand-sage flex items-center gap-1 uppercase tracking-wider"
              >
                Read Article
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
