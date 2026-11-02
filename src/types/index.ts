export type YearMonth = string;
export type IsoDate = string;

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: "top" | "center" | "contain";
}

export interface CaptionedImage extends ImageAsset {
  caption: string;
  crop?: boolean;
}

export type LinkKind =
  | "github"
  | "demo"
  | "video"
  | "paper"
  | "slides"
  | "poster"
  | "dataset"
  | "code"
  | "report"
  | "verify"
  | "linkedin";

export interface ResourceLink {
  kind: LinkKind;
  label: string;
  href: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  locale: string;
  keywords: string[];
  ogImageAlt: string;
  ogTagline: string;
  footerNote: string;
  cvFileName: string;
}

export type SocialKind = "github" | "linkedin";

export interface SocialLink {
  kind: SocialKind;
  label: string;
  handle: string;
  href: string;
}

export type AvailabilityStatus = "open-to-work" | "internships" | "collaborations" | "unavailable";

export interface Availability {
  status: AvailabilityStatus;
  label: string;
  detail: string;
}

export type FocusIcon = "web" | "security" | "ai";

export interface FocusArea {
  icon: FocusIcon;
  title: string;
  body: string;
  tools?: string[];
}

export interface Profile {
  name: string;
  initials: string;
  role: string;
  headline: string;
  tagline: string;
  bio: string[];
  focus: FocusArea[];
  location: string;
  timezone: string;
  email: string;
  website?: string;
  photo: ImageAsset;
  languagesSpoken: string[];
  availability: Availability;
  socials: SocialLink[];
}

export type ShowcaseChipIcon = "work" | "study" | "community";

export type ScanVerdict = "clean" | "suspicious" | "malicious";

export interface HeroShowcase {
  projectSlug: string;
  appName: string;
  status: string;
  listTitle: string;
  files: { name: string; verdict: ScanVerdict; label: string }[];
  featuresTitle: string;
  features: { name: string; weight: number }[];
  verdictLabel: string;
  verdictName: string;
  verdictFile: string;
  chips: { icon: ShowcaseChipIcon; value: string; label: string }[];
  chipsLabel: string;
  caption: string;
  linkLabel: string;
}

export interface NavItem {
  label: string;
  href: string;
  section: string;
  match?: string;
}

export interface SectionCopy {
  id: string;
  title: string;
  intro?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location: string;
  start: string;
  end: string;
  gpa?: string;
  honors?: string[];
  courses?: string[];
  note?: string;
}

export type ExperienceKind = "Internship" | "Job" | "Freelance" | "Teaching" | "Research" | "Volunteer";

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  kind: ExperienceKind;
  start: YearMonth;
  end: YearMonth | null;
  summary?: string;
  highlights?: string[];
  results?: Metric[];
  tools?: string[];
}

export type ProjectTag = "Web" | "Mobile" | "AI" | "Security" | "DevOps";

export interface ProjectFact {
  label: string;
  value: string;
}

export interface ProjectHighlight {
  title: string;
  body: string[];
  image?: CaptionedImage;
}

export interface ProjectCaseStudy {
  problem: string[];
  approach?: string[];
  audience?: { name: string; detail: string }[];
  highlights: ProjectHighlight[];
  stackRows: { layer: string; tech: string }[];
  architecture?: CaptionedImage;
  diagram?: string[];
  testing?: string[];
  results?: string[];
  next?: string[];
  learned?: string[];
}

export interface Project {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  description: string;
  features: string[];
  tags: ProjectTag[];
  stack: string[];
  cover: ImageAsset;
  links: ResourceLink[];
  featured: boolean;
  facts?: ProjectFact[];
  caseStudy?: ProjectCaseStudy;
  gallery?: CaptionedImage[];
}

export interface ProjectSummary {
  slug: string;
  title: string;
  summary: string;
  tags: ProjectTag[];
  stack: string[];
  cover: ImageAsset;
  links: ResourceLink[];
}

export type ResearchIcon = "software" | "vulnerability" | "systems" | "ai";

export interface ResearchInterest {
  icon: ResearchIcon;
  title: string;
  body: string;
}

export interface ResearchData {
  interests: ResearchInterest[];
  experience: {
    role: string;
    organization: string;
    location: string;
    period: string;
  };
  goal: {
    title: string;
    body: string;
  };
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  name: string;
  level?: SkillLevel;
}

export type SkillGroupIcon = "code" | "frameworks" | "data" | "database" | "tools";

export interface SkillGroup {
  id: string;
  icon: SkillGroupIcon;
  title: string;
  skills: Skill[];
}

export type TimelineKind = "Education" | "Work" | "Research" | "Community" | "Milestone";

export interface TimelineEntry {
  id: string;
  date: YearMonth;
  kind: TimelineKind;
  title: string;
  detail: string;
}

export type PostKind = "Community" | "Certification" | "Learning" | "Milestone";

export interface LinkedInPost {
  id: string;
  date: IsoDate;
  kind: PostKind;
  title: string;
  summary: string;
  sharedFrom?: string;
  links?: ResourceLink[];
}

export type CommunityIcon = "gdg" | "student" | "ieee" | "meetup";

export interface CommunityRole {
  id: string;
  icon: CommunityIcon;
  role: string;
  organization: string;
  period: string;
  detail: string;
}

export interface CommunityEvent {
  id: string;
  when: string;
  title: string;
  role: string;
  place: string;
  detail: string;
  postId: string;
}

export type CertificationKind = "Certification" | "Course certificate" | "Recognition" | "Learning path" | "Skill badges";

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  kind: CertificationKind;
  date?: YearMonth;
  detail: string;
  link?: ResourceLink;
  postId?: string;
}

export type NowIcon = "working" | "studying" | "interests" | "looking";

export interface NowData {
  lastUpdated: IsoDate;
  items: { icon: NowIcon; label: string; text: string }[];
}

export interface SpokenLanguage {
  name: string;
  nativeName: string;
  nativeLang: string;
  level: string;
  score: SkillLevel;
  note?: string;
}

export type PaletteGroup = "Sections" | "Pages" | "Projects" | "Posts" | "Actions";

export type PaletteAction =
  | "toggle-theme"
  | "theme-light"
  | "theme-dark"
  | "theme-system"
  | "download-cv";

export interface PaletteItem {
  id: string;
  group: PaletteGroup;
  label: string;
  hint: string;
  href?: string;
  action?: PaletteAction;
  keywords: string[];
}
