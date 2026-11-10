import Link from "next/link";
import { Icon } from "@/components/console/icon";
import { Command } from "@/components/console/section-head";
import { consoleCopy } from "@/data/console";

export default function NotFound() {
  const copy = consoleCopy.notFound;
  return (
    <section className="sec page-sec notfound" aria-labelledby="h-404">
      <div className="wrap">
        <header className="sec-head">
          <Command cmd={`${copy.cmd} ./requested-page`} />
          <h1 className="glitch reveal" id="h-404" data-text={copy.title}>
            {copy.title}
          </h1>
        </header>
        <div className="panel nf-term reveal">
          <div className="panel-head">
            <span>
              <Icon name="terminal" /> bash
            </span>
            <span className="err">exit 1</span>
          </div>
          <div className="panel-body">
            <p className="err mono">
              bash: {copy.cmd}: <span id="nfPath">./requested-page</span>: {copy.error}
            </p>
            <p className="nf-body">{copy.body}</p>
            <ul className="nf-links">
              <li>
                <Link className="btn btn-primary" href="/">
                  <Icon name="back" /> {copy.home}
                </Link>
              </li>
              <li>
                <Link className="btn" href="/projects">
                  <Icon name="file" /> {copy.projects}
                </Link>
              </li>
              <li>
                <Link className="btn" href="/cv">
                  <Icon name="user" /> {copy.cv}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
