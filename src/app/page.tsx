import type { Metadata } from "next";
import { CertificationsSection } from "@/components/sections/certifications";
import { CommunitySection } from "@/components/sections/community";
import { ContactSection } from "@/components/sections/contact";
import { CvPreview } from "@/components/sections/cv-preview";
import { ExperienceSection } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { LanguagesSection } from "@/components/sections/languages";
import { NowSection } from "@/components/sections/now";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { ResearchPreview } from "@/components/sections/research-preview";
import { SkillsSection } from "@/components/sections/skills";
import { TimelineSection } from "@/components/sections/timeline";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({ title: site.title, description: site.description, path: "/" }),
  title: { absolute: site.title },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <NowSection />
      <ExperienceSection />
      <ProjectsPreview />
      <ResearchPreview />
      <CvPreview />
      <CertificationsSection />
      <CommunitySection />
      <SkillsSection />
      <TimelineSection />
      <LanguagesSection />
      <ContactSection />
    </>
  );
}
