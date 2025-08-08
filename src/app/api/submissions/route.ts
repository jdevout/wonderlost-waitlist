import { NextResponse } from "next/server"
import { listSubmissions, upsertSubmission } from "~/lib/db"

function isValidEmail(email: string) {
  // Simple RFC5322-inspired email check
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function GET() {
  // Return all submissions (demo only; add auth for production)
  const data = listSubmissions()
  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, interest, referral, honeypot } = body ?? {}

    // Basic honeypot check
    if (typeof honeypot === "string" && honeypot.trim().length > 0) {
      return NextResponse.json({ error: "Rejected" }, { status: 400 })
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 })
    }
    if (!interest || typeof interest !== "string" || interest.trim().length < 5) {
      return NextResponse.json({ error: "Please share a bit more about your interest (min 5 chars)." }, { status: 400 })
    }

    const allowedReferrals = new Set(["twitter", "newsletter", "friend", "other"])
    if (!allowedReferrals.has(referral)) {
      return NextResponse.json({ error: "Invalid referral source." }, { status: 400 })
    }

    const saved = upsertSubmission({ email, interest: interest.trim(), referral })
    return NextResponse.json({ data: saved })
  } catch (err) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
}
