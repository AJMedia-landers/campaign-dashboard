export type Trend = number[];

export type SummaryStat = {
  label: string;
  value: number;
  changePct: number;
  trend: Trend;
  format: "currency" | "number" | "decimal";
};

export type ClientRow = {
  account_name: string;
  total_spent: number;
  total_conversions: number;
  cpa: number | null;
};

export type HeadlineRow = {
  rank: number;
  headline: string;
  spent: number;
  conversions: number;
  cpa: number | null;
};

export type CreativeRow = {
  rank: number;
  image: string;
  account_name: string;
  spent: number;
  conversions: number;
  cpa: number | null;
};

export const summary: SummaryStat[] = [
  {
    label: "Spent",
    value: 478178.54,
    changePct: -22.3,
    format: "currency",
    trend: [520, 495, 510, 460, 440, 470, 455, 430, 410, 395, 380, 400, 385, 370],
  },
  {
    label: "Conversions",
    value: 5806,
    changePct: -30.1,
    format: "number",
    trend: [8200, 7900, 7400, 7100, 6800, 6500, 6400, 6200, 6000, 5900, 5850, 5800, 5820, 5806],
  },
  {
    label: "CPA",
    value: 82.36,
    changePct: -11.1,
    format: "decimal",
    trend: [92, 91, 90, 89, 88, 87, 86, 86, 85, 84, 84, 83, 82.5, 82.36],
  },
];

export const lastSync = "3 Apr 2026, 21:39:00";

export const clientResults: ClientRow[] = [
  { account_name: "AJ Media - Reading Glasses - SC", total_spent: 137175.16, total_conversions: 1680, cpa: 81.65 },
  { account_name: "AJ Media - Reading Glasses - UK1 - SC", total_spent: 100985.8, total_conversions: 1287, cpa: 78.47 },
  { account_name: "AJ Media - Scratch Remover - US - SC", total_spent: 66891.76, total_conversions: 891, cpa: 75.07 },
  { account_name: "AJ Media - Torque Ball - US - SC", total_spent: 65919.38, total_conversions: 724, cpa: 91.05 },
  { account_name: "AJ Media - New Launches - SC", total_spent: 34260.93, total_conversions: 377, cpa: 90.88 },
  { account_name: "AJ Media - Anniversary Cap - SC", total_spent: 20144.69, total_conversions: 240, cpa: 83.94 },
  { account_name: "AJ Media - Reading Glasses US", total_spent: 16782.24, total_conversions: 215, cpa: 78.06 },
  { account_name: "AJ Media - Reading Glasses - SC (alt)", total_spent: 15710.6, total_conversions: 198, cpa: 79.35 },
  { account_name: "AJ Media - Torque Ball - UK - SC", total_spent: 8230.42, total_conversions: 97, cpa: 84.85 },
];

export const headlines: HeadlineRow[] = [
  { rank: 1, headline: "Pensioners Are Ditching £400 Optical Specs for These £29 German-Engineered Frames", spent: 97466.06, conversions: 1264, cpa: 77.11 },
  { rank: 2, headline: "Retirees Are Ditching $600 Optical Eyewear for These $39 German-Engineered Glasses", spent: 67321.76, conversions: 806, cpa: 83.53 },
  { rank: 3, headline: "Retirees Are Switching $600 Optical Eyewear for These $39 German-Engineered Glasses", spent: 53913.99, conversions: 662, cpa: 81.44 },
  { rank: 4, headline: 'Assisted Living Accelerates "The Decline." What This Son Did Instead', spent: 34859.84, conversions: 583, cpa: 91.83 },
  { rank: 5, headline: "#1 Car Scratch Tool Easily Erases Any Scratches and Dents Instantly", spent: 39233.2, conversions: 517, cpa: 75.89 },
  { rank: 6, headline: "This Scratch Remover Makes Your Car Look Brand New", spent: 31066.63, conversions: 395, cpa: 78.65 },
  { rank: 7, headline: "Smart Reading Glasses: Auto-Focus & Zoom for Clear Vision, Near and Far", spent: 25501.9, conversions: 337, cpa: 75.67 },
  { rank: 41, headline: "Eternal Is Not From Salty Food: Meet The Real Enemy Of Swollen Legs", spent: 291.75, conversions: 2, cpa: 145.88 },
  { rank: 42, headline: "Most Americans Accept Memory Loss as Inevitable. Japan Has Known Better for Decades", spent: 180.76, conversions: 0, cpa: null },
  { rank: 43, headline: "Your Car Looked This Good When You First Bought It — Now It Can Again", spent: 178.14, conversions: 4, cpa: 44.54 },
  { rank: 44, headline: "After 35 years, Doctors Are Sharing Japan's #1 Secret For Memory Loss", spent: 174.46, conversions: 2, cpa: 87.23 },
  { rank: 45, headline: 'Body Shops Are Furious Over This New $29 "Micro-Filling" Trick', spent: 138.26, conversions: 1, cpa: 138.26 },
  { rank: 46, headline: '2 Million Units Sold: Why This Small Tube Is "Terrifying" Car Repair Shops', spent: 108.89, conversions: 0, cpa: null },
  { rank: 47, headline: "Retirees Who Tried These $39 German-Engineered Glasses Are Never Going Back", spent: 105.58, conversions: 1, cpa: 105.58 },
  { rank: 48, headline: "Stop Doing Crosswords: Japan Exposes Memory Loss's Real Weakness", spent: 103.6, conversions: 0, cpa: null },
  { rank: 49, headline: "The $39 Optical Breakthrough Every American Over 50 Should Know", spent: 65.39, conversions: 0, cpa: null },
  { rank: 50, headline: "Stop Paying $500+ For Scratch Repairs (Do This Instead)", spent: 61.09, conversions: 0, cpa: null },
];

export const creatives: CreativeRow[] = [
  { rank: 1, image: "https://placehold.co/72x72/BF8E71/FFFFFF?text=RG", account_name: "AJ Media - Reading Glasses US", spent: 24814.85, conversions: 312, cpa: 79.53 },
  { rank: 2, image: "https://placehold.co/72x72/6E4E3B/FFFFFF?text=RG", account_name: "AJ Media - Reading Glasses US", spent: 21117.41, conversions: 264, cpa: 79.99 },
  { rank: 3, image: "https://placehold.co/72x72/9F6E51/FFFFFF?text=TB", account_name: "AJ Media - Torque Ball - US - SC", spent: 20318.54, conversions: 253, cpa: 80.31 },
  { rank: 4, image: "https://placehold.co/72x72/D9AD91/FFFFFF?text=RG", account_name: "AJ Media - Reading Glasses - SC", spent: 18760.6, conversions: 255, cpa: 73.57 },
];

export const platformOptions = ["All", "Facebook", "Google", "TikTok", "Taboola"];
export const accountOptions = ["All Accounts", "AJ Media - Reading Glasses", "AJ Media - Scratch Remover", "AJ Media - Torque Ball"];
export const defaultDateRange = "14 Mar 2026 - 12 Apr 2026";
