import Link from "next/link";
import { consoleCopy } from "@/data/console";
import { HANDLE } from "@/lib/console/content";
import { Icon } from "./icon";

export function Atmosphere() {
  return (
    <>
      <div className="fx fx-grid" aria-hidden="true" />
      <div className="fx fx-scan" aria-hidden="true" />
      <div className="fx fx-noise" aria-hidden="true" />
    </>
  );
}

export function BootScreen() {
  return (
    <div className="boot" id="boot" role="dialog" aria-modal="true" aria-label="Boot sequence">
      <div className="boot-inner">
        <p className="boot-head" id="bootHead" />
        <ol className="boot-lines" id="bootLines" />
        <p className="boot-prog" id="bootProg" aria-hidden="true" />
        <p className="boot-grant" id="bootGrant">
          ACCESS GRANTED
        </p>
      </div>
      <button className="btn boot-skip" id="bootSkip" type="button">
        Skip intro <kbd>Esc</kbd>
      </button>
    </div>
  );
}

export function StatusStrip() {
  return (
    <header className="strip">
      <button
        className="strip-menu"
        id="menuBtn"
        type="button"
        aria-label={consoleCopy.rail.openMenu}
        aria-expanded="false"
        aria-controls="rail"
      >
        <Icon name="tree" />
      </button>
      <Link className="strip-cwd" href="/" title={consoleCopy.backToTop}>
        <span id="cwdUser">visitor@{HANDLE}</span>:<b id="cwdPath">~</b>
      </Link>
      <div className="strip-right">
        <span className="strip-flag" id="stripFlag" hidden>
          <Icon name="flag" /> flag captured
        </span>
        <span className="strip-level">
          <i className="pulse" />
          <span id="threatLevel">threat level: low</span>
        </span>
        <span className="strip-scan" id="scanLabel" aria-hidden="true">
          Scanning... 0%
        </span>
      </div>
      <span className="strip-bar" id="scanBar" aria-hidden="true" />
    </header>
  );
}

export function TerminalWindow() {
  return (
    <>
      <button className="term-fab" id="termFab" type="button" aria-label="Open terminal" aria-controls="term" aria-expanded="false">
        &gt;_
      </button>
      <section className="term" id="term" role="dialog" aria-label="Interactive terminal" hidden>
        <div className="term-bar">
          <span className="term-title">
            <b id="termTitle">visitor@{HANDLE}</b>: <span id="termCwd">~</span>
          </span>
          <div className="term-btns">
            <button type="button" id="termClose" aria-label="Close terminal">
              <Icon name="close" />
            </button>
          </div>
        </div>
        <div className="term-out" id="termOut" role="log" aria-live="polite" aria-label="Terminal output" tabIndex={0} />
        <div className="term-chips" id="termChips" role="group" aria-label="Command suggestions" />
        <form className="term-in" id="termForm" autoComplete="off">
          <label className="term-ps1" htmlFor="termInput" id="termPs1">
            $
          </label>
          <div className="term-field">
            <input
              id="termInput"
              type="text"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="go"
              aria-label="Terminal command"
            />
            <span className="term-cursor" id="termCursor" aria-hidden="true" />
          </div>
        </form>
      </section>
    </>
  );
}

export function ReportDialog() {
  const copy = consoleCopy.report;
  return (
    <dialog className="report" id="report" aria-labelledby="reportTitle">
      <div className="report-tlp">
        <b>{copy.tlp}</b>
        <span>{copy.tlpNote}</span>
      </div>
      <div className="report-head">
        <div>
          <p id="reportMeta" />
          <h3 id="reportTitle" />
        </div>
        <button className="report-close" type="button" id="reportClose" aria-label={copy.close}>
          <Icon name="close" />
        </button>
      </div>
      <div className="report-body" id="reportBody" />
      <div className="report-foot">
        <span id="reportFoot" />
        <div className="report-actions" id="reportActions" />
      </div>
    </dialog>
  );
}

export function ViewerDialog() {
  return (
    <dialog className="report viewer" id="viewer" aria-labelledby="viewerCaption">
      <div className="report-head viewer-head">
        <div>
          <p id="viewerCount" />
          <h3 id="viewerCaption" />
        </div>
        <button className="report-close" type="button" id="viewerClose" aria-label="Close screenshot">
          <Icon name="close" />
        </button>
      </div>
      <div className="viewer-stage" id="viewerStage">
        <img id="viewerImage" alt="" />
      </div>
      <div className="report-foot viewer-foot">
        <button className="btn" type="button" id="viewerPrev" aria-label="Previous screenshot">
          <Icon name="prev" /> Prev
        </button>
        <a className="btn" id="viewerOpen" target="_blank" rel="noopener noreferrer">
          <Icon name="external" /> Full size
        </a>
        <button className="btn" type="button" id="viewerNext" aria-label="Next screenshot">
          Next <Icon name="forward" />
        </button>
      </div>
    </dialog>
  );
}

export function Overlays() {
  return (
    <>
      <div className="toast" id="toast" role="status" aria-live="polite" />
      <canvas id="confetti" aria-hidden="true" hidden />
      <div className="cur cur-ring" id="curRing" aria-hidden="true">
        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="9.5" opacity=".5" />
          <path d="M18 2v8M18 26v8M2 18h8M26 18h8" />
        </svg>
      </div>
      <div className="cur cur-dot" id="curDot" aria-hidden="true" />
    </>
  );
}
