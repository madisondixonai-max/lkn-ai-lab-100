// ===============================
// v1.1.4 — /api/credits (Supabase)
// ===============================
// This version:
// - fetches credits for active enrollment
// - matches generate route exactly
// - uses prefixed public tables
// ===============================

import { createClient } from "@supabase/supabase-js";

// ===============================
// Supabase client
// ===============================
// This client uses the default public schema
// Prefixed table names are used directly
const edu = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    // ===============================
    // 1. Parse userId from query params
    // ===============================
    // Example: /api/credits?userId=755db8bc-8cd7-46c2-b93e-1804478ef012
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Validate required field
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400 }
      );
    }

    // ===============================
    // 2. Fetch active enrollment
    // ===============================
    // Query the enrollments table
    // Filters:
    //   - student_id matches the provided userId
    //   - status is "active" (enrollment is current)
    // .maybeSingle() returns null if no match (no error)
    const { data: enrollment, error } = await edu
      .from("edu_enrollments")
      .select("credits_remaining")
      .eq("student_id", userId)
      .eq("status", "active")
      .maybeSingle();

    // Handle database error
    if (error) {
      console.error("FULL ERROR:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch credits" }),
        { status: 500 }
      );
    }

    // Handle no active enrollment found
    if (!enrollment) {
      return new Response(
        JSON.stringify({ error: "No active enrollment" }),
        { status: 404 }
      );
    }

    // ===============================
    // 3. Return credits to frontend
    // ===============================
    return new Response(
      JSON.stringify({ credits: enrollment.credits_remaining }),
      { status: 200 }
    );

  } catch (err) {
    // Catch any unexpected errors
    console.error("Credits API error:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}