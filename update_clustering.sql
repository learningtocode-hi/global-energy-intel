-- 1. Add the JSONB array for timeline updates
ALTER TABLE public.intelligence_events ADD COLUMN IF NOT EXISTS updates JSONB DEFAULT '[]'::jsonb NOT NULL;

-- 2. Rebuild the view to expose the "updates" array to the frontend
DROP VIEW IF EXISTS public.vw_intelligence_events;

CREATE VIEW public.vw_intelligence_events AS
SELECT 
  id,
  title,
  summary,
  ST_X(coordinates::geometry) AS longitude,
  ST_Y(coordinates::geometry) AS latitude,
  impact_level,
  directional_impact,
  confidence_score,
  reasoning_chain,
  asset_type,
  affected_assets,
  sources,
  updates,
  event_timestamp as timestamp,
  created_at
FROM intelligence_events;

-- 3. Restore public read access
ALTER VIEW public.vw_intelligence_events OWNER TO postgres;
GRANT SELECT ON public.vw_intelligence_events TO anon;
