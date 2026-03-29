"use client"

import { useState } from 'react';
import { processIntelligenceFeed } from '@/actions/analyzeEvent';
import { scanLiveFeeds } from '@/actions/scanFeeds';

interface FeedEvent {
  title: string;
  status: 'success' | 'error' | 'skipped';
  message?: string;
}

export default function IngestConsole() {
  const [text, setText] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState('');
  const [feedResults, setFeedResults] = useState<FeedEvent[]>([]);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setStatus({ type: 'idle', message: 'Encrypting payload and transmitting to OpenAI Node...' });

    try {
      const response = await processIntelligenceFeed(text, adminSecret);
      if (response?.success) {
        setStatus({ type: 'success', message: `SUCCESS: Event "${response.eventTitle}" generated and ingested into PostGIS.` });
        setText('');
      } else {
        setStatus({ type: 'error', message: `INGEST FAILURE: ${response?.error}` });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: `CRITICAL FAILURE: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleScanFeeds = async () => {
    setScanning(true);
    setFeedResults([]);
    setScanProgress('Connecting to Google News RSS nodes... Scanning 5 threat vectors...');

    try {
      const result = await scanLiveFeeds(adminSecret);
      setFeedResults(result.events);
      setScanProgress(
        `SCAN COMPLETE: ${result.ingested} ingested / ${result.skipped} skipped (dupes) / ${result.failed} failed / ${result.total} total`
      );
    } catch (err: any) {
      setScanProgress(`SCAN FAILURE: ${err.message}`);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-8 relative" style={{ overflow: 'auto' }}>
      <div className="scanlines"></div>
      
      <div className="flex flex-col gap-4 pointer-events-auto z-10" style={{ width: '100%', maxWidth: '900px' }}>
        
        {/* MANUAL INGEST PANEL */}
        <div className="panel flex flex-col p-8" style={{ border: '1px solid var(--accent-red)' }}>
          <h1 className="font-display font-bold text-xl tracking-wider flex items-center gap-2 m-0 mb-4">
            <span className="text-red">ADMIN</span>
            <span className="text-muted">::</span>
            <span className="text-cyan">MANUAL INTELLIGENCE INGEST</span>
          </h1>
          
          <p className="font-sans text-sm text-muted mb-4 mt-0">
            Paste raw news feeds or situational reports below. The AI node will execute a spatial classification and push the payload directly into the live dashboard.
          </p>

          <input
            type="password"
            value={adminSecret}
            onChange={(e) => setAdminSecret(e.target.value)}
            placeholder="ADMIN SECRET KEY"
            style={{
              width: '100%', background: 'rgba(0,0,0,0.5)',
              color: 'var(--accent-red)', border: '1px solid #3f3f46',
              padding: '0.75rem 1rem', outline: 'none',
              fontFamily: 'var(--font-display)', fontSize: '0.8rem',
              marginBottom: '0.75rem', boxSizing: 'border-box',
              letterSpacing: '0.1em', textTransform: 'uppercase'
            }}
          />

          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || scanning}
            style={{ 
              width: '100%', height: '180px', background: 'rgba(0,0,0,0.5)', 
              color: 'var(--foreground)', border: '1px solid #3f3f46', 
              padding: '1rem', outline: 'none', resize: 'none',
              fontFamily: 'var(--font-sans)', fontSize: '0.875rem',
              marginBottom: '1rem', boxSizing: 'border-box'
            }}
            placeholder="e.g. BREAKING: Suspected militant drone strike has triggered a massive fire at the Abqaiq processing facility in eastern Saudi Arabia..."
          />

          <div className="flex items-center justify-between w-full">
            <div className="flex-1 font-sans text-xs uppercase tracking-wider" style={{ marginRight: '1rem' }}>
              {status.type === 'success' && <span style={{ color: 'var(--accent-green)' }}>{status.message}</span>}
              {status.type === 'error' && <span className="text-red">{status.message}</span>}
              {status.type === 'idle' && status.message && <span className="text-cyan">{status.message}</span>}
            </div>
            
            <button 
              onClick={handleAnalyze}
              disabled={loading || scanning || !text.trim()}
              className="btn"
              style={{ 
                borderColor: 'var(--accent-red)', color: 'var(--accent-red)', 
                opacity: (loading || !text.trim()) ? 0.5 : 1,
                pointerEvents: (loading || !text.trim()) ? 'none' : 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              {loading ? 'ANALYZING...' : 'INGEST EVENT'}
            </button>
          </div>
        </div>

        {/* LIVE NEWS SCANNER PANEL */}
        <div className="panel flex flex-col p-8" style={{ border: '1px solid var(--accent-cyan)' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl tracking-wider flex items-center gap-2 m-0">
              <span className="text-cyan">LIVE</span>
              <span className="text-muted">::</span>
              <span>RSS FEED SCANNER</span>
            </h2>
            <button
              onClick={handleScanFeeds}
              disabled={scanning || loading}
              className="btn"
              style={{
                opacity: scanning ? 0.5 : 1,
                pointerEvents: scanning ? 'none' : 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              {scanning ? 'SCANNING...' : 'DEPLOY SCAN'}
            </button>
          </div>

          <p className="font-sans text-sm text-muted mb-4 mt-0">
            Automatically scrape Google News RSS for oil &amp; gas disruption events from the past 30 days. Each article is processed through the AI classification pipeline and geo-mapped in real time.
          </p>

          {/* Scan Progress */}
          {scanProgress && (
            <div className="mb-4" style={{ 
              padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.4)', 
              border: '1px solid #3f3f46', fontFamily: 'var(--font-sans)', fontSize: '0.75rem' 
            }}>
              <span className={scanning ? 'text-cyan' : feedResults.some(e => e.status === 'error') ? 'text-red' : ''} style={{ color: !scanning && !feedResults.some(e => e.status === 'error') ? 'var(--accent-green)' : undefined }}>
                {scanProgress}
              </span>
            </div>
          )}

          {/* Results Feed */}
          {feedResults.length > 0 && (
            <div style={{ 
              maxHeight: '300px', overflowY: 'auto', 
              border: '1px solid #3f3f46', background: 'rgba(0,0,0,0.3)' 
            }}>
              {feedResults.map((event, i) => (
                <div key={i} className="flex items-start gap-2 p-2" style={{ 
                  borderBottom: '1px solid #27272a', fontSize: '0.75rem', fontFamily: 'var(--font-sans)'
                }}>
                  <span style={{ 
                    color: event.status === 'success' ? 'var(--accent-green)' : event.status === 'skipped' ? 'var(--accent-yellow)' : 'var(--accent-red)',
                    fontWeight: 700, minWidth: '14px'
                  }}>
                    {event.status === 'success' ? '✓' : event.status === 'skipped' ? '–' : '✗'}
                  </span>
                  <span className="text-muted" style={{ flex: 1 }}>{event.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
