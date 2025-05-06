"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please sign in to access this page");
      router.push("/admin/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 