import { NextRequest, NextResponse } from "next/server";

/**
 * Edge Proxy — rate limiting for API routes.
 * Implements a simple in-memory sliding window per IP.
 * Max 20 requests per minute per IP to /api/ routes.
 *
 * Note: In-memory state resets on each cold start.
 * For production with multiple Edge replicas, pair with Upstash Redis.
 *
 * Renamed from middleware.ts → proxy.ts for Next.js 16 compatibility.
 */

const RATE_LIMIT = 20;           // requests
const WINDOW_MS  = 60 * 1000;   // 1 minute

// Map: IP → { count, windowStart }
const rateMap = new Map<string, { count: number; windowStart: number }>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only rate-limit API routes
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(req);
    const now = Date.now();
    const entry = rateMap.get(ip);

    if (!entry || now - entry.windowStart > WINDOW_MS) {
      // New window
      rateMap.set(ip, { count: 1, windowStart: now });
    } else {
      entry.count++;
      if (entry.count > RATE_LIMIT) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": "60",
              "X-RateLimit-Limit": String(RATE_LIMIT),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
