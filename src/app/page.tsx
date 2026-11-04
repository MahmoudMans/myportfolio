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
import { education } from "@/data/education";
import { experience } from "@/data/experience";
import { languages } from "@/data/languages";
import { profile } from "@/data/profile";
import { research } from "@/data/research";
import { site } from "@/data/site";
import { jsonLd, pageMetadata } from "@/lib/metadata";

const currentRole = experience.find((item) => item.end === null);

export const metadata: Metadata = {
  ...pageMetadata({ title: site.title, description: site.description, path: "/" }),
  title: { absolute: site.title },
};

const personData = jsonLd({
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: site.url,
  jobTitle: profile.role,
  description: profile.headline,
  address: { "@type": "PostalAddress", addressCountry: "TN" },
  knowsLanguage: languages.map((language) => language.name),
  knowsAbout: research.interests.map((interest) => interest.title),
  alumniOf: education.map((item) => ({ "@type": "EducationalOrganization", name: item.institution })),
  ...(currentRole ? { worksFor: { "@type": "Organization", name: currentRole.organization } } : {}),
  sameAs: profile.socials.map((social) => social.href),
});

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personData }} />
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
