"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { useResponsive } from "@/contexts/responsive-context";
import { cn } from "@/lib/utils";

interface ResponsiveCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  mobileClassName?: string;
  desktopClassName?: string;
  children?: React.ReactNode;
}

export function ResponsiveCard({
  children,
  className,
  mobileClassName,
  desktopClassName,
  ...props
}: ResponsiveCardProps) {
  const { isMobile } = useResponsive();

  return (
    <Card
      className={cn(
        className,
        isMobile ? mobileClassName : desktopClassName
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
