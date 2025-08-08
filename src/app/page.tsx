import WaitlistForm from "~/components/waitlist-form"

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <header className="mb-10 md:mb-14">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Join the Book Waitlist</h1>
        <p className="mt-2 text-muted-foreground">
          Get early updates, behind-the-scenes notes, and first access when it launches.
        </p>
      </header>
      <WaitlistForm />
      <footer className="mt-14 flex items-center justify-between text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Author</p>
        <a href="/admin" className="underline underline-offset-4 hover:text-foreground">
          Admin
        </a>
      </footer>
    </main>
  )
}
