"use client";

import { SWRConfig } from "swr";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 60 * 1000, // 1分間はキャッシュを有効とみなす
        errorRetryCount: 1,
      }}
    >
      {children}
    </SWRConfig>
  );
}
