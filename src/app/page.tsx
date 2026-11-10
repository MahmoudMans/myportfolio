import type { Metadata } from "next";
import { AboutSection } from "@/components/home/about";
import { BadgesSection } from "@/components/home/badges";
import { CareerLogSection } from "@/components/home/career-log";
import { CaseFilesSection } from "@/components/home/case-files";
import { CommunitySection } from "@/components/home/community";
import { ContactSection } from "@/components/home/contact";
import { HeroSection } from "@/components/home/hero";
import { ResearchSection } from "@/components/home/research";
import { SkillsSection } from "@/components/home/skills";
import { SocSection } from "@/components/home/soc";
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
      <HeroSection />
      <AboutSection />
      <ResearchSection />
      <SkillsSection />
      <SocSection />
      <CaseFilesSection />
      <CareerLogSection />
      <BadgesSection />
      <CommunitySection />
      <ContactSection />
    </>
  );
}
