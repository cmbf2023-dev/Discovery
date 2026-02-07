import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { WebSocketProvider } from "@/lib/websocket-context"
import { PlatformProvider } from "@/lib/platform-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DISCOVERY - Live Streaming & Social Platform",
  description: "Connect, stream, and discover amazing content creators",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PlatformProvider>
            <WebSocketProvider>
              {children}
              <Toaster />
            </WebSocketProvider>
          </PlatformProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
