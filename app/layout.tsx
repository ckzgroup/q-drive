import './globals.css'
import './custom.css'

import { Inter as FontSans } from "next/font/google"

import {siteConfig} from "@/config/site";

import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/lib/theme-provider";
import {Toaster} from "@/components/lib/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import {Suspense} from "react";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Fleet",
    "Transport",
    "Management System",
  ],
  authors: [
    {
      name: "Fabii Kelvans",
      url: "https://github.com/fabiikelvans",
    },
  ],
  creator: "Fabii Kelvans",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@fabiikelvans",
  },
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script type="text/javascript" src="https://hst-api.wialon.com/wsdk/script/wialon.js"></script>
      </head>

      <body
          className={cn(
              "min-h-screen bg-background text-sm font-sans antialiased",
              fontSans.variable,
          )}
      >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <main>
          <ErrorBoundary>
            <Suspense>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>
        <Toaster />
      </ThemeProvider>
      </body>
      </html>
  )
}
