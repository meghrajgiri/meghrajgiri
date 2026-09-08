"use client";

import type { ClientSiteConfig } from "@/lib/client-config";
import { createContext, useContext } from "react";

/**
 * The config the browser gets.
 *
 * The shape lives in `@/lib/client-config` rather than here on purpose: the layout is a
 * server component and needs the runtime allowlist, and a value imported out of a
 * `"use client"` module arrives there as a client reference rather than the value itself.
 */
const SiteConfigContext = createContext<ClientSiteConfig | null>(null);

export function SiteConfigProvider({
  config,
  children,
}: {
  config: ClientSiteConfig;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): ClientSiteConfig {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
  }
  return ctx;
}
