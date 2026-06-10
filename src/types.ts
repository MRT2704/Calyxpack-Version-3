/**
 * Core type declarations for CALYXPACK.IN
 * Engineering Intelligence for Packaging Professionals
 */

export interface PackagingCalculator {
  id: string;
  name: string;
  category: 'corrugated' | 'metal' | 'flexible' | 'rigid' | 'general';
  tag: string;
  shortDesc: string;
  iconName: string;
  tier: 'Free' | 'Pro' | 'Premium';
}

export interface StandardsRef {
  id: string;
  code: string;
  title: string;
  org: 'ASTM' | 'BIS' | 'FEFCO' | 'ECMA' | 'CPCB' | 'ISO';
  category: 'Corrugated' | 'Flexible' | 'Rigid' | 'Metal' | 'Testing' | 'Sustainability';
  summary: string;
  parameters: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  summary: string;
  content: string[];
  tags: string[];
}

export interface MaterialProperties {
  name: string;
  densityGcm3: number;
  typicalYieldM2Kg: number;
  tensileStrengthMpa: string;
  barrierO2: string; // OTR description
  barrierH2O: string; // WVTR description
  sustainableNotes: string;
}
