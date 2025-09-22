"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useResponsive } from "@/contexts/responsive-context";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  priority: number; // Higher number = higher priority to show on mobile
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyField,
  isLoading = false,
  emptyMessage = "لا توجد بيانات",
  onRowClick,
}: ResponsiveTableProps<T>) {
  const { isMobile } = useResponsive();

  // Filter columns based on priority for mobile view
  const visibleColumns = isMobile
    ? columns.filter((col) => col.priority >= 3) // Only show high priority columns on mobile
    : columns;

  if (isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-8">{emptyMessage}</div>;
  }

  // For mobile view, render as cards
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={String(item[keyField])}
            className="border rounded-lg p-4 space-y-2 bg-card text-card-foreground"
            onClick={() => onRowClick && onRowClick(item)}
          >
            {visibleColumns.map((column, colIndex) => (
              <div key={colIndex} className="flex justify-between items-center">
                <span className="font-medium">{column.header}:</span>
                <span className="text-right">
                  {typeof column.accessor === "function"
                    ? column.accessor(item)
                    : String(item[column.accessor] || "-")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // For desktop view, render as table
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map((column, index) => (
              <TableHead key={index} className="text-right">
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={String(item[keyField])}
              onClick={() => onRowClick && onRowClick(item)}
              className={onRowClick ? "cursor-pointer hover:bg-muted" : ""}
            >
              {visibleColumns.map((column, colIndex) => (
                <TableCell key={colIndex} className="text-right">
                  {typeof column.accessor === "function"
                    ? column.accessor(item)
                    : String(item[column.accessor] || "-")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
