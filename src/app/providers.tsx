"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  // In a real app, you might have Framer Motion's MotionConfig, DND provider, etc.
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
