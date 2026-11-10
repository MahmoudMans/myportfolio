import Link from "next/link";
import { consoleCopy } from "@/data/console";
import type { CaseFile } from "@/lib/console/content";
import { vars } from "@/lib/console/style";
import { Icon } from "@/components/console/icon";

const CHIP_LIMIT = 5;

export function CaseCard({ file, delay = 0, heading = "h3" }: { file: CaseFile; delay?: number; heading?: "h2" | "h3" }) {
  const Heading = heading;
  const extra = file.tech.length - CHIP_LIMIT;
  return (
    <article
      className="case reveal"
      data-cat={file.tags.join(" ")}
      data-stack={file.tech.map((item) => item.toLowerCase()).join("|")}
      data-search={file.search}
      style={vars({ "--d": `${delay}ms` })}
    >
      <div className="case-top">
        <span>CASE {file.no}</span>
        <span className={`status ${file.statusClass}`}>{file.status}</span>
      </div>
      <Heading>{file.title}</Heading>
      <p>{file.summary}</p>
      <ul className="chips">
        {file.tech.slice(0, CHIP_LIMIT).map((item) => (
          <li className="chip" key={item}>
            {item}
          </li>
        ))}
        {extra > 0 ? <li className="chip chip-more">+{extra}</li> : null}
      </ul>
      <div className="case-foot">
        <Link className="case-page" href={`/projects/${file.slug}`}>
          {file.slug}.md
        </Link>
        <button
          className="case-open"
          type="button"
          data-open-case={file.index}
          aria-label={`Open case file ${file.no}: ${file.title}`}
        >
          <Icon name="file" /> {consoleCopy.cases.open}
        </button>
      </div>
    </article>
  );
}
