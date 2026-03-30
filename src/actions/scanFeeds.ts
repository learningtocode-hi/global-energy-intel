"use server"

import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import { processIntelligenceFeed } from './analyzeEvent';

const parser = new Parser();

// Google News RSS search queries focused on energy disruption events
const FEED_QUERIES = [
  'oil pipeline explosion OR attack OR shutdown',
  'refinery fire OR explosion OR outage',
  'natural gas disruption OR pipeline leak',
  'OPEC production cut OR oil embargo',
  'LNG terminal shutdown OR hurricane energy',
];

interface ScanResult {
  total: number;
  ingested: number;
  failed: number;
  skipped: number;
  events: { title: string; status: 'success' | 'error' | 'skipped'; message?: string }[];
}

export async function scanLiveFeeds(adminSecret?: string): Promise<ScanResult> {
  const result: ScanResult = { total: 0, ingested: 0, failed: 0, skipped: 0, events: [] };

  // Auth gate
  if (!adminSecret || adminSecret.trim() !== (process.env.ADMIN_SECRET || "").trim()) {
    result.events.push({ title: 'UNAUTHORIZED', status: 'error', message: 'Invalid admin credentials.' });
    return result;
  }

  try {
    // Calculate date threshold (past 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Collect all unique articles from all queries
    const seenTitles = new Set<string>();
    const articles: { title: string; snippet: string; pubDate: Date }[] = [];

    for (const query of FEED_QUERIES) {
      try {
        const encodedQuery = encodeURIComponent(query);
        const feedUrl = `https://news.google.com/rss/search?q=${encodedQuery}+when:30d&hl=en-US&gl=US&ceid=US:en`;
        
        const feed = await parser.parseURL(feedUrl);

        for (const item of feed.items || []) {
          const title = item.title || '';
          const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

          // Skip duplicates and old articles
          if (seenTitles.has(title)) continue;
          if (pubDate < thirtyDaysAgo) continue;

          seenTitles.add(title);
          articles.push({
            title,
            snippet: item.contentSnippet || item.content || title,
            pubDate,
          });
        }
      } catch (feedErr) {
        console.error(`Feed query failed: ${query}`, feedErr);
      }
    }

    // Cap at 30 articles (~$0.08 in OpenAI costs)
    const capped = articles.slice(0, 30);
    result.total = capped.length;

    // Fetch existing event titles from DB to prevent duplicates
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Process each article through our existing AI pipeline
    for (const article of capped) {
      try {
        const rawText = `${article.title}. ${article.snippet}. Published: ${article.pubDate.toISOString().split('T')[0]}`;
        
        const response = await processIntelligenceFeed(rawText, adminSecret);

        if (response?.success) {
          result.ingested++;
          result.events.push({ title: response.eventTitle || article.title, status: 'success' });
        } else {
          result.failed++;
          result.events.push({ title: article.title, status: 'error', message: response?.error });
        }
      } catch (err: any) {
        result.failed++;
        result.events.push({ title: article.title, status: 'error', message: err.message });
      }
    }

  } catch (err: any) {
    console.error("Feed scan failed:", err);
  }

  return result;
}
