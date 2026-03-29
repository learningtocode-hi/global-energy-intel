"use client";

import { useState, useEffect } from 'react';
import IntelligenceMap from '@/components/IntelligenceMap';
import Sidebar from '@/components/Sidebar';
import OilTicker from '@/components/OilTicker';
import { IntelligenceEvent } from '@/data/mockEvents';
import { createClient } from '@/utils/supabase/client';

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<IntelligenceEvent | null>(null);
  const [liveEvents, setLiveEvents] = useState<IntelligenceEvent[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchEvents() {
      // Query the dynamic View we built to avoid parsing PostGIS binary geometry
      const { data, error } = await supabase.from('vw_intelligence_events').select('*');
      
      if (error) {
        console.error("Supabase Raw Error:", JSON.stringify(error, null, 2));
        console.error("Supabase Message:", error.message || "No specific message");
        console.error("Did you run the SQL script in Supabase?");
        return;
      }
      
      // Map the returned flattened longitude/latitude back into Mapbox [lng, lat] format
      if (data) {
        const formattedEvents = data.map((event: any) => ({
          id: event.id,
          title: event.title,
          summary: event.summary,
          coordinates: [event.longitude, event.latitude] as [number, number],
          impactLevel: event.impact_level,
          directionalImpact: event.directional_impact,
          confidenceScore: event.confidence_score,
          reasoningChain: event.reasoning_chain,
          affectedAssets: event.affected_assets,
          sources: event.sources,
          timestamp: event.event_timestamp || event.created_at,
          createdAt: event.created_at,
          assetType: event.asset_type
        }));
        
        setLiveEvents(formattedEvents);
      }
    }
    fetchEvents();
  }, []);

  return (
    <main className="flex h-screen w-full relative">
      <IntelligenceMap 
        events={liveEvents} 
        onSelectEvent={setSelectedEvent} 
        selectedEvent={selectedEvent}
      />
      
      {/* Minimal Gotham-style HUD — no panels, just floating ghost text */}
      <div className="absolute top-0 left-0 pointer-events-none z-10 w-full h-full">
        
        {/* Top-left: Brand mark */}
        <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
          <h1 className="font-display font-bold tracking-wider m-0" style={{ fontSize: '0.8rem', opacity: 0.85, letterSpacing: '0.15em' }}>
            <span className="text-cyan">GLOBAL</span>
            <span style={{ color: '#a1a1aa' }}> ENERGY</span>
            <span className="text-red"> INTEL</span>
          </h1>
        </div>

        {/* Top-right: Status indicators */}
        <div style={{ position: 'absolute', top: '16px', right: '416px' }} className="flex gap-4">
          <span className="font-display uppercase" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', opacity: 0.75, letterSpacing: '0.15em' }}>
            ● SYS ONLINE
          </span>
          <span className="font-display uppercase" style={{ fontSize: '0.6rem', color: liveEvents.length > 0 ? 'var(--accent-green)' : '#71717a', opacity: 0.75, letterSpacing: '0.15em' }}>
            ● {liveEvents.length} ACTIVE
          </span>
        </div>

        {/* Bottom-left: Legend */}
        <div className="pointer-events-auto" style={{ position: 'absolute', bottom: '55px', left: '16px', background: 'rgba(0,0,0,0.5)', border: '1px solid #27272a', padding: '13px 18px', fontSize: '0.78rem', fontFamily: 'var(--font-sans)', lineHeight: '1.8' }}>
          <div className="font-display uppercase tracking-wider" style={{ fontSize: '0.7rem', color: '#a1a1aa', marginBottom: '8px', letterSpacing: '0.15em' }}>LEGEND</div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-red)', boxShadow: '0 0 4px var(--accent-red)', display: 'inline-block' }}></span>
            <span style={{ color: '#a1a1aa' }}>Critical Threat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-orange)', boxShadow: '0 0 4px var(--accent-orange)', display: 'inline-block' }}></span>
            <span style={{ color: '#a1a1aa' }}>High Threat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-yellow)', boxShadow: '0 0 4px var(--accent-yellow)', display: 'inline-block' }}></span>
            <span style={{ color: '#a1a1aa' }}>Medium Threat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 4px var(--accent-cyan)', display: 'inline-block' }}></span>
            <span style={{ color: '#a1a1aa' }}>Low Threat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', borderTop: '1px solid #27272a', paddingTop: '6px' }}>
            <span style={{ width: '16px', height: '0', borderTop: '1.5px dashed var(--accent-cyan)', display: 'inline-block' }}></span>
            <span style={{ color: '#a1a1aa' }}>Pipeline Route</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '16px', height: '0', borderTop: '1.5px dashed var(--accent-red)', display: 'inline-block' }}></span>
            <span style={{ color: '#a1a1aa' }}>Threat Link</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(239,68,68,0.4)', display: 'inline-block' }}></span>
            <span style={{ color: '#a1a1aa' }}>Heat Zone</span>
          </div>
        </div>
      </div>

      <OilTicker />

      <Sidebar 
        events={liveEvents} 
        selectedEvent={selectedEvent} 
        onSelectEvent={setSelectedEvent} 
      />
    </main>
  );
}
