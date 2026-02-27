import type { Metadata } from 'next'
import { Instrument_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from "../components/Navbar";

const iSans = Instrument_Sans({ subsets: ['latin'],
  weight: ["400"]
})

export const metadata: Metadata = {
  title: "Attendance Tracker | DRKIST",
  description: "created by srikanth(https://srikanth9x.pages.dev)",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${iSans.className} flex flex-col items-center bg-neutral-50 dark:bg-neutral-950`}>
        <div id="page" className="bg-neutral-50 dark:bg-neutral-950 p-4 w-full max-w-3xl flex flex-col items-center gap-4">
          <Navbar />
          {children}
      </div>
      </body>
    </html>
  )
}
