"use client";

import { useTheme } from '@/components/theme/ThemeProvider';

interface BackgroundGradientProps {
  children: React.ReactNode;
  className?: string;
}

export function BackgroundGradient({ children, className = "" }: BackgroundGradientProps) {
  const { actualTheme } = useTheme();

  const gradientClass = actualTheme === 'dark' 
    ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    : "bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100";

  return (
    <div className={`${gradientClass} ${className}`}>
      {children}
    </div>
  );
}
