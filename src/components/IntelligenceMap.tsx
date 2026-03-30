"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { IntelligenceEvent } from '@/data/mockEvents';
import { majorPipelines } from '@/data/pipelines';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Global interaction lock to prevent canvas (pipelines/links) from showing popups
// at the exact same time as DOM marker popups (Resolving the double-hover overlap UI bug)
let globalIsRadarHovered = false;
let floatBlockTimeout: NodeJS.Timeout;

interface IntelligenceMapProps {
  events: IntelligenceEvent[];
  onSelectEvent: (event: IntelligenceEvent) => void;
  selectedEvent: IntelligenceEvent | null;
}

export default function IntelligenceMap({ events, onSelectEvent, selectedEvent }: IntelligenceMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const layersAdded = useRef(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 2,
      projection: 'globe',
      attributionControl: false,
      logoPosition: 'bottom-right'
    });

    map.current.on('style.load', () => {
      map.current?.setFog({
        'color': '#000000', 
        'high-color': '#52525b', 
        'horizon-blend': 0.1,
        'space-color': '#000000',
        'star-intensity': 0.2
      });
      
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add pipeline routes + heat layer once map is loaded
  useEffect(() => {
    if (!map.current || !mapLoaded || layersAdded.current) return;
    layersAdded.current = true;

    const m = map.current;

    // === PIPELINE ROUTES ===
    m.addSource('pipelines', {
      type: 'geojson',
      data: majorPipelines as any
    });

    // Outer glow line
    m.addLayer({
      id: 'pipeline-glow',
      type: 'line',
      source: 'pipelines',
      paint: {
        'line-color': '#22d3ee',
        'line-width': 4,
        'line-opacity': 0.15,
        'line-blur': 4
      }
    });

    // Inner core line
    m.addLayer({
      id: 'pipeline-line',
      type: 'line',
      source: 'pipelines',
      paint: {
        'line-color': '#22d3ee',
        'line-width': 1.2,
        'line-opacity': 0.4,
        'line-dasharray': [4, 3]
      }
    });

    // Invisible wide hitbox layer for easier hover detection
    m.addLayer({
      id: 'pipeline-hitbox',
      type: 'line',
      source: 'pipelines',
      paint: {
        'line-color': 'transparent',
        'line-width': 20,
        'line-opacity': 0
      }
    });

    // Pipeline label on hover (using the wide hitbox layer)
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      className: 'pipeline-popup'
    });

    m.on('mouseenter', 'pipeline-hitbox', (e) => {
      if (globalIsRadarHovered) return;
      m.getCanvas().style.cursor = 'pointer';
      const props = e.features?.[0]?.properties;
      if (props && e.lngLat) {
        popup.setLngLat(e.lngLat)
          .setHTML(`<strong>${props.name}</strong><br/><span style="opacity:0.7">${props.commodity} · ${props.region}</span>`)
          .addTo(m);
      }
    });

    m.on('mousemove', 'pipeline-hitbox', (e) => {
      if (globalIsRadarHovered) {
        popup.remove();
        return;
      }
      if (e.lngLat) popup.setLngLat(e.lngLat);
    });

    m.on('mouseleave', 'pipeline-hitbox', () => {
      if (globalIsRadarHovered) return;
      m.getCanvas().style.cursor = '';
      popup.remove();
    });

  }, [mapLoaded]);

  // Add heatmap layer when events change
  useEffect(() => {
    if (!map.current || !mapLoaded || events.length === 0) return;
    const m = map.current;

    // Build GeoJSON from events for heatmap
    const heatData = {
      type: 'FeatureCollection' as const,
      features: events.map(e => ({
        type: 'Feature' as const,
        properties: {
          intensity: e.impactLevel === 'CRITICAL' ? 1.0 : e.impactLevel === 'HIGH' ? 0.7 : e.impactLevel === 'MEDIUM' ? 0.4 : 0.2
        },
        geometry: {
          type: 'Point' as const,
          coordinates: e.coordinates
        }
      }))
    };

    if (m.getSource('event-heat')) {
      (m.getSource('event-heat') as mapboxgl.GeoJSONSource).setData(heatData as any);
    } else {
      m.addSource('event-heat', { type: 'geojson', data: heatData as any });

      m.addLayer({
        id: 'event-heatmap',
        type: 'heatmap',
        source: 'event-heat',
        paint: {
          'heatmap-weight': ['get', 'intensity'],
          'heatmap-intensity': 0.8,
          'heatmap-radius': 50,
          'heatmap-opacity': 0.4,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.15, 'rgba(251,146,60,0.3)',
            0.3, 'rgba(251,146,60,0.5)',
            0.5, 'rgba(239,68,68,0.6)',
            0.7, 'rgba(239,68,68,0.75)',
            1, 'rgba(255,200,150,0.9)'
          ]
        }
      });
    }
  }, [events, mapLoaded]);

  // Connection lines between nearby events of same asset type
  useEffect(() => {
    if (!map.current || !mapLoaded || events.length < 2) return;
    const m = map.current;

    // Group events by asset type and draw lines between NEARBY same-type events only
    const typeGroups: { [key: string]: IntelligenceEvent[] } = {};
    
    events.forEach(e => {
      if (!typeGroups[e.assetType]) typeGroups[e.assetType] = [];
      typeGroups[e.assetType].push(e);
    });

    // Calculate distance between two [lng, lat] points in degrees (rough proximity check)
    const getDistance = (a: [number, number], b: [number, number]) => {
      const dlng = a[0] - b[0];
      const dlat = a[1] - b[1];
      return Math.sqrt(dlng * dlng + dlat * dlat);
    };

    const MAX_LINK_DISTANCE = 15; // ~1,600km — only link genuinely nearby events

    const features: any[] = [];
    Object.entries(typeGroups).forEach(([type, group]) => {
      if (group.length < 2) return;
      // Compare each pair — only link if geographically close
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          const dist = getDistance(group[i].coordinates, group[j].coordinates);
          if (dist <= MAX_LINK_DISTANCE) {
            features.push({
              type: 'Feature',
              properties: { 
                from: group[i].title, 
                to: group[j].title, 
                assetType: type,
                linkReason: `Proximity link · ${type} · ${Math.round(dist * 111)}km apart`
              },
              geometry: { type: 'LineString', coordinates: [group[i].coordinates, group[j].coordinates] }
            });
          }
        }
      }
    });

    const connectionData = { type: 'FeatureCollection', features };

    if (m.getSource('connections')) {
      (m.getSource('connections') as mapboxgl.GeoJSONSource).setData(connectionData as any);
    } else {
      m.addSource('connections', { type: 'geojson', data: connectionData as any });

      m.addLayer({
        id: 'connection-lines',
        type: 'line',
        source: 'connections',
        paint: {
          'line-color': '#f87171',
          'line-width': 1.2,
          'line-opacity': 0.6,
          'line-dasharray': [2, 4]
        }
      });

      // Wide invisible hitbox for hover
      m.addLayer({
        id: 'connection-hitbox',
        type: 'line',
        source: 'connections',
        paint: {
          'line-color': 'transparent',
          'line-width': 16,
          'line-opacity': 0
        }
      });

      const connPopup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'pipeline-popup'
      });

      m.on('mouseenter', 'connection-hitbox', (e) => {
        if (globalIsRadarHovered) return;
        m.getCanvas().style.cursor = 'crosshair';
        const props = e.features?.[0]?.properties;
        if (props && e.lngLat) {
          connPopup.setLngLat(e.lngLat)
            .setHTML(`<strong style="color:#f87171">THREAT LINK</strong><br/><span style="opacity:0.8">⬤ ${props.from}</span><br/><span style="opacity:0.8">⬤ ${props.to}</span><br/><span style="opacity:0.5;font-size:0.6rem">${props.linkReason}</span>`)
            .addTo(m);
        }
      });

      m.on('mousemove', 'connection-hitbox', (e) => {
        if (globalIsRadarHovered) {
          connPopup.remove();
          return;
        }
        if (e.lngLat) connPopup.setLngLat(e.lngLat);
      });

      m.on('mouseleave', 'connection-hitbox', () => {
        if (globalIsRadarHovered) return;
        m.getCanvas().style.cursor = '';
        connPopup.remove();
      });
    }
  }, [events, mapLoaded]);

  // Radar markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    try {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};

      events.forEach(event => {
        const impact = event.impactLevel ? event.impactLevel.toLowerCase() : 'critical';
        
        const el = document.createElement('div');
        el.className = `radar-marker ${impact}`;
        
        const core = document.createElement('div');
        core.className = 'radar-core';
        el.appendChild(core);
        
        const ringCount = impact === 'critical' ? 3 : impact === 'high' ? 2 : 1;
        for (let i = 1; i <= ringCount; i++) {
          const ring = document.createElement('div');
          ring.className = `radar-ring ring-${i}`;
          el.appendChild(ring);
        }
        
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat(event.coordinates)
          .addTo(map.current!);
          
        const markerPopup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          className: 'radar-popup',
          offset: 15
        }).setHTML(`<strong style="color:var(--accent-cyan); font-family:var(--font-display); letter-spacing:0.1em; text-transform:uppercase; font-size:0.75rem">${event.title}</strong><br/><span style="opacity:0.8; font-size:0.65rem">${impact.toUpperCase()} THREAT</span>`);
        
        el.addEventListener('mouseenter', () => {
          globalIsRadarHovered = true; // Block lower layers immediately
          clearTimeout(floatBlockTimeout); // Cancel any running 2sec timeouts
          markerPopup.setLngLat(event.coordinates).addTo(map.current!);
        });
        
        el.addEventListener('mouseleave', () => {
          markerPopup.remove();
          // The 2.0 second user-requested timeout block! Prevents ghost overlaps when moving the mouse quickly away from the ping
          floatBlockTimeout = setTimeout(() => {
            globalIsRadarHovered = false;
          }, 2000); 
        });

        el.addEventListener('click', () => {
          onSelectEvent(event);
        });

        markersRef.current[event.id] = marker;
      });
    } catch (e) {
      console.error("Marker render crash:", e);
    }
  }, [events, mapLoaded, onSelectEvent]);

  // Fly to selected event
  useEffect(() => {
    if (!map.current || !selectedEvent) return;
    
    map.current.flyTo({
      center: selectedEvent.coordinates,
      zoom: 5,
      essential: true,
      easing: (t) => t * (2 - t)
    });
  }, [selectedEvent]);

  return (
    <div className="map-container">
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
