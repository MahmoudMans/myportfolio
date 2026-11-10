import { consoleCopy } from "@/data/console";
import { vars } from "@/lib/console/style";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";

export function SocSection() {
  const copy = consoleCopy.soc;
  return (
    <section className="sec" id="soc" aria-labelledby="h-soc">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.soc} headingId="h-soc" />
        <div className="soc-grid">
          <div className="panel soc-map reveal">
            <div className="panel-head">
              <span>
                <Icon name="nodes" /> {copy.map}
              </span>
              <span className="sim-tag">{copy.simulated}</span>
            </div>
            <div className="map">
              <canvas id="map" role="img" aria-label={copy.mapLabel} />
            </div>
            <ul className="legend" aria-hidden="true">
              <li>
                <i /> {copy.legend[0]}
              </li>
              <li>
                <i className="ring" /> {copy.legend[1]}
              </li>
              <li>
                <i className="ring amber" /> {copy.legend[2]}
              </li>
              <li>
                <i className="site" /> {copy.legend[3]}
              </li>
            </ul>
          </div>
          <div className="soc-side">
            <div className="panel reveal" style={vars({ "--d": "100ms" })}>
              <div className="panel-head">
                <span>
                  <Icon name="shield" /> {copy.blocked}
                </span>
                <span className="sim-tag">{copy.simulated}</span>
              </div>
              <div className="panel-body">
                <p className="big-num" id="blocked">
                  0
                </p>
                <p className="sub">{copy.blockedSub}</p>
              </div>
            </div>
            <div className="panel reveal" style={vars({ "--d": "180ms" })}>
              <div className="panel-head">
                <span>
                  <Icon name="server" /> {copy.availability}
                </span>
                <span className="sim-tag">{copy.simulated}</span>
              </div>
              <div className="panel-body">
                <p className="big-num" id="uptime">
                  {copy.uptime}
                </p>
                <div className="upbars" id="upbars" aria-hidden="true">
                  {Array.from({ length: 30 }, (_, index) => (
                    <i key={index} className={index === 11 ? "w" : undefined} />
                  ))}
                </div>
                <p className="kv">
                  <span>{copy.mttr}</span>
                  <b id="mttr">{copy.responseTime}</b>
                </p>
              </div>
            </div>
          </div>
          <div className="panel soc-feed reveal">
            <div className="panel-head">
              <span>
                <Icon name="terminal" /> {copy.feed}
              </span>
              <span className="ok">
                <i className="pulse" /> {copy.streaming}
              </span>
            </div>
            <ol className="feed" id="feed" role="log" aria-live="off" aria-label="Simulated security events" />
          </div>
          <div className="panel soc-vec reveal" style={vars({ "--d": "100ms" })}>
            <div className="panel-head">
              <span>
                <Icon name="radar" /> {copy.vectors}
              </span>
              <span>{copy.thisSession}</span>
            </div>
            <div className="panel-body">
              <div className="vecs" id="vecs" />
              <p className="spark-head">
                <span>{copy.eps}</span>
                <b id="eps">0</b>
              </p>
              <canvas className="spark" id="spark" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
