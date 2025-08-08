export type Submission = {
  email: string
  interest: string
  referral: "twitter" | "newsletter" | "friend" | "other"
  createdAt: string
  updatedAt: string
}

type DB = {
  submissions: Submission[]
  indexByEmail: Map<string, number>
}

declare global {
  // eslint-disable-next-line no-var
  var __WAITLIST_DB__: DB | undefined
}

// Initialize a global in-memory store to survive HMR in dev
const db: DB =
  globalThis.__WAITLIST_DB__ ??
  {
    submissions: [],
    indexByEmail: new Map(),
  }

if (!globalThis.__WAITLIST_DB__) {
  globalThis.__WAITLIST_DB__ = db
}

export function upsertSubmission(input: {
  email: string
  interest: string
  referral: Submission["referral"]
}) {
  const now = new Date().toISOString()
  const existingIdx = db.indexByEmail.get(input.email)
  if (existingIdx !== undefined) {
    const prev = db.submissions[existingIdx]
    const updated: Submission = {
      ...prev,
      interest: input.interest,
      referral: input.referral,
      updatedAt: now,
    }
    db.submissions[existingIdx] = updated
    return updated
  }

  const submission: Submission = {
    email: input.email,
    interest: input.interest,
    referral: input.referral,
    createdAt: now,
    updatedAt: now,
  }
  db.submissions.push(submission)
  db.indexByEmail.set(input.email, db.submissions.length - 1)
  return submission
}

export function listSubmissions() {
  // Return a copy to avoid external mutation
  return [...db.submissions].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}
