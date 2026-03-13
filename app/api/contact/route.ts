import { NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://casaavenidadelray.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot check — silently succeed
    if (body._hp) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Validate required fields
    const { firstName, lastName, email } = body;
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Basic email format check
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const results: { resend?: boolean; sheets?: boolean } = {};

    // ── Resend (email notification) ────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const emailBody = `
New inquiry from Casa Avenida website

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${body.phone ?? "—"}
Unit of Interest: ${body.unitOfInterest ?? "—"}
Finish Preference: ${body.finishPreference ?? "—"}
Preferred Contact: ${body.preferredContact ?? "—"}

Message:
${body.message ?? "(none)"}
        `.trim();

        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Casa Avenida <inquiries@casaavenidadelray.com>",
            to: ["tj@douglaselliman.com", "nicole@douglaselliman.com"],
            subject: `New Inquiry — ${firstName} ${lastName}`,
            text: emailBody,
          }),
        });
        results.resend = resendRes.ok;
      } catch {
        results.resend = false;
      }
    }

    // ── Google Sheets webhook ───────────────────
    const sheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (sheetsUrl) {
      try {
        const sheetsRes = await fetch(sheetsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            firstName,
            lastName,
            email,
            phone: body.phone ?? "",
            unitOfInterest: body.unitOfInterest ?? "",
            finishPreference: body.finishPreference ?? "",
            preferredContact: body.preferredContact ?? "",
            message: body.message ?? "",
          }),
        });
        results.sheets = sheetsRes.ok;
      } catch {
        results.sheets = false;
      }
    }

    return NextResponse.json({ ok: true, ...results }, { status: 200, headers: CORS_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
