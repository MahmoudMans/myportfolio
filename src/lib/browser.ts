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

export function downloadFile(href: string, fileName: string): void {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
