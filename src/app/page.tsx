"use client";

import { useEffect, useState } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { Dashboard } from '@/components/Dashboard';
import { useSmartShelfStore } from '@/lib/store';

export default function Home() {
  const { settings } = useSmartShelfStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!settings.setupComplete) {
    return <WelcomeScreen />;
  }

  return <Dashboard />;
}