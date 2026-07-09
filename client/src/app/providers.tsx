/**
 * @file providers.tsx
 * @description Application wide providers (TanStack Query client configuration and context loaders).
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Initialize query client once per application mount
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // Prevent redundant fetching when user switches browser tab
            retry: (failureCount, error: any) => {
              // Do not retry 401/403/404 client errors
              if (error?.response?.status && [401, 403, 404].includes(error.response.status)) {
                return false;
              }
              return failureCount < 3; // Retry up to 3 times for server/network errors
            },
            staleTime: 5 * 60 * 1000, // Caching time: 5 minutes stale default
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
