"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * One responsive display unit. The `<ins>` is inert until something pushes onto
 * `adsbygoogle`; the queue is drained once the loader in the blog layout arrives, so
 * the push can safely happen first.
 */
export function AdUnit({ client, slot }: { client: string; slot: string }) {
  // Strict Mode runs effects twice in development, and a second push for the same
  // <ins> throws "All 'ins' elements in the DOM with class=adsbygoogle already have
  // ads in them". The ref survives that remount, so this pushes exactly once.
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // A blocked or failed ad leaves an empty box, never a broken article.
    }
  }, []);

  return (
    <aside aria-label="Advertisement" className="my-12 max-w-[68ch]">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
        Advertisement
      </p>
      {/* Height reserved up front so the article footer does not jump when the ad
          fills in. */}
      <ins
        className="adsbygoogle mt-3 block min-h-[250px]"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
