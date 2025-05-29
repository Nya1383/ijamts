import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaOrg from "@/components/SchemaOrg";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";
import MaintenanceCheck from "@/components/MaintenanceCheck";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IJAMTS - International Journal of Advances in Management, Technology and Science",
  description: "A peer-reviewed, open-access journal for scientific research and technological advancements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SchemaOrg />
        <Toaster position="top-right" />
        <AuthProvider>
          <MaintenanceProvider>
            <MaintenanceCheck>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </MaintenanceCheck>
          </MaintenanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
