import { consoleCopy } from "@/data/console";
import { projects } from "@/data/projects";
import { auditRows, radarAxes, toolGroups, type RadarAxis } from "@/lib/console/content";
import { vars } from "@/lib/console/style";
import { Icon } from "@/components/console/icon";
import { SectionHead } from "@/components/console/section-head";

function Radar({ axes }: { axes: RadarAxis[] }) {
  const count = axes.length;
  const cx = 192;
  const cy = 150;
  const radius = 98;
  const angle = (index: number) => -Math.PI / 2 + (index * 2 * Math.PI) / count;
  const point = (index: number, r: number): [number, number] => [cx + Math.cos(angle(index)) * r, cy + Math.sin(angle(index)) * r];
  const pair = ([x, y]: [number, number]) => `${x.toFixed(1)},${y.toFixed(1)}`;
  const ring = (r: number) => axes.map((_, index) => pair(point(index, r))).join(" ");
  const valueRadius = (axis: RadarAxis) => (radius * Math.min(100, Math.max(0, axis.value))) / 100;
  const description = axes.map((axis) => `${axis.axis} ${axis.count}`).join(", ");

  return (
    <svg
      className="radar"
      id="radar"
      viewBox="0 0 384 304"
      style={vars({ "--cx": `${cx}px`, "--cy": `${cy}px` })}
      role="img"
      aria-label={`Tools listed per area. ${description}`}
    >
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} className="ring" points={ring(radius * k)} />
      ))}
      {axes.map((axis, index) => {
        const [x, y] = point(index, radius);
        return <line key={axis.axis} className="spoke" x1={cx} y1={cy} x2={x.toFixed(1)} y2={y.toFixed(1)} />;
      })}
      <polygon className="shape" points={axes.map((axis, index) => pair(point(index, valueRadius(axis)))).join(" ")} />
      {axes.map((axis, index) => {
        const [x, y] = point(index, valueRadius(axis));
        return <circle key={axis.axis} className="pt" cx={x.toFixed(1)} cy={y.toFixed(1)} r="3" />;
      })}
      {axes.map((axis, index) => {
        const cos = Math.cos(angle(index));
        const sin = Math.sin(angle(index));
        const [x, y] = point(index, radius + 16);
        const anchor = Math.abs(cos) < 0.2 ? "middle" : cos > 0 ? "start" : "end";
        const y0 = y + (sin < -0.5 ? -14 : sin > 0.5 ? 12 : -2);
        return (
          <text key={axis.axis} x={x.toFixed(1)} y={y0.toFixed(1)} textAnchor={anchor}>
            {axis.axis}
            <tspan className="val" x={x.toFixed(1)} dy="13">
              {axis.count}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}

export function SkillsSection() {
  const copy = consoleCopy.skills;
  const rows = auditRows();
  const groups = toolGroups();
  const installed = groups.reduce((total, group) => total + group.items.length, 0);
  return (
    <section className="sec" id="skills" aria-labelledby="h-skills">
      <div className="wrap">
        <SectionHead copy={consoleCopy.sections.skills} headingId="h-skills" />
        <div className="audit-grid">
          <div className="panel reveal">
            <div className="panel-head">
              <span>
                <Icon name="shield" /> {copy.report}
              </span>
              <span id="auditState">{copy.queued}</span>
            </div>
            <ol id="auditList">
              {rows.map((row) => (
                <li key={row.name} className="audit-row" data-level={row.share} style={vars({ "--v": (row.share / 100).toFixed(3) })}>
                  <span className="audit-tag" aria-hidden="true">
                    [ -- ]
                  </span>
                  <div className="audit-name">
                    <span>{row.name}</span>
                    <div className="bar" role="img" aria-label={`${row.name}: used in ${row.count} of ${projects.length} projects`}>
                      <i />
                    </div>
                  </div>
                  <span className="audit-pct" aria-hidden="true">
                    --
                  </span>
                  <span className="audit-grade" aria-hidden="true">
                    {row.count} {(row.count === 1 ? copy.projectWord : copy.projectsWord).toUpperCase()}
                  </span>
                </li>
              ))}
            </ol>
            <p className="audit-sum" id="auditSum" aria-live="polite" />
          </div>
          <div className="audit-side">
            <div className="panel reveal" style={vars({ "--d": "120ms" })}>
              <div className="panel-head">
                <span>
                  <Icon name="radar" /> {copy.radar}
                </span>
              </div>
              <div className="panel-body">
                <Radar axes={radarAxes()} />
                <p className="radar-note">{copy.radarNote}</p>
              </div>
            </div>
            <div className="panel reveal" style={vars({ "--d": "200ms" })}>
              <div className="panel-head">
                <span>
                  <Icon name="server" /> {copy.toolchain}
                </span>
                <span>
                  {installed} {copy.installed}
                </span>
              </div>
              <div className="panel-body tool-groups">
                {groups.map((group) => (
                  <div className="tool-group" key={group.id}>
                    <p className="tool-title">{group.title}</p>
                    <ul className="chips">
                      {group.items.map((item) => (
                        <li className="chip" key={item}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
