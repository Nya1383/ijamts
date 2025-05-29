'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type MaintenanceContextType = {
  isMaintenanceMode: boolean;
  toggleMaintenanceMode: () => Promise<void>;
};

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      const maintenanceDoc = await getDoc(doc(db, 'settings', 'maintenance'));
      setIsMaintenanceMode(maintenanceDoc.data()?.enabled || false);
    };

    fetchMaintenanceStatus();
  }, []);

  const toggleMaintenanceMode = async () => {
    const maintenanceRef = doc(db, 'settings', 'maintenance');
    await setDoc(maintenanceRef, { enabled: !isMaintenanceMode }, { merge: true });
    setIsMaintenanceMode(!isMaintenanceMode);
  };

  return (
    <MaintenanceContext.Provider value={{ isMaintenanceMode, toggleMaintenanceMode }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenanceMode() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenanceMode must be used within a MaintenanceProvider');
  }
  return context;
} 