"use server"

import { z } from "zod";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { zodResponseFormat } from "openai/helpers/zod";

export async function processIntelligenceFeed(rawText: string, adminSecret?: string) {
  try {
    // Auth gate — block unauthorized access
    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return { success: false, error: "Unauthorized. Invalid admin credentials." };
    }

    // Input validation
    if (!rawText || rawText.trim().length === 0) {
      return { success: false, error: "Empty input." };
    }
    if (rawText.length > 5000) {
      return { success: false, error: "Input too long. Maximum 5000 characters." };
    }
    if (!process.env.OPENAI_API_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing critical API keys for Intelligence Pipeline in .env.local");
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize Supabase admin client to bypass RLS for inserts
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Define exactly what we want OpenAI to return us
    const EventSchema = z.object({
      title: z.string().describe("Short punchy headline of the global event"),
      summary: z.string().describe("1-2 sentence detailed summary of what happened"),
      longitude: z.number().describe("The exact longitude coordinates of the event"),
      latitude: z.number().describe("The exact latitude coordinates of the event"),
      impact_level: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).describe("Severity of the event"),
      directional_impact: z.enum(['BULLISH', 'BEARISH', 'NEUTRAL', 'UNKNOWN']).describe("Likely impact on global energy markets / crude oil prices"),
      confidence_score: z.number().int().min(0).max(100).describe("Confidence in this parsed assessment 0-100"),
      reasoning_chain: z.string().describe("1 sentence explicitly explaining WHY this direction and impact was chosen"),
      asset_type: z.enum(['REFINERY', 'PIPELINE', 'TERMINAL', 'GEOPOLITICAL', 'WEATHER']).describe("The type of asset or event affected"),
      affected_assets: z.array(z.string()).describe("Specific names of pipelines, refineries, or regions explicitly mentioned"),
      sources: z.array(z.string()).describe("Source URLs if present in the text, otherwise source organization names like 'Reuters' or 'EIA'"),
      event_date: z.string().describe("The date the event actually occurred in ISO format YYYY-MM-DD. Extract from the text. If no date is found, use today's date.")
    });

    // Call OpenAI Structured Outputs
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.1,
      messages: [
        {
          role: "system",
          content: "You are an elite energy analyst and geospatial geocoding system. You will receive raw news fragments. Extract the disruption event, determine the exact lat/long coordinates of the event. Output strictly matching the requested JSON format."
        },
        {
          role: "user",
          content: rawText
        }
      ],
      response_format: zodResponseFormat(EventSchema, "intelligence_event"),
    });

    const parsedEventString = completion.choices[0].message.content;

    if (!parsedEventString) {
      throw new Error("AI failed to generate structured intelligence.");
    }
    
    const parsedEvent = JSON.parse(parsedEventString);

    // Insert into Supabase (Need to format standard latitude/longitude back into PostGIS POINT)
    const postgisPoint = `POINT(${parsedEvent.longitude} ${parsedEvent.latitude})`;

    const { data, error } = await supabaseAdmin
      .from("intelligence_events")
      .insert({
        title: parsedEvent.title,
        summary: parsedEvent.summary,
        coordinates: postgisPoint, // We insert as Geo WKT String, PostGIS auto-casts it dynamically if we don't explicitly cast in SQL, but supabase-js raw strings usually work for POINT.
        impact_level: parsedEvent.impact_level,
        directional_impact: parsedEvent.directional_impact,
        confidence_score: parsedEvent.confidence_score,
        reasoning_chain: parsedEvent.reasoning_chain,
        asset_type: parsedEvent.asset_type,
        affected_assets: parsedEvent.affected_assets,
        sources: parsedEvent.sources,
        event_timestamp: parsedEvent.event_date ? new Date(parsedEvent.event_date).toISOString() : new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database Error: ${error.message}`);
    }

    return { success: true, eventTitle: data.title };
  } catch (error: any) {
    console.error("Pipeline Error:", error);
    return { success: false, error: "Processing failed. Please try again." };
  }
}
