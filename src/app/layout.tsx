import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AppProvider } from "@/contexts/app-context";
import { PocProvider } from "@/contexts/poc-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PocDevPanel } from "@/components/dev-tools/poc-dev-panel";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SolarComply — Compliance Platform",
  description: "Trusted Compliance & Data-Sharing Platform for Solar PV and BESS Lifecycles",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <AppProvider>
          <PocProvider>
            <TooltipProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 pl-64 min-h-screen bg-surface-page">
                  <Topbar />
                  <main className="mx-auto max-w-[1440px] p-8">{children}</main>
                </div>
              </div>
              <PocDevPanel />
            </TooltipProvider>
          </PocProvider>
        </AppProvider>
      </body>
    </html>
  );
}
