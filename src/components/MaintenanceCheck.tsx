'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMaintenanceMode } from '@/contexts/MaintenanceContext';

const ALLOWED_PATHS = ['/admin', '/admin/login', '/maintenance'];

export default function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const { isMaintenanceMode } = useMaintenanceMode();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isMaintenanceMode && !ALLOWED_PATHS.includes(pathname)) {
      router.push('/maintenance');
    }
  }, [isMaintenanceMode, pathname, router]);

  // Always render children for allowed paths
  if (ALLOWED_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  // For other paths, only render if not in maintenance mode
  return !isMaintenanceMode ? <>{children}</> : null;
} 