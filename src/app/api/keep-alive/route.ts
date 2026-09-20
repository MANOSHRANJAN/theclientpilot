import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force this route to always run on the server, never cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Keep-alive endpoint.
 *
 * Hit by Vercel cron once a day to prevent Supabase free-tier auto-pause, which
 * kicks in after 7 days of zero API activity.
 *
 * SCHEDULING — do not "optimise" this back to a longer interval.
 *
 * The schedule in `vercel.json` previously used a step value of 5 in the
 * day-of-month field, intending "every 5 days". A step in that field does not
 * mean that: it expands to days 1, 6, 11, 16, 21 and 26, so the run on the 26th
 * is followed by a jump straight to the 1st — a six-day gap in a 31-day month,
 * against a seven-day pause deadline. That leaves about one day of headroom,
 * and a SINGLE skipped run (deploy in flight, cold-start timeout, transient
 * Supabase error) stretches the gap to eleven or twelve days, at which point
 * the project is already paused.
 *
 * Daily costs nothing — one invocation a day is within the Vercel Hobby cron
 * allowance — and it means seven consecutive failures would have to occur
 * before the database is at risk.
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
