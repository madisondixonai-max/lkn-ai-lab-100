// ===============================
// v1.1.9 — /api/generate (Supabase + OpenAI)
// ===============================
// This version:
// - validates input
// - finds student enrollment
// - safely deducts credits (RPC)
// - calls OpenAI
// - logs usage + transactions
// - returns updated credits + model info
// ===============================

import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// ===============================
// OpenAI client
// ===============================
// Uses API key from environment variables
// Make sure OPENAI_API_KEY is set in .env.local
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===============================
// Supabase client
// ===============================
// Uses the default public schema
// Prefixed table names are used directly
const edu = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // ===============================
    // 1. Parse request body
    // ===============================
    const body = await req.json();

    const prompt = body?.prompt?.trim();
    const userId = body?.userId;

    // Validate required fields
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Missing prompt" }),
        { status: 400 }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400 }
      );
    }

    // ===============================
    // 2. Find active enrollment
    // ===============================
    // Query enrollments table
    // Must have: student_id matches, status = 'active'
    const { data: enrollment, error: enrollErr } = await edu
      .from("edu_enrollments")
      .select("*")
      .eq("student_id", userId)
      .eq("status", "active")
      .single();

    // No active enrollment = cannot generate ideas
    if (enrollErr || !enrollment) {
      return new Response(
        JSON.stringify({ error: "No active enrollment" }),
        { status: 403 }
      );
    }

    // ===============================
    // 3. Deduct credit (atomic via RPC)
    // ===============================
    // Calls PostgreSQL function decrement_credit()
    // This function:
    //   - deducts 1 credit only if credits_remaining > 0
    //   - returns new credit count
    //   - throws exception if no credits available
    // This is atomic and prevents negative credits
    let newCredits: number;

    try {
      const { data, error } = await edu.rpc("decrement_credit", {
        enrollment_id: enrollment.id,
      });

      if (error) {
        console.error("Credit deduction failed:", error);
        return new Response(
          JSON.stringify({ error: "No credits remaining" }),
          { status: 403 }
        );
      }

      newCredits = data;

    } catch (err) {
      console.error("RPC error:", err);
      return new Response(
        JSON.stringify({ error: "No credits remaining" }),
        { status: 403 }
      );
    }

    // ===============================
    // 4. Call OpenAI
    // ===============================
    // Uses gpt-4o-mini for cost efficiency
    // Temperature 0.7 = balanced creativity vs consistency
    let aiRes;

    try {
      aiRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You generate high-quality content ideas." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      });
    } catch (err) {
      console.error("OPENAI ERROR:", err);
      return new Response(
        JSON.stringify({ error: "AI generation failed" }),
        { status: 500 }
      );
    }

    const text = aiRes.choices[0]?.message?.content ?? "";
    const model = aiRes.model; // Capture which model was used

    const usage = aiRes.usage ?? null; // Capture token usage

    // ===============================
    // 5. Log usage (prompt + response)
    // ===============================
    // Stores every generation for debugging and analytics
    // analytics table - analytics_usage_logs
    const { error: usageError } = await edu.from("analytics_usage_logs").insert({
      enrollment_id: enrollment.id,
      student_id: userId,
      prompt,
      response: text,
      model, // Log which model was used
      usage, // Log token consumption
    });

    if (usageError) {
      console.error("USAGE LOG ERROR:", usageError);
    }

    // ===============================
    // 6. Log credit transaction (audit trail)
    // ===============================
    // Records every credit deduction for financial tracking
    // billing table - billing_credit_transactions
    const { error: txError } = await edu.from("billing_credit_transactions").insert({
      enrollment_id: enrollment.id,
      student_id: userId,
      amount: -1,
      balance_after: newCredits,
      type: "usage",
    });

    if (txError) {
      console.error("TX LOG ERROR:", txError);
    }

    // ===============================
    // 7. Log success to console
    // ===============================
    const duration = Date.now() - startTime;

    console.log("✅ Success", {
      userId,
      creditsRemaining: newCredits,
      model,
      usage,
      durationMs: duration,
    });

    // ===============================
    // 8. Return response to frontend
    // ===============================
    // Frontend expects:
    //   - ideas: the generated content
    //   - creditsRemaining: updated credit balance
    //   - model: which AI model was used
    return new Response(
      JSON.stringify({
        ideas: text,
        creditsRemaining: newCredits,
        model, // Send model info to frontend
        usage, // Send token usage to frontend
      }),
      { status: 200 }
    );

  } catch (err: any) {
    // Catch any unexpected errors
    console.error("🔥 API Error", err?.message);

    return new Response(
      JSON.stringify({ error: "Server error", step: "generate" }),
      { status: 500 }
    );
  }
}