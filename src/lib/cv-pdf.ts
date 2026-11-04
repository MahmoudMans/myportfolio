import { PDFDocument, PDFName, PDFString, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import { certifications } from "@/data/certifications";
import { communityRoles } from "@/data/community";
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { languages } from "@/data/languages";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { skillGroups } from "@/data/skills";
import { ui } from "@/data/ui";
import { formatRange, formatYearMonth } from "@/lib/utils";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 50;
const MARGIN_TOP = 44;
const MARGIN_BOTTOM = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const INK = rgb(0.055, 0.106, 0.18);
const MUTED = rgb(0.263, 0.322, 0.412);
const ACCENT = rgb(0.078, 0.314, 0.8);
const RULE = rgb(0.84, 0.87, 0.92);

const WIN_ANSI_EXTRAS = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";

export function toWinAnsi(text: string): string {
  const replaced = text
    .replace(/[‐-‒−]/g, "-")
    .replace(/[   ]/g, " ")
    .replace(/→/g, "->")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=");
  let result = "";
  for (const char of replaced) {
    const code = char.codePointAt(0) ?? 0;
    const printable = (code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff);
    if (printable || WIN_ANSI_EXTRAS.includes(char)) result += char;
  }
  return result;
}

interface Fonts {
  regular: PDFFont;
  bold: PDFFont;
}

interface TextOptions {
  font?: PDFFont;
  size?: number;
  color?: RGB;
  indent?: number;
  lineHeight?: number;
  gapAfter?: number;
}

class CvWriter {
  private readonly doc: PDFDocument;
  private readonly fonts: Fonts;
  private page: PDFPage;
  private y: number;

  constructor(doc: PDFDocument, fonts: Fonts) {
    this.doc = doc;
    this.fonts = fonts;
    this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN_TOP;
  }

  private newPage(): void {
    this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN_TOP;
  }

  ensure(height: number): void {
    if (this.y - height < MARGIN_BOTTOM) this.newPage();
  }

  space(amount: number): void {
    this.y -= amount;
  }

  wrap(text: string, font: PDFFont, size: number, width: number): string[] {
    const words = toWinAnsi(text).split(/\s+/).filter((word) => word.length > 0);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const candidate = line.length === 0 ? word : `${line} ${word}`;
      if (font.widthOfTextAtSize(candidate, size) <= width || line.length === 0) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line.length > 0) lines.push(line);
    return lines;
  }

  paragraph(text: string, options: TextOptions = {}): void {
    const font = options.font ?? this.fonts.regular;
    const size = options.size ?? 9.5;
    const indent = options.indent ?? 0;
    const lineHeight = options.lineHeight ?? size * 1.42;
    const lines = this.wrap(text, font, size, CONTENT_WIDTH - indent);
    for (const line of lines) {
      this.ensure(lineHeight);
      this.y -= lineHeight;
      this.page.drawText(line, { x: MARGIN_X + indent, y: this.y + (lineHeight - size) / 2, size, font, color: options.color ?? INK });
    }
    this.y -= options.gapAfter ?? 0;
  }

  section(title: string): void {
    this.ensure(48);
    this.y -= 21;
    this.page.drawText(toWinAnsi(title), { x: MARGIN_X, y: this.y, size: 11, font: this.fonts.bold, color: ACCENT });
    this.y -= 5;
    this.page.drawLine({ start: { x: MARGIN_X, y: this.y }, end: { x: PAGE_WIDTH - MARGIN_X, y: this.y }, thickness: 0.6, color: RULE });
    this.y -= 1;
  }

  entry(title: string, right: string, subtitle?: string): void {
    const size = 10.5;
    const rightSize = 9;
    const rightText = toWinAnsi(right);
    const rightWidth = this.fonts.regular.widthOfTextAtSize(rightText, rightSize);
    const titleLines = this.wrap(title, this.fonts.bold, size, CONTENT_WIDTH - rightWidth - 16);
    this.ensure(size * 1.4 * titleLines.length + (subtitle ? 14 : 0) + 24);
    this.y -= 5;
    titleLines.forEach((line, index) => {
      this.y -= size * 1.32;
      this.page.drawText(line, { x: MARGIN_X, y: this.y, size, font: this.fonts.bold, color: INK });
      if (index === 0 && rightText.length > 0) {
        this.page.drawText(rightText, { x: PAGE_WIDTH - MARGIN_X - rightWidth, y: this.y, size: rightSize, font: this.fonts.regular, color: MUTED });
      }
    });
    if (subtitle) {
      this.paragraph(subtitle, { size: 9, color: MUTED, lineHeight: 12 });
    }
  }

  project(title: string, href: string, summary: string, details: string): void {
    const size = 10.5;
    const linkSize = 8.5;
    const summarySize = 9.2;
    const summaryLine = 12.4;
    const detailSize = 8.3;
    const detailLine = 11;
    const linkText = toWinAnsi(ui.cv.caseStudy);
    const linkWidth = this.fonts.regular.widthOfTextAtSize(linkText, linkSize);
    const summaryLines = this.wrap(summary, this.fonts.regular, summarySize, CONTENT_WIDTH).length;
    const detailLines = this.wrap(details, this.fonts.regular, detailSize, CONTENT_WIDTH).length;
    this.ensure(5 + size * 1.32 + summaryLines * summaryLine + detailLines * detailLine + 2);
    this.y -= 5;
    this.y -= size * 1.32;
    this.page.drawText(toWinAnsi(title), { x: MARGIN_X, y: this.y, size, font: this.fonts.bold, color: INK });
    const linkX = PAGE_WIDTH - MARGIN_X - linkWidth;
    this.page.drawText(linkText, { x: linkX, y: this.y, size: linkSize, font: this.fonts.regular, color: ACCENT });
    this.link(href, linkX, this.y - 2, linkWidth, linkSize + 4);
    this.paragraph(summary, { size: summarySize, lineHeight: summaryLine });
    this.paragraph(details, { size: detailSize, color: MUTED, lineHeight: detailLine });
  }

  role(title: string, detail: string, right: string, joiner = " at "): void {
    const size = 10;
    const rightSize = 9;
    const titleText = toWinAnsi(title);
    const detailText = toWinAnsi(`${joiner}${detail}`);
    const rightText = toWinAnsi(right);
    const titleWidth = this.fonts.bold.widthOfTextAtSize(titleText, size);
    const detailWidth = this.fonts.regular.widthOfTextAtSize(detailText, size);
    const rightWidth = this.fonts.regular.widthOfTextAtSize(rightText, rightSize);
    if (titleWidth + detailWidth + rightWidth + 16 > CONTENT_WIDTH) {
      this.entry(title, right, detail);
      return;
    }
    this.ensure(22);
    this.y -= 5;
    this.y -= size * 1.3;
    this.page.drawText(titleText, { x: MARGIN_X, y: this.y, size, font: this.fonts.bold, color: INK });
    this.page.drawText(detailText, { x: MARGIN_X + titleWidth, y: this.y, size, font: this.fonts.regular, color: INK });
    this.page.drawText(rightText, { x: PAGE_WIDTH - MARGIN_X - rightWidth, y: this.y, size: rightSize, font: this.fonts.regular, color: MUTED });
  }

  inlineLinks(items: { label: string; href?: string }[], size: number): void {
    const separator = "   ";
    const font = this.fonts.regular;
    const lineHeight = size * 1.5;
    this.ensure(lineHeight);
    this.y -= lineHeight;
    let x = MARGIN_X;
    for (const item of items) {
      const label = toWinAnsi(item.label);
      const width = font.widthOfTextAtSize(label, size);
      if (x + width > PAGE_WIDTH - MARGIN_X) {
        this.y -= lineHeight;
        x = MARGIN_X;
      }
      this.page.drawText(label, { x, y: this.y, size, font, color: item.href ? ACCENT : MUTED });
      if (item.href) this.link(item.href, x, this.y - 2, width, size + 4);
      x += width + font.widthOfTextAtSize(separator, size);
    }
  }

  link(url: string, x: number, y: number, width: number, height: number): void {
    const annotation = this.doc.context.register(
      this.doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, y, x + width, y + height],
        Border: [0, 0, 0],
        A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
      }),
    );
    const existing = this.page.node.lookup(PDFName.of("Annots"));
    if (existing === undefined) {
      this.page.node.set(PDFName.of("Annots"), this.doc.context.obj([annotation]));
    } else {
      this.page.node.addAnnot(annotation);
    }
  }

  header(): void {
    this.page.drawText(toWinAnsi(profile.name), { x: MARGIN_X, y: this.y - 22, size: 24, font: this.fonts.bold, color: INK });
    this.y -= 34;
    this.paragraph(`${profile.headline} ${profile.location}.`, { size: 11, color: MUTED, lineHeight: 15 });
    this.space(2);
    const github = profile.socials.find((social) => social.kind === "github");
    const linkedin = profile.socials.find((social) => social.kind === "linkedin");
    const contacts: { label: string; href?: string }[] = [{ label: profile.email, href: `mailto:${profile.email}` }];
    if (profile.website) contacts.push({ label: profile.website.replace("https://", ""), href: profile.website });
    else if (site.url.startsWith("https://")) contacts.push({ label: site.url.replace("https://", ""), href: site.url });
    if (github) contacts.push({ label: `github.com/${github.handle}`, href: github.href });
    if (linkedin) contacts.push({ label: `linkedin.com/${linkedin.handle}`, href: linkedin.href });
    this.inlineLinks(contacts, 9);
    this.y -= 10;
    this.page.drawRectangle({ x: MARGIN_X, y: this.y, width: CONTENT_WIDTH, height: 1.6, color: ACCENT });
    this.y -= 2;
  }

  footer(): void {
    const pages = this.doc.getPages();
    pages.forEach((page, index) => {
      const text = toWinAnsi(`${profile.name}  |  CV  |  Page ${index + 1} of ${pages.length}`);
      const width = this.fonts.regular.widthOfTextAtSize(text, 8);
      page.drawText(text, { x: (PAGE_WIDTH - width) / 2, y: 26, size: 8, font: this.fonts.regular, color: MUTED });
    });
  }
}

export async function buildCvPdf(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`${profile.name} CV`);
  doc.setAuthor(profile.name);
  doc.setSubject(site.description);
  doc.setKeywords(site.keywords);
  doc.setCreator(site.url);
  doc.setProducer("pdf-lib");
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
  };
  const cv = new CvWriter(doc, fonts);

  cv.header();

  cv.section("Profile");
  cv.space(2);
  cv.paragraph(profile.bio.join(" "), { size: 9.5, lineHeight: 13.3 });

  cv.section(ui.cv.experience);
  for (const item of experience) {
    cv.role(item.role, `${item.organization}, ${item.location}`, formatRange(item.start, item.end, ui.present));
  }

  cv.section(ui.cv.education);
  for (const item of education) {
    const title = item.field ? `${item.degree}, ${item.field}` : item.degree;
    cv.entry(title, `${item.start} – ${item.end}`, `${item.institution}, ${item.location}`);
  }

  cv.section(ui.cv.selectedProjects);
  for (const project of projects.filter((item) => item.featured)) {
    const proof = (project.facts ?? []).find((fact) => fact.label === "Tests" || fact.label === "Scale");
    const details = [project.stack.slice(0, 7).join(", "), proof ? proof.value : ""].filter((part) => part.length > 0).join(". ");
    cv.project(project.title, `${site.url}/projects/${project.slug}`, project.summary, `${details}.`);
  }
  cv.space(4);
  cv.inlineLinks(
    [
      { label: ui.cv.moreProjects },
      ...projects.filter((item) => item.featured === false).map((item) => ({ label: item.title, href: `${site.url}/projects/${item.slug}` })),
    ],
    8.5,
  );

  cv.section(ui.cv.certifications);
  for (const item of certifications) {
    cv.role(item.name, item.issuer, item.date ? formatYearMonth(item.date) : "", ", ");
  }

  cv.section(ui.cv.community);
  for (const item of communityRoles) {
    cv.role(item.role, item.organization, item.period, ", ");
  }

  cv.section(ui.cv.skills);
  cv.space(3);
  for (const group of skillGroups) {
    cv.paragraph(`${group.title}: ${group.skills.map((skill) => skill.name).join(", ")}`, { size: 9.5, lineHeight: 13.3 });
  }

  cv.paragraph(`${ui.cv.languages}: ${languages.map((language) => `${language.name} (${language.level})`).join(", ")}`, { size: 9.5, lineHeight: 13.3 });

  cv.footer();
  return doc.save();
}
