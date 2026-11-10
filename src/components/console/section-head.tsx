import type { ReactNode } from "react";
import type { ConsoleSectionCopy } from "@/data/console";
import { PROMPT } from "@/lib/console/content";

interface SectionHeadProps {
  copy: ConsoleSectionCopy;
  headingId: string;
  level?: 1 | 2;
  children?: ReactNode;
}

export function Command({ cmd }: { cmd: string }) {
  return (
    <p className="cmd" data-cmd={cmd}>
      <span className="ps1">{PROMPT}</span> <span className="cmd-text">{cmd}</span>
    </p>
  );
}

export function SectionHead({ copy, headingId, level = 2, children }: SectionHeadProps) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <header className="sec-head">
      <Command cmd={copy.cmd} />
      <Heading className="glitch reveal" id={headingId} data-text={copy.title}>
        {copy.title}
      </Heading>
      {copy.lede ? <p className="lede reveal">{copy.lede}</p> : null}
      {children}
    </header>
  );
}
