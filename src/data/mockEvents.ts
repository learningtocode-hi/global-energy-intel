export type ImpactLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type DirectionalImpact = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'UNKNOWN';

export interface IntelligenceEvent {
  id: string;
  title: string;
  coordinates: [number, number]; // [lng, lat] for mapbox
  summary: string;
  impactLevel: ImpactLevel;
  directionalImpact: DirectionalImpact;
  affectedAssets: string[];
  confidenceScore: number;
  reasoningChain: string;
  sources: string[];
  timestamp: string;
  assetType: 'REFINERY' | 'PIPELINE' | 'TERMINAL' | 'GEOPOLITICAL' | 'WEATHER';
}

export const MOCK_EVENTS: IntelligenceEvent[] = [
  {
    id: "EVT-2026-001",
    title: "Armed Militant Group Approaching Al-Zour Refinery Processing Area",
    coordinates: [48.151, 28.718], // Kuwait
    summary: "A convoy of unauthorized armed vehicles has breached the outer security perimeter 15km south of the Al-Zour refinery complex. Operations are currently at 60% capacity but preparing for emergency shutdown.",
    impactLevel: "CRITICAL",
    directionalImpact: "BULLISH",
    affectedAssets: ["Al-Zour Refinery Complex", "Kuwait Export Terminal"],
    confidenceScore: 89,
    reasoningChain: "Proximity to processing units is high. Historical precedent suggests targeted supply disruption. Immediate shutdown protocol removes 600,000 bpd from global supply temporarily.",
    sources: ["ACLED Event Report", "Local CCTV Feeds", "KPC Emergency Dispatch"],
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    assetType: "REFINERY"
  },
  {
    id: "EVT-2026-002",
    title: "Hurricane Category 4 Threatening Gulf Coast Pipelines",
    coordinates: [-90.0, 28.5], // Gulf of Mexico off Louisiana
    summary: "NOAA has upgraded storm to Cat 4. Projected path directly intersects major offshore pipeline hubs. Mandatory evacuations triggered for platforms.",
    impactLevel: "HIGH",
    directionalImpact: "BULLISH",
    affectedAssets: ["Mars Pipeline System", "Port Fourchon Terminal"],
    confidenceScore: 94,
    reasoningChain: "Evacuation of platforms halts production instantly. Storm intensity poses physical risk to shallow water infrastructure. Potential outage duration: 7-14 days.",
    sources: ["NOAA Hurricane Center", "BSEE Evacuation Reports"],
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    assetType: "WEATHER"
  },
  {
    id: "EVT-2026-003",
    title: "Unplanned Outage at Corpus Christi LNG Train 2",
    coordinates: [-97.266, 27.870], // Texas
    summary: "Sensor anomalies detected in the liquefaction train 2 leading to an automatic safety shutdown. Vessel loadings delayed by approx 72 hours.",
    impactLevel: "MEDIUM",
    directionalImpact: "BEARISH", // Bearish for US nat gas prices, bullish for EU
    affectedAssets: ["Corpus Christi LNG Terminal"],
    confidenceScore: 98,
    reasoningChain: "Confirmed by pipeline flow data showing acute drop in feedgas to the facility. Limits US export capacity temporarily, causing slight domestic supply glut.",
    sources: ["EIA Pipeline Flow Data", "Vessel AIS Tracking"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    assetType: "TERMINAL"
  },
  {
    id: "EVT-2026-004",
    title: "OPEC+ Unscheduled Virtual Meeting Announced",
    coordinates: [16.373, 48.208], // Vienna (headquarters)
    summary: "Delegates confirm an unscheduled virtual meeting to discuss the recent demand drop in Asian markets following unexpected tariff implementations.",
    impactLevel: "HIGH",
    directionalImpact: "UNKNOWN",
    affectedAssets: ["Global Crude Markets"],
    confidenceScore: 75,
    reasoningChain: "Unscheduled meetings historically precede production quota changes. Ambiguity around whether cuts will be unified creates high volatility.",
    sources: ["Bloomberg Terminal Feed", "Reuters Energy Desk"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    assetType: "GEOPOLITICAL"
  },
  {
    id: "EVT-2026-005",
    title: "Seismic Anomaly Near Cushing Storage Hub",
    coordinates: [-96.757, 35.986], // Cushing, OK
    summary: "Magnitude 4.2 earthquake detected 12 miles from the Cushing storage hub. Preliminary reports indicate no tank ruptures, but pipeline pressure tests are mandated.",
    impactLevel: "MEDIUM",
    directionalImpact: "BULLISH",
    affectedAssets: ["Cushing Tank Farms", "Connecting Pipelines"],
    confidenceScore: 82,
    reasoningChain: "Pipeline testing halts inflows and outflows temporarily. Given current low storage inventories, any delay in Cushing flows heavily impacts WTI pricing.",
    sources: ["USGS Feed", "Oklahoma Corporation Commission"],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    assetType: "PIPELINE"
  }
];
