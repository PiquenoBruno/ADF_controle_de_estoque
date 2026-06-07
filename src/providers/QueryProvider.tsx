import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";

type QueryProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      
      staleTime: 0,
      gcTime: 1000 * 60 * 10,
    },
  },
});

export function QueryProvider({
  children,
}: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}