import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FloatingSearch from './components/FloatingSearch';
import Categories from './components/Categories';
import LaminateCenterpiece from './components/LaminateCenterpiece';
import Calculators from './components/Calculators';
import Database from './components/Database';
import Articles from './components/Articles';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import LaunchPlan from './components/LaunchPlan';
import { GoldenCircle, ValueProps, AccessTiers, FinalCTA } from './components/HomeExtensions';
import { 
  ShieldAlert, 
  Layers, 
  Compass, 
  HelpCircle,
  FileText,
  Workflow
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [selectedCalcId, setSelectedCalcId] = useState<string | undefined>(undefined);

  // Mappings to jump straight to relevant calculator panel
  const handleSelectCalculatorTarget = (calcId: string) => {
    setSelectedCalcId(calcId);
    setActiveTab('calculators');
    // Scroll smoothly to top of workspace content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearchResult = (tab: string, calcId?: string) => {
    setActiveTab(tab);
    if (calcId) {
      setSelectedCalcId(calcId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-brand-sage/30 selection:text-brand-deep">
      
      {/* Search Command overlay */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onSelectResult={handleGlobalSearchResult}
      />

      <div>
        {/* Sticky Header Navigation */}
        <Header 
          activeTab={activeTab} 
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setSelectedCalcId(undefined); // clear on general tab click
          }}
          onSearchRequest={() => setSearchOpen(true)}
        />

        {/* Global Hub Warning strip for regulatory updates */}
        <div className="bg-brand-deep text-brand-border/90 px-4 py-2 text-center text-[11px] font-mono select-none flex items-center justify-center gap-1.5 border-b border-brand-border/10">
          <ShieldAlert className="w-3.5 h-3.5 text-brand-sage flex-shrink-0 animate-pulse" />
          <span>ALERT: New Extended Producer Responsibility (EPR) recycling targets active. Verify layer thickness indexes now.</span>
        </div>

        {/* Main Workspace Frame container */}
        <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          
          {/* TAB 1: INDEX FEED (HOMEPAGE) */}
          {activeTab === 'home' && (
            <div className="space-y-16 md:space-y-24">
              
              {/* SECTION 1: HERO */}
              <Hero 
                onExploreTools={() => handleSelectCalculatorTarget('bct')}
                onBrowseMaterials={() => handleGlobalSearchResult('database')}
              />

              {/* INTELLIGENT FLOATING SEARCH BAR */}
              <FloatingSearch onSelectResult={handleGlobalSearchResult} />

              {/* SECTION 2: WHY / HOW / WHAT (Golden Circle Framework) */}
              <GoldenCircle />

              {/* SECTION 3: KEY CATEGORIES OF TOOLS */}
              <Categories onSelectCalc={handleSelectCalculatorTarget} />

              {/* THE SIGNATURE WOW MODULE */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-brand-border/60 flex-1"></div>
                  <span className="text-[10px] font-mono text-[#234734] bg-[#7BA05B]/15 border border-[#7BA05B]/30 px-3 py-1 rounded uppercase font-bold tracking-widest">
                    Interactive R&D Showcase
                  </span>
                  <div className="h-px bg-brand-border/60 flex-1"></div>
                </div>
                <LaminateCenterpiece />
              </div>

              {/* SECTION 4: VALUE PROPOSITION FOR PACKAGING PROFESSIONALS */}
              <ValueProps />

              {/* SECTION 5: FREE, PRO, AND PREMIUM ACCESS OVERVIEW */}
              <AccessTiers 
                onExploreTools={() => handleSelectCalculatorTarget('bct')}
                onSelectTab={handleGlobalSearchResult}
              />

              {/* SECTION 6: FINAL CALL TO ACTION */}
              <FinalCTA onExploreTools={() => handleSelectCalculatorTarget('bct')} />

              {/* NEWSLETTER SIGNUP */}
              <Newsletter />

            </div>
          )}

          {/* TAB 2: SOLVERS (CALCULATORS WORKSPACE) */}
          {activeTab === 'calculators' && (
            <div className="space-y-6">
              <Calculators 
                activeCalcId={selectedCalcId} 
                onSwitchTab={(tab) => setActiveTab(tab)}
              />
            </div>
          )}

          {/* TAB 3: TECHNICAL DATABASE */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <Database />
            </div>
          )}

          {/* TAB 4: RESEARCH JOURNALS */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              <Articles />
            </div>
          )}

          {/* TAB 5: LAUNCH PLAN ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <LaunchPlan />
            </div>
          )}

        </main>
      </div>

      {/* FOOTER */}
      <Footer onSwitchTab={handleGlobalSearchResult} />

    </div>
  );
}
