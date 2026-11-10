"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { consoleCopy } from "@/data/console";
import { Icon } from "./icon";

interface RailProps {
  home: string;
  sections: { id: string; label: string }[];
  cvFileName: string;
}

export function Rail({ home, sections, cvFileName }: RailProps) {
  const pathname = usePathname() ?? "/";
  const copy = consoleCopy.rail;
  const files = [
    { href: "/projects", label: copy.caseFiles, current: pathname.startsWith("/projects") },
    { href: "/cv", label: copy.cv, current: pathname === "/cv" },
    { href: "/posts", label: copy.posts, current: pathname === "/posts" },
  ];

  return (
    <>
      <nav className="rail" id="rail" aria-label="Sections">
        <div>
          <p className="tree-root">{home}</p>
          <ul className="tree" id="tree">
            {sections.map((section) => (
              <li key={section.id}>
                <Link href={`/#${section.id}`} data-sec={section.id}>
                  {section.id}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="tree-root">{copy.files}</p>
          <ul className="tree">
            {files.map((file) => (
              <li key={file.href}>
                <Link href={file.href} aria-current={file.current ? "page" : undefined}>
                  {file.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="/cv.pdf" download={cvFileName}>
                {copy.cvPdf}
              </a>
            </li>
          </ul>
        </div>
        <dl className="session" aria-label="Session details">
          <div>
            <dt>{copy.session}</dt>
            <dd id="sessId">0x0000</dd>
          </div>
          <div>
            <dt>{copy.cipher}</dt>
            <dd>AES-256-GCM</dd>
          </div>
          <div>
            <dt>{copy.uptime}</dt>
            <dd id="sessUp">00:00:00</dd>
          </div>
          <div>
            <dt>{copy.mode}</dt>
            <dd id="sessMode">{copy.blueTeam}</dd>
          </div>
        </dl>
        <button className="btn rail-term" type="button" data-open-term="">
          <Icon name="terminal" /> {copy.terminal} <kbd>Ctrl + `</kbd>
        </button>
      </nav>
      <div className="rail-scrim" id="railScrim" hidden />
    </>
  );
}
