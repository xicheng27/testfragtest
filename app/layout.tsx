import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ShelfProvider } from "@/lib/shelf-context";
import { QuizProgressProvider } from "@/lib/quiz-progress-context";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScentMatch — Find a fragrance that actually feels like you",
  description: "Take a personalised quiz and discover fragrances matched to your taste, lifestyle, and aesthetic.",
};

// Without an explicit viewport, mobile browsers fall back to a ~980px layout
// width and shrink the page to fit — which makes content look zoomed-in and
// clipped, forcing users to pinch-zoom. `width=device-width` lays the page out
// at the real device width; `viewportFit: 'cover'` lets safe-area insets work.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50">
        <AuthProvider>
          <ShelfProvider>
            <QuizProgressProvider>
              {children}
            </QuizProgressProvider>
          </ShelfProvider>
        </AuthProvider>
        <footer className="shrink-0 border-t border-stone-200 bg-white/80 px-4 py-5 text-xs leading-relaxed text-stone-500 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              ScentMatch is an independent fragrance recommendation tool and is not affiliated with any brand. All product names and images are used for identification purposes only.
            </p>
            <Link
              href="/disclaimer"
              className="shrink-0 font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-950"
            >
              Disclaimer
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
