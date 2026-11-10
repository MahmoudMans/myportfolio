import { consoleCopy } from "@/data/console";
import { tagCounts, type CaseFile } from "@/lib/console/content";
import { Icon } from "@/components/console/icon";
import { CaseCard } from "./case-card";

export function CaseGrid({ files, search = false }: { files: CaseFile[]; search?: boolean }) {
  const copy = consoleCopy.cases;
  return (
    <div className="case-grid" data-total={files.length}>
      <div className="filters" id="filters" role="group" aria-label={copy.filterLabel}>
        <button className="filter" type="button" data-filter="All" aria-pressed="true">
          {copy.all}
          <span>{files.length}</span>
        </button>
        {tagCounts(files).map((entry) => (
          <button className="filter" type="button" data-filter={entry.tag} aria-pressed="false" key={entry.tag}>
            {entry.tag}
            <span>{entry.count}</span>
          </button>
        ))}
      </div>
      {search ? (
        <div className="case-search">
          <label className="inp" htmlFor="caseSearch">
            <span aria-hidden="true">grep&gt;</span>
            <input id="caseSearch" type="search" placeholder={copy.searchPlaceholder} aria-label={copy.searchLabel} autoComplete="off" spellCheck={false} />
          </label>
          <button className="chip stack-chip" type="button" id="stackChip" hidden>
            <span>
              {copy.stackFilter} <b id="stackName" />
            </span>
            <Icon name="close" />
            <span className="sr-only">{copy.clear}</span>
          </button>
          <p className="case-count mono" aria-live="polite">
            <b id="caseCount">{files.length}</b> / {files.length} {copy.shown}
          </p>
        </div>
      ) : null}
      <div className="cases" id="cases">
        {files.map((file, position) => (
          <CaseCard key={file.slug} file={file} delay={(position % 3) * 80} />
        ))}
      </div>
      <p className="cases-empty mono" id="casesEmpty" hidden>
        {copy.empty}
      </p>
    </div>
  );
}
