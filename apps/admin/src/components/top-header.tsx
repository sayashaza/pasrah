"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function TopHeader() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-border flex justify-between items-center px-6 py-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h2 className="text-xl font-semibold text-foreground">Welcome back, {user?.name || 'Admin'}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
          {user?.name?.[0]?.toUpperCase() || 'A'}
        </div>
        <button onClick={handleLogout} className="text-sm text-destructive font-medium hover:text-destructive/80 transition">Logout</button>
      </div>
    </header>
  );
}
