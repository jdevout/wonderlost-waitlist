import type { Metadata } from "next"
import { DM_Sans, Lora, IBM_Plex_Mono } from 'next/font/google'
import "~/styles/globals.css"

const dmSans = DM_Sans({
subsets: ["latin"],
weight: ["400", "500", "600", "700"],
variable: "--font-sans",
display: "swap",
})

const lora = Lora({
subsets: ["latin"],
weight: ["400", "600", "700"],
variable: "--font-serif",
display: "swap",
})

const plexMono = IBM_Plex_Mono({
subsets: ["latin"],
weight: ["400", "500", "700"],
variable: "--font-mono",
display: "swap",
})

export const metadata: Metadata = {
title: "v0 App",
description: "Created with v0",
generator: "v0.dev",
}

export default function RootLayout({
children,
}: Readonly<{ children: React.ReactNode }>) {
return (
  <html
    lang="en"
    className={`${dmSans.variable} ${lora.variable} ${plexMono.variable}`}
  >
    <body className="font-sans">{children}</body>
  </html>
)
}
