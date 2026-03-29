// Simplified GeoJSON of the world's most strategically important oil & gas pipelines
// Each pipeline is a LineString with key waypoint coordinates [lng, lat]

export const majorPipelines = {
  type: "FeatureCollection" as const,
  features: [
    // === NORTH AMERICA ===
    {
      type: "Feature" as const,
      properties: { name: "Colonial Pipeline", region: "US Gulf Coast → East Coast", commodity: "Refined Products" },
      geometry: { type: "LineString" as const, coordinates: [
        [-90.07, 29.95], [-88.0, 30.7], [-86.8, 33.5], [-84.4, 33.75], [-81.0, 35.2], [-78.6, 35.8], [-77.4, 37.5], [-76.6, 39.3], [-74.0, 40.7]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Keystone Pipeline", region: "Canada → US Gulf", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [-110.0, 52.3], [-108.0, 50.5], [-104.5, 49.0], [-100.0, 46.8], [-97.5, 43.5], [-97.3, 40.8], [-97.0, 37.7], [-96.0, 36.1], [-95.5, 33.0], [-95.4, 29.8]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Trans-Alaska Pipeline (TAPS)", region: "Prudhoe Bay → Valdez", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [-148.7, 70.2], [-149.0, 68.0], [-149.5, 66.0], [-146.0, 64.0], [-146.5, 63.4], [-145.7, 61.1], [-146.3, 61.0]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Enbridge Line 5", region: "Wisconsin → Ontario", commodity: "Crude Oil & NGL" },
      geometry: { type: "LineString" as const, coordinates: [
        [-89.6, 46.7], [-87.5, 45.5], [-86.0, 45.8], [-84.5, 45.0], [-83.0, 43.5], [-82.0, 42.5], [-79.5, 43.2]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Trans Mountain Pipeline", region: "Alberta → British Columbia", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [-113.5, 53.5], [-115.5, 52.0], [-117.5, 52.5], [-119.0, 51.0], [-120.5, 50.0], [-122.3, 49.3]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Dakota Access Pipeline (DAPL)", region: "North Dakota → Illinois", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [-103.6, 47.5], [-100.8, 46.3], [-99.0, 44.5], [-96.7, 43.5], [-95.0, 42.5], [-93.0, 41.7], [-91.0, 40.7]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Permian Basin to Gulf Pipeline", region: "West Texas → Corpus Christi", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [-102.0, 32.0], [-100.5, 31.0], [-99.0, 30.0], [-98.0, 29.0], [-97.4, 27.8]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Mars Pipeline System", region: "Gulf of Mexico Deepwater", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [-89.0, 28.0], [-89.2, 28.5], [-89.5, 29.0], [-89.8, 29.5], [-90.0, 29.9]
      ]}
    },
    // === EUROPE ===
    {
      type: "Feature" as const,
      properties: { name: "Druzhba Pipeline", region: "Russia → Europe", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [52.0, 54.7], [45.0, 53.2], [40.0, 52.6], [32.0, 52.4], [27.5, 53.9], [24.0, 53.7], [21.0, 52.2], [18.6, 50.3], [14.4, 50.1], [16.3, 48.2], [19.0, 47.5]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Nord Stream Route", region: "Russia → Germany (Decommissioned)", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [30.3, 59.9], [28.0, 59.7], [24.5, 59.5], [20.0, 58.0], [16.0, 56.0], [12.1, 54.1]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "TurkStream Pipeline", region: "Russia → Turkey", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [38.9, 44.6], [35.0, 43.5], [32.5, 42.5], [30.0, 42.0], [29.0, 41.5], [28.9, 41.2]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Trans Adriatic Pipeline (TAP)", region: "Greece → Italy", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [26.5, 41.0], [24.0, 40.8], [21.0, 40.5], [20.0, 40.6], [19.0, 40.5], [18.5, 40.3]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Yamal–Europe Pipeline", region: "Siberia → Germany", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [68.5, 67.5], [60.0, 61.0], [50.0, 56.0], [40.0, 54.0], [30.0, 53.5], [24.0, 53.0], [21.0, 52.5], [17.0, 52.5], [14.0, 52.5]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Norpipe Pipeline", region: "North Sea → Norway/UK", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [2.5, 56.5], [3.0, 57.5], [3.5, 58.5], [5.5, 58.9]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Forties Pipeline System", region: "North Sea → Scotland", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [0.5, 57.5], [-0.5, 57.2], [-1.5, 57.0], [-2.0, 56.8]
      ]}
    },
    // === MIDDLE EAST ===
    {
      type: "Feature" as const,
      properties: { name: "Trans-Arabian Pipeline (Tapline)", region: "Saudi Arabia → Lebanon", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [49.6, 26.3], [47.0, 28.0], [42.0, 29.5], [38.5, 31.0], [36.3, 33.0], [35.5, 34.4]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "East-West Pipeline (Petroline)", region: "Saudi Arabia Cross-Country", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [49.6, 26.3], [46.7, 24.6], [43.0, 23.5], [39.1, 22.3], [38.5, 21.5]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Strait of Hormuz Corridor", region: "Persian Gulf Chokepoint", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [50.5, 26.5], [52.0, 26.0], [54.5, 25.5], [56.3, 25.1], [57.0, 25.3]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Kirkuk–Ceyhan Pipeline", region: "Iraq → Turkey", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [44.4, 35.5], [43.5, 36.3], [42.5, 37.0], [40.5, 37.5], [38.0, 37.0], [36.2, 36.8]
      ]}
    },
    // === CAUCASUS & CENTRAL ASIA ===
    {
      type: "Feature" as const,
      properties: { name: "BTC Pipeline", region: "Azerbaijan → Turkey", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [49.9, 40.4], [46.3, 41.7], [43.0, 41.0], [39.0, 39.5], [36.2, 36.8]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "TAPI Pipeline", region: "Turkmenistan → India", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [61.8, 37.9], [65.0, 35.0], [67.0, 31.0], [68.4, 25.4], [71.0, 24.8]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Central Asia–China Gas Pipeline", region: "Turkmenistan → China", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [61.8, 37.9], [65.5, 39.5], [69.0, 41.0], [72.0, 41.5], [76.0, 42.0], [80.0, 42.5], [87.0, 43.8]
      ]}
    },
    // === AFRICA ===
    {
      type: "Feature" as const,
      properties: { name: "Trans-Saharan Gas Pipeline (Proposed)", region: "Nigeria → Algeria", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [7.5, 6.5], [7.0, 10.0], [6.0, 14.0], [5.0, 18.0], [3.0, 23.0], [2.5, 28.0], [3.0, 33.0], [3.0, 36.7]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Sumed Pipeline", region: "Red Sea → Mediterranean", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [33.9, 29.0], [32.5, 29.5], [31.5, 30.0], [30.5, 30.5], [29.9, 31.1]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "West African Gas Pipeline", region: "Nigeria → Ghana", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [3.4, 6.4], [2.4, 6.3], [1.2, 6.1], [0.2, 5.6], [-0.2, 5.5]
      ]}
    },
    // === ASIA PACIFIC ===
    {
      type: "Feature" as const,
      properties: { name: "Eastern Siberia–Pacific Ocean (ESPO)", region: "Russia → China/Pacific", commodity: "Crude Oil" },
      geometry: { type: "LineString" as const, coordinates: [
        [104.3, 52.3], [110.0, 51.5], [116.0, 50.0], [120.0, 48.5], [127.0, 47.0], [132.0, 44.0], [133.0, 43.0]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Power of Siberia Pipeline", region: "Russia → China", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [114.0, 62.0], [120.0, 58.0], [126.0, 54.0], [130.0, 50.0], [131.0, 48.0], [127.5, 45.5]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Myanmar–China Pipeline", region: "Bay of Bengal → Yunnan", commodity: "Crude Oil & Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [94.8, 20.1], [95.5, 21.5], [97.0, 22.5], [98.5, 23.5], [100.0, 24.5], [102.5, 25.0]
      ]}
    },
    // === SOUTH AMERICA ===
    {
      type: "Feature" as const,
      properties: { name: "NorAndino Pipeline", region: "Argentina → Chile", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [-63.8, -24.0], [-65.5, -24.5], [-67.0, -24.2], [-68.5, -23.8], [-70.0, -23.5]
      ]}
    },
    {
      type: "Feature" as const,
      properties: { name: "Bolivia–Brazil Pipeline (GASBOL)", region: "Bolivia → Brazil", commodity: "Natural Gas" },
      geometry: { type: "LineString" as const, coordinates: [
        [-63.0, -18.0], [-60.0, -19.0], [-57.0, -20.0], [-54.0, -21.0], [-51.0, -22.0], [-48.0, -22.5], [-47.0, -23.5]
      ]}
    },
  ]
};
