"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token || !userData) {
      router.push('/login');
    } else {
      try {
        JSON.parse(userData);
        setLoading(false);
      } catch {
        router.push('/login');
      }
    }
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading Dashboard...</div>;
  }

  return <>{children}</>;
}
