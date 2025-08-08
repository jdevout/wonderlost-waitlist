"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { BookOpen, CheckCircle2, Loader2 } from 'lucide-react'

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Textarea } from "~/components/ui/textarea"

type Props = {
  title?: string
  synopsis?: string
  coverAlt?: string
}

export default function WaitlistForm({
  title = "Threads of Tomorrow",
  synopsis = "A practical and inspiring guide exploring how small, consistent actions compound into extraordinary outcomes over a decade. Blending research, stories, and field-tested frameworks, this book helps you design a life that compounds in your favor.",
  coverAlt = "Book cover preview",
}: Props) {
  const [email, setEmail] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [interest, setInterest] = useState("")
  const [referral, setReferral] = useState<"twitter" | "newsletter" | "friend" | "other">("twitter")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState("") // hidden anti-bot

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email])
  const interestValid = interest.trim().length >= 5

  function handleStart(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!emailValid) {
      setError("Please enter a valid email.")
      return
    }
    setIsOpen(true)
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest, referral, honeypot }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Something went wrong. Please try again.")
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function resetAll() {
    setIsOpen(false)
    setSuccess(false)
    setError(null)
    setInterest("")
    setReferral("twitter")
    // keep email so user sees what they entered
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 items-start">
      <div className="flex flex-col gap-6">
        <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-xl border bg-muted">
          <Image
            src={"/placeholder.svg?height=800&width=600&query=modern%20minimal%20book%20cover%20with%20abstract%20geometric%20pattern"}
            alt={coverAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <p className="text-sm">Draft preview cover — subject to change</p>
        </div>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-base leading-relaxed">{synopsis}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStart} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Join the waitlist</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!emailValid && email.length > 0}
              />
              {/* Honeypot field */}
              <div className="sr-only" aria-hidden="true">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={!emailValid}>
                Get early access
              </Button>
              <p className="text-sm text-muted-foreground">We&apos;ll ask 2 quick questions after.</p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>No spam. Unsubscribe anytime.</span>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={(open) => (open ? setIsOpen(true) : resetAll())}>
        <DialogContent className="sm:max-w-lg">
          {!success ? (
            <>
              <DialogHeader>
                <DialogTitle>Two quick questions</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="interest">What interests you most about this book?</Label>
                  <Textarea
                    id="interest"
                    placeholder="Share what you'd love to learn, problems you're facing, or outcomes you want..."
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="min-h-[100px]"
                  />
                  {!interestValid && interest.length > 0 && (
                    <p className="text-xs text-muted-foreground">Please add a bit more detail (min 5 characters).</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label>How did you hear about this book?</Label>
                  <RadioGroup
                    value={referral}
                    onValueChange={(v) => setReferral(v as typeof referral)}
                    className="grid gap-2 sm:grid-cols-2"
                  >
                    <Label
                      htmlFor="ref-twitter"
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                    >
                      <RadioGroupItem id="ref-twitter" value="twitter" />
                      X/Twitter
                    </Label>
                    <Label
                      htmlFor="ref-newsletter"
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                    >
                      <RadioGroupItem id="ref-newsletter" value="newsletter" />
                      Newsletter
                    </Label>
                    <Label
                      htmlFor="ref-friend"
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                    >
                      <RadioGroupItem id="ref-friend" value="friend" />
                      Friend
                    </Label>
                    <Label
                      htmlFor="ref-other"
                      className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-muted"
                    >
                      <RadioGroupItem id="ref-other" value="other" />
                      Other
                    </Label>
                  </RadioGroup>
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <DialogFooter className="flex items-center justify-between gap-2">
                <Button variant="outline" onClick={() => resetAll()} type="button">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={!emailValid || !interestValid || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  You&apos;re on the list!
                </DialogTitle>
              </DialogHeader>
              <div className="py-2">
                <p className="text-sm text-muted-foreground">
                  Thanks for your input. We&apos;ll email {email} with updates and early access.
                </p>
              </div>
              <DialogFooter>
                <Button onClick={() => resetAll()}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
