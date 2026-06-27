import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force this route to always run on the server, never cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Keep-alive endpoint.
 * Hit by Vercel cron every 5 days to prevent Supabase free-tier auto-pause
 * (which kicks in after 7 days of zero API activity).
 *
 * What it does:
 *   - SELECTs one row from `leads` to register API activity on the project.
 *   - Returns a tiny JSON status object.
 *
 * Auth:
 *   - In production on Vercel, cron requests carry an Authorization header
 *     containing your CRON_SECRET. We verify that header so only Vercel
 *     (or someone with the secret) can run this route.
 *   - If CRON_SECRET is not set, the route runs unauthenticated (dev mode).
 */
export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey ?? anonKey;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: "Supabase env vars missing" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const start = Date.now();
  const { error, count } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });
  const tookMs = Date.now() - start;

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message, tookMs },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    pingedAt: new Date().toISOString(),
    tookMs,
    leadsCount: count ?? null,
  });
}
