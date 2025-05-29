import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaOrg from "@/components/SchemaOrg";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import MaintenanceMode from "@/components/MaintenanceMode";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

async function getMaintenanceStatus() {
  try {
    const maintenanceDoc = await getDocs(collection(db, "settings"));
    if (!maintenanceDoc.empty) {
      return maintenanceDoc.docs[0].data().maintenanceMode || false;
    }
    return false;
  } catch (error) {
    console.error("Error fetching maintenance status:", error);
    return false;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenanceMode = await getMaintenanceStatus();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isAdminRoute = pathname.startsWith('/admin');

  // Show normal layout for admin routes even in maintenance mode
  if (isMaintenanceMode && !isAdminRoute) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <MaintenanceMode />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SchemaOrg />
        <Toaster position="top-right" />
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
