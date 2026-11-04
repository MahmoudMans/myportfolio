import { flushSync } from "react-dom";

type ViewTransitionLike = { ready: Promise<void> };
type TransitionDocument = Document & { startViewTransition?: (update: () => void) => ViewTransitionLike };

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function switchTheme(next: string, setTheme: (theme: string) => void, origin?: { x: number; y: number }): void {
  const doc = document as TransitionDocument;
  if (typeof doc.startViewTransition !== "function" || prefersReducedMotion()) {
    setTheme(next);
    return;
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = doc.startViewTransition(() => {
    flushSync(() => setTheme(next));
  });
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 520, easing: "cubic-bezier(0.25, 1, 0.5, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => undefined);
}

type NavTransition = { finished: Promise<void> };
type NavDocument = { startViewTransition?: (update: () => Promise<void>) => NavTransition };
type PendingNavigation = { finish: () => void; cover: string | null; source: HTMLElement | null; stop: (() => void) | null };

const COVER_NAME = "project-cover";
const SETTLE_TIMEOUT = 1600;

let pendingNavigation: PendingNavigation | null = null;

function completeNavigation(pending: PendingNavigation): boolean {
  if (pendingNavigation !== pending) return true;
  if (pending.cover !== null) {
    const target = document.querySelector<HTMLElement>(`[data-cover-dest="${pending.cover}"]`);
    if (target === null) return false;
    pending.source?.style.removeProperty("view-transition-name");
    target.style.setProperty("view-transition-name", COVER_NAME);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
  pending.finish();
  return true;
}

export function settleNavigation(): void {
  const pending = pendingNavigation;
  if (pending === null || completeNavigation(pending)) return;
  const observer = new MutationObserver(() => {
    if (completeNavigation(pending)) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  pending.stop = () => observer.disconnect();
}

export function startNavTransition(navigate: () => void, cover: string | null): boolean {
  const doc = document as unknown as NavDocument;
  if (typeof doc.startViewTransition !== "function" || prefersReducedMotion()) return false;
  const root = document.documentElement;
  const source = cover === null ? null : document.querySelector<HTMLElement>(`[data-cover="${cover}"]`);
  source?.style.setProperty("view-transition-name", COVER_NAME);
  root.dataset.navTransition = "true";
  const cleanup = () => {
    delete root.dataset.navTransition;
    source?.style.removeProperty("view-transition-name");
    document.querySelectorAll<HTMLElement>("[data-cover-dest]").forEach((element) => element.style.removeProperty("view-transition-name"));
  };
  try {
    const transition = doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          const pending: PendingNavigation = { finish, cover: source === null ? null : cover, source, stop: null };
          const timeout = window.setTimeout(finish, SETTLE_TIMEOUT);
          function finish() {
            window.clearTimeout(timeout);
            pending.stop?.();
            if (pendingNavigation === pending) pendingNavigation = null;
            resolve();
          }
          pendingNavigation = pending;
          navigate();
        }),
    );
    transition.finished.then(cleanup, cleanup);
  } catch {
    cleanup();
    return false;
  }
  return true;
}

export function downloadFile(href: string, fileName: string): void {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
