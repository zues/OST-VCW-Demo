import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PreferencesProvider } from "@/components/preferences-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getPreferences } from "@/lib/get-preferences";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MeetCat",
  description: "Meetups für Katzen und ihre Menschen",
};

async function Preferences({ children }: { children: React.ReactNode }) {
  const { lang, city } = await getPreferences();
  return <PreferencesProvider initial={{ lang, city }}>{children}</PreferencesProvider>;
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Suspense>
          <Preferences>
            <TooltipProvider>{children}</TooltipProvider>
          </Preferences>
        </Suspense>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
