import type { Metadata } from "next";
import { Geist } from "next/font/google";
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
      </body>
    </html>
  );
}
