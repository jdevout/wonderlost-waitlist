"use client"

import { useEffect, useMemo, useState } from "react"
import { Download, RefreshCw } from 'lucide-react'

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"

type Submission = {
  email: string
  interest: string
  referral: "twitter" | "newsletter" | "friend" | "other"
  createdAt: string
  updatedAt: string
}

export default function AdminPage() {
  const [data, setData] = useState<Submission[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/submissions", { cache: "no-store" })
      const json = await res.json()
      setData(json?.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (s) =>
        s.email.toLowerCase().includes(q) ||
        s.interest.toLowerCase().includes(q) ||
        s.referral.toLowerCase().includes(q),
    )
  }, [data, query])

  function exportCSV() {
    const headers = ["email", "interest", "referral", "createdAt", "updatedAt"]
    const rows = filtered.map((s) =>
      [s.email, escapeCsv(s.interest), s.referral, s.createdAt, s.updatedAt].join(","),
    )
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "waitlist.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Waitlist Submissions</CardTitle>
            <CardDescription>Demo admin view. Connect a database for persistence.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={exportCSV} disabled={filtered.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by email, interest, or referral…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="text-sm text-muted-foreground">{filtered.length} result(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left">
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Interest</th>
                  <th className="py-2 pr-4 font-medium">Referral</th>
                  <th className="py-2 pr-4 font-medium">Created</th>
                  <th className="py-2 pr-0 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={`${s.email}-${s.createdAt}`} className="border-b align-top">
                    <td className="py-3 pr-4">{s.email}</td>
                    <td className="py-3 pr-4 max-w-[520px] whitespace-pre-wrap">{s.interest}</td>
                    <td className="py-3 pr-4 capitalize">{s.referral}</td>
                    <td className="py-3 pr-4">{formatDate(s.createdAt)}</td>
                    <td className="py-3 pr-0">{formatDate(s.updatedAt)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-muted-foreground">
                      {loading ? "Loading…" : "No submissions yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

function escapeCsv(text: string) {
  if (text.includes(",") || text.includes("\n") || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}
