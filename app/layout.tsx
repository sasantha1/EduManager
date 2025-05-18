import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  title: 'EduManager'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}
        <Toaster />
      </body>
    </html>
  )
}
