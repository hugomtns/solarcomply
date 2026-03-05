import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { AppProvider } from "@/contexts/app-context";
import { PocProvider } from "@/contexts/poc-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PocDevPanel } from "@/components/dev-tools/poc-dev-panel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <PocProvider>
            <TooltipProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 pl-64">
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
