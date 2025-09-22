"use client";

import React from "react";
import { useResponsive } from "@/contexts/responsive-context";
import { cn } from "@/lib/utils";

interface ResponsiveGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  children: React.ReactNode;
}

export function ResponsiveGrid({
  columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 4,
  children,
  className,
  ...props
}: ResponsiveGridProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Determine the number of columns based on screen size
  let numColumns = columns.xs || 1; // Default to xs (mobile)
  
  if (isMobile) {
    numColumns = columns.xs || 1;
  } else if (isTablet) {
    numColumns = columns.sm || columns.md || 2;
  } else if (isDesktop) {
    numColumns = columns.lg || columns.xl || 4;
  }

  // Create grid template columns style
  const gridTemplateColumns = `repeat(${numColumns}, minmax(0, 1fr))`;

  return (
    <div
      className={cn(
        "grid",
        `gap-${gap}`,
        className
      )}
      style={{ gridTemplateColumns }}
      {...props}
    >
      {children}
    </div>
  );
}
