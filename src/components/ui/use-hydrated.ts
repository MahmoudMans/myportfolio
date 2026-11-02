"use client";

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => undefined;
}

export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

function subscribePlatform(): () => void {
  return () => undefined;
}

function isApplePlatform(): boolean {
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);
}

export function useIsApple(): boolean {
  return useSyncExternalStore(subscribePlatform, isApplePlatform, () => false);
}
