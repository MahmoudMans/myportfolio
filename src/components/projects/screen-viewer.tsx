"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Khatam } from "@/components/ui/khatam";
import { useDialog } from "@/components/ui/use-dialog";
import { ui } from "@/data/ui";
import { cn } from "@/lib/utils";

interface Screen {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

interface ViewerState {
  screens: Screen[];
  index: number;
  move: "open" | "next" | "previous";
  zoomed: boolean;
  morph: boolean;
  session: number;
}

interface Box {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const SCREEN_LINK = "a[data-screen]";
const SWIPE_DISTANCE = 56;
const CLICK_GUARD_MS = 700;
const MORPH_MS = 420;

function isPhone(screen: Screen): boolean {
  return screen.width <= 1300 && screen.height > screen.width * 1.8;
}

function pixelWidth(screen: Screen): number {
  return Math.min(screen.width, isPhone(screen) ? 800 : 1600);
}

function opensZoomed(screen: Screen): boolean {
  if (isPhone(screen)) return false;
  const width = window.innerWidth - (window.innerWidth >= 1024 ? 184 : 24);
  const height = window.innerHeight - 170;
  const fitted = Math.min(width, (height * screen.width) / screen.height);
  return fitted < 0.55 * Math.min(width, pixelWidth(screen));
}

function readScreen(link: HTMLAnchorElement): Screen {
  const image = link.querySelector("img");
  const caption = link.closest("figure")?.querySelector("figcaption")?.textContent ?? "";
  const width = Number(link.dataset.width);
  const height = Number(link.dataset.height);
  return {
    src: link.getAttribute("href") ?? "",
    alt: image?.alt ?? "",
    caption: caption.trim(),
    width: width > 0 ? width : 1600,
    height: height > 0 ? height : 1000,
  };
}

function isOnScreen(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width > 1 && rect.height > 1 && rect.bottom > 0 && rect.top < window.innerHeight;
}

function objectPosition(value: string): [number, number] {
  const [x, y] = value.split(" ").map((part) => (part.endsWith("%") ? Number.parseFloat(part) / 100 : 0.5));
  return [x ?? 0.5, y ?? 0.5];
}

function radiusOf(element: Element): number {
  return Number.parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
}

function inset(box: Box, radius: number): string {
  return `inset(${box.top}px ${box.right}px ${box.bottom}px ${box.left}px round ${radius}px)`;
}

function morph(frame: HTMLElement, thumb: HTMLImageElement, image: HTMLImageElement, stage: HTMLElement, host: HTMLElement) {
  const from = thumb.getBoundingClientRect();
  const to = image.getBoundingClientRect();
  const view = stage.getBoundingClientRect();
  if (to.width < 2 || to.height < 2) return undefined;
  const fit = getComputedStyle(thumb);
  const [alignX, alignY] = objectPosition(fit.objectPosition);
  const scale = fit.objectFit === "cover" ? Math.max(from.width / to.width, from.height / to.height) : from.width / to.width;
  const x = from.left + (from.width - to.width * scale) * alignX;
  const y = from.top + (from.height - to.height * scale) * alignY;
  const start: Box = {
    top: (from.top - y) / scale,
    right: to.width - (from.right - x) / scale,
    bottom: to.height - (from.bottom - y) / scale,
    left: (from.left - x) / scale,
  };
  const end: Box = { top: Math.max(0, view.top - to.top), right: 0, bottom: Math.max(0, to.bottom - view.bottom), left: 0 };
  const ghost = document.createElement("img");
  ghost.src = image.currentSrc || image.src;
  ghost.alt = "";
  ghost.className = "viewer-ghost";
  ghost.setAttribute("aria-hidden", "true");
  ghost.style.left = `${to.left}px`;
  ghost.style.top = `${to.top}px`;
  ghost.style.width = `${to.width}px`;
  ghost.style.height = `${to.height}px`;
  host.append(ghost);
  image.style.visibility = "hidden";
  const animation = ghost.animate(
    [
      { transform: `translate(${x - to.left}px, ${y - to.top}px) scale(${scale})`, clipPath: inset(start, radiusOf(frame) / scale) },
      { transform: "none", clipPath: inset(end, radiusOf(image)) },
    ],
    { duration: MORPH_MS, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" },
  );
  animation.pause();
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    image.style.visibility = "";
    ghost.remove();
  };
  const play = () => {
    if (done === false) animation.play();
  };
  const timer = window.setTimeout(play, 240);
  ghost.decode().then(
    () => {
      window.clearTimeout(timer);
      play();
    },
    () => undefined,
  );
  animation.finished.then(finish, finish);
  return () => {
    window.clearTimeout(timer);
    animation.cancel();
    finish();
  };
}

export function ScreenViewer({ title }: { title: string }) {
  const [state, setState] = useState<ViewerState | null>(null);
  const [loadedSrc, setLoadedSrc] = useState("");
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openedAtRef = useRef(0);
  const swipeRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const swipedRef = useRef(false);
  const zoomPointRef = useRef<{ x: number; y: number; clientX: number; clientY: number } | null>(null);

  const close = useCallback(() => {
    setState(null);
    const trigger = triggerRef.current;
    triggerRef.current = null;
    if (trigger !== null && trigger.isConnected) trigger.focus({ preventScroll: true });
  }, []);
  const dialogRef = useDialog(state !== null, close);

  const go = useCallback((step: number) => {
    setState((current) => {
      if (current === null) return current;
      const index = current.index + step;
      const target = current.screens[index];
      if (target === undefined) return current;
      return { ...current, index, move: step > 0 ? "next" : "previous", zoomed: opensZoomed(target), morph: false };
    });
  }, []);

  const toggleZoom = useCallback(() => {
    setState((current) => (current === null ? current : { ...current, zoomed: current.zoomed === false }));
  }, []);

  useEffect(() => {
    document.querySelectorAll(SCREEN_LINK).forEach((link) => link.setAttribute("aria-haspopup", "dialog"));
    let session = 0;
    function handleClick(event: globalThis.MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      const link = target instanceof Element ? target.closest<HTMLAnchorElement>(SCREEN_LINK) : null;
      if (link === null) return;
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(SCREEN_LINK));
      const index = links.indexOf(link);
      const screens = links.map(readScreen);
      const first = screens[index];
      if (first === undefined) return;
      event.preventDefault();
      const thumb = link.querySelector("img");
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      session += 1;
      triggerRef.current = link;
      openedAtRef.current = performance.now();
      setState({
        screens,
        index,
        move: "open",
        zoomed: opensZoomed(first),
        morph: thumb !== null && calm === false && isOnScreen(thumb),
        session,
      });
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const index = state?.index ?? -1;
  const screens = state?.screens;
  const session = state?.session ?? 0;
  const zoomed = state?.zoomed ?? false;
  const morphing = state !== null && state.morph && state.move === "open";

  useEffect(() => {
    if (session > 0) closeRef.current?.focus();
  }, [session]);

  useEffect(() => {
    if (screens === undefined) return;
    for (const offset of [-1, 1]) {
      const neighbour = screens[index + offset];
      if (neighbour === undefined) continue;
      const preload = new window.Image();
      preload.decoding = "async";
      preload.src = neighbour.src;
    }
  }, [index, screens]);

  useLayoutEffect(() => {
    const point = zoomPointRef.current;
    zoomPointRef.current = null;
    const stage = stageRef.current;
    const image = imageRef.current;
    if (stage === null) return;
    if (point === null || image === null || zoomed === false) {
      stage.scrollTo({ top: 0, left: 0 });
      return;
    }
    const rect = image.getBoundingClientRect();
    stage.scrollTo({
      top: stage.scrollTop + rect.top + rect.height * point.y - point.clientY,
      left: stage.scrollLeft + rect.left + rect.width * point.x - point.clientX,
    });
  }, [zoomed, index, session]);

  useEffect(() => {
    if (morphing === false) return;
    const frame = triggerRef.current;
    const thumb = frame?.querySelector("img") ?? null;
    const image = imageRef.current;
    const stage = stageRef.current;
    const host = dialogRef.current;
    if (frame === null || thumb === null || image === null || stage === null || host === null) return;
    return morph(frame, thumb, image, stage, host);
  }, [morphing, session, index, dialogRef]);

  function guarded(): boolean {
    if (swipedRef.current || performance.now() - openedAtRef.current < CLICK_GUARD_MS) {
      swipedRef.current = false;
      return true;
    }
    return false;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      go(event.key === "ArrowRight" ? 1 : -1);
      return;
    }
    const stage = stageRef.current;
    if (stage === null || stage.scrollHeight <= stage.clientHeight) return;
    const page = Math.round(stage.clientHeight * 0.85);
    const steps: Record<string, number> = { ArrowDown: 96, ArrowUp: -96, PageDown: page, PageUp: -page };
    const step = steps[event.key];
    if (step === undefined) return;
    event.preventDefault();
    stage.scrollBy({ top: step });
  }

  function handleImageClick(event: MouseEvent<HTMLImageElement>) {
    event.stopPropagation();
    if (guarded()) return;
    if (zoomed === false) {
      const rect = event.currentTarget.getBoundingClientRect();
      zoomPointRef.current = {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height,
        clientX: event.clientX,
        clientY: event.clientY,
      };
    }
    toggleZoom();
  }

  function handleStageClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || guarded()) return;
    dialogRef.current?.close();
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    swipedRef.current = false;
    if (event.isPrimary === false) {
      swipeRef.current = null;
      return;
    }
    swipeRef.current = event.pointerType === "mouse" || zoomed ? null : { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (start === null || start.id !== event.pointerId || (window.visualViewport?.scale ?? 1) > 1.01) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    swipedRef.current = true;
    go(dx < 0 ? 1 : -1);
  }

  const screen = state === null ? undefined : state.screens[state.index];
  const count = screens?.length ?? 0;

  return (
    <dialog ref={dialogRef} aria-label={`${ui.viewer.label}, ${title}`} className="viewer" onKeyDown={handleKeyDown}>
      {state !== null && screen !== undefined ? (
        <>
          <div className="viewer-bar">
            <p className="viewer-title">{title}</p>
            <button
              type="button"
              className="viewer-button"
              aria-label={state.zoomed ? ui.viewer.zoomOut : ui.viewer.zoomIn}
              onClick={toggleZoom}
            >
              {state.zoomed ? <ZoomOut aria-hidden="true" className="size-5" /> : <ZoomIn aria-hidden="true" className="size-5" />}
            </button>
            <button ref={closeRef} type="button" className="viewer-button" aria-label={ui.viewer.close} onClick={() => dialogRef.current?.close()}>
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <div
            ref={stageRef}
            className={cn("viewer-stage", state.zoomed && "viewer-stage-zoomed")}
            onClick={handleStageClick}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              swipeRef.current = null;
            }}
          >
            <Image
              key={screen.src}
              ref={imageRef}
              src={screen.src}
              alt={screen.alt}
              width={screen.width}
              height={screen.height}
              unoptimized
              loading="eager"
              draggable={false}
              onLoad={() => setLoadedSrc(screen.src)}
              onError={() => setLoadedSrc(screen.src)}
              onClick={handleImageClick}
              className={cn(
                "viewer-image",
                state.move === "open" && state.morph === false && "viewer-image-open",
                state.move === "next" && "viewer-image-next",
                state.move === "previous" && "viewer-image-previous",
              )}
              style={{ "--ratio": screen.width / screen.height, "--max": `${pixelWidth(screen)}px` } as CSSProperties}
            />
          </div>
          {loadedSrc === screen.src ? null : (
            <span className="viewer-loading" aria-hidden="true">
              <Khatam className="viewer-loading-star" />
            </span>
          )}
          <div className="viewer-foot">
            {count > 1 ? (
              <button
                type="button"
                className="viewer-button viewer-prev"
                aria-label={ui.viewer.previous}
                aria-disabled={state.index === 0}
                onClick={() => go(-1)}
              >
                <ChevronLeft aria-hidden="true" className="size-5" />
              </button>
            ) : null}
            <div className="viewer-caption" aria-live="polite" aria-atomic="true">
              {count > 1 ? (
                <p className="viewer-count">
                  <span className="viewer-count-current">{state.index + 1}</span> {ui.viewer.of} {count}
                </p>
              ) : null}
              <p className="viewer-caption-text">{screen.caption}</p>
            </div>
            {count > 1 ? (
              <button
                type="button"
                className="viewer-button viewer-next"
                aria-label={ui.viewer.next}
                aria-disabled={state.index === count - 1}
                onClick={() => go(1)}
              >
                <ChevronRight aria-hidden="true" className="size-5" />
              </button>
            ) : null}
          </div>
        </>
      ) : null}
    </dialog>
  );
}
