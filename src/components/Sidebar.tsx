"use client";

import React, { useState } from 'react';
import { IntelligenceEvent } from '@/data/mockEvents';
import { AlertTriangle, MapPin, Activity, ShieldAlert, Cpu, RadioTower, CloudLightning } from 'lucide-react';

interface SidebarProps {
  events: IntelligenceEvent[];
  selectedEvent: IntelligenceEvent | null;
  onSelectEvent: (event: IntelligenceEvent | null) => void;
}

export default function Sidebar({ events, selectedEvent, onSelectEvent }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const threatLevels = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'REFINERY': return <Activity size={16} />;
      case 'PIPELINE': return <RadioTower size={16} />;
      case 'TERMINAL': return <MapPin size={16} />;
      case 'GEOPOLITICAL': return <ShieldAlert size={16} />;
      case 'WEATHER': return <CloudLightning size={16} />;
      default: return <Cpu size={16} />;
    }
  };

  return (
    <div className="panel absolute right-0 top-0 h-screen flex flex-col z-20 pointer-events-auto" 
         style={{ width: '400px', borderLeftColor: 'var(--panel-border)', borderTop: 'none', borderRight: 'none', borderBottom: 'none', overflow: 'hidden' }}>
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--panel-border)' }}>
        <h2 className="font-display font-bold text-lg text-cyan uppercase tracking-wider m-0">
          Event Tracker
        </h2>
        <span className="text-xs font-mono text-muted">{events.length} ACTIVE THREATS</span>
      </div>

      {/* Selected Event Details (HUD Layer) */}
      {selectedEvent ? (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="p-4">
            <button 
              className="text-cyan text-xs mb-4 uppercase tracking-wider font-display hover:text-white"
              onClick={() => onSelectEvent(null)}
              style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
            >
              &lt; Back to Global View
            </button>
            
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <span className={`impact-badge ${selectedEvent.impactLevel.toLowerCase()}`}>
                  {selectedEvent.impactLevel}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div className="font-mono text-xs" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>
                    {new Date(selectedEvent.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  {(selectedEvent as any).createdAt && (
                    <div className="font-mono text-muted" style={{ fontSize: '0.55rem' }}>
                      Ingested {new Date((selectedEvent as any).createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold m-0 mb-2 leading-tight">
                {selectedEvent.title}
              </h3>
              <p className="font-mono text-xs text-muted border-l-2 p-2" style={{ borderColor: 'var(--panel-border)', background: 'rgba(0,0,0,0.3)' }}>
                LAT: {selectedEvent.coordinates[1].toFixed(4)} <br/>
                LON: {selectedEvent.coordinates[0].toFixed(4)}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-display text-cyan uppercase tracking-wider text-sm mb-2 border-b" style={{ borderColor: 'var(--panel-border)', paddingBottom: '0.25rem' }}>
                Intelligence Summary
              </h4>
              <p className="text-sm text-foreground mb-0" style={{ lineHeight: '1.6' }}>
                {selectedEvent.summary}
              </p>
            </div>

            {selectedEvent.updates && selectedEvent.updates.length > 0 && (
              <div className="mb-6">
                <h4 className="font-display text-red uppercase tracking-wider text-sm mb-2 border-b" style={{ borderColor: 'var(--panel-border)', paddingBottom: '0.25rem' }}>
                  Incident Timeline
                </h4>
                <div className="flex flex-col gap-3">
                  {selectedEvent.updates.map((update, i) => (
                    <div key={i} className="pl-3 border-l-2 border-red-500" style={{ borderColor: 'var(--accent-red)' }}>
                      <div className="text-xs font-mono text-muted mb-1">
                        {new Date(update.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p className="text-sm m-0" style={{ lineHeight: '1.5', color: '#e4e4e7' }}>
                        {update.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="panel mb-6" style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.05)' }}>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-display text-red uppercase tracking-wider text-sm m-0">
                  AI Impact Assessment
                </h4>
                <span className={`impact-badge ${selectedEvent.directionalImpact.toLowerCase().includes('bullish') ? 'high' : 'low'}`} style={{ fontSize: '0.6rem' }}>
                  {selectedEvent.directionalImpact} SIGNAL
                </span>
              </div>
              <p className="text-sm text-foreground m-0 mb-3" style={{ lineHeight: '1.5' }}>
                {selectedEvent.reasoningChain}
              </p>
              
              <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '0.5rem' }}>
                <span className="text-xs uppercase text-muted tracking-wider">Confidence Protocol</span>
                <span className="font-mono text-sm text-cyan">{selectedEvent.confidenceScore}%</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-display text-cyan uppercase tracking-wider text-sm mb-2 border-b" style={{ borderColor: 'var(--panel-border)', paddingBottom: '0.25rem' }}>
                Affected Assets
              </h4>
              <ul className="m-0 p-0" style={{ listStyle: 'none' }}>
                {selectedEvent.affectedAssets.map((asset, i) => (
                  <li key={i} className="text-sm mb-1 font-mono flex items-center gap-2">
                    <span className="text-red">◆</span> {asset}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h4 className="font-display text-muted uppercase tracking-wider text-xs mb-2">Sources</h4>
              <div className="flex flex-col gap-1">
                {selectedEvent.sources.map((src, i) => {
                  const isUrl = src.startsWith('http');
                  const href = isUrl 
                    ? src 
                    : `https://www.google.com/search?q=${encodeURIComponent(src + ' ' + selectedEvent.title)}`;
                  return (
                    <a 
                      key={i} 
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-cyan px-2 py-1 rounded"
                      style={{ display: 'inline-block', background: 'rgba(0,0,0,0.4)', border: '1px solid #27272a', textDecoration: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#27272a')}
                    >
                      {isUrl ? '🔗 ' + new URL(src).hostname : '🔍 ' + src}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Event Feed List */
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div className="p-3 border-b" style={{ borderColor: 'var(--panel-border)', background: 'rgba(0,0,0,0.6)' }}>
            <div className="flex items-center gap-2 px-2 py-1" style={{ border: '1px solid var(--panel-border)', borderRadius: '2px', background: 'rgba(34, 211, 238, 0.05)' }}>
              <span className="font-mono text-cyan text-xs opacity-70">{'>'}</span>
              <input 
                type="text" 
                placeholder="Search threat matrix... (e.g. Ukraine, Pipeline)" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full font-mono text-xs placeholder-muted" 
                style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--accent-cyan)', padding: '0.25rem 0', boxShadow: 'none' }}
              />
            </div>
            
            {/* Threat Level Filters */}
            <div className="flex justify-between mt-2 gap-1 px-1">
              {threatLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setActiveFilter(level)}
                  className="flex-1 font-mono text-[9px] py-1 border transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeFilter === level ? 'rgba(34,211,238,0.1)' : 'transparent',
                    borderColor: activeFilter === level ? 'var(--accent-cyan)' : '#27272a',
                    color: activeFilter === level ? 'var(--accent-cyan)' : '#a1a1aa',
                    boxShadow: activeFilter === level ? '0 0 8px rgba(34,211,238,0.2)' : 'none'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          {events
            .filter(e => activeFilter === 'ALL' || e.impactLevel === activeFilter)
            .filter(e => 
              e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              e.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
              e.assetType.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((event) => (
            <div 
              key={event.id}
              className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
              style={{ borderBottom: '1px solid var(--panel-border)' }}
              onClick={() => onSelectEvent(event)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`impact-badge ${event.impactLevel.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                  {event.impactLevel}
                </span>
                <div className="text-cyan flex items-center">
                  {getIcon(event.assetType)}
                </div>
              </div>
              <div className="font-mono mb-1" style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>
                {new Date(event.timestamp).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <h3 className="text-sm font-semibold m-0 mb-1 leading-snug">
                {event.title}
              </h3>
              <p className="text-xs text-muted font-mono" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {event.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
