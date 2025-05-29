'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMaintenanceMode } from '@/contexts/MaintenanceContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MaintenancePage() {
  const { isMaintenanceMode } = useMaintenanceMode();
  const router = useRouter();

  useEffect(() => {
    if (!isMaintenanceMode) {
      router.push('/');
    }
  }, [isMaintenanceMode, router]);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.png"
            alt="IJAMTS Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>

        {/* Maintenance Message */}
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
          Under Maintenance
        </h1>
        <p className="text-xl text-[var(--secondary-text)] mb-8">
          We're currently performing some scheduled maintenance. We'll be back online shortly!
        </p>

        {/* Estimated Time */}
        <div className="bg-[var(--secondary-background)] p-6 rounded-lg mb-8">
          <p className="text-[var(--secondary-text)]">
            Thank you for your patience. Please check back later.
          </p>
        </div>

        {/* Admin Link */}
        <div className="fixed top-4 right-4">
          <Link
            href="/admin"
            className="p-2 text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 