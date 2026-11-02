import type { Profile } from "@/types";

export const profile: Profile = {
  name: "Mahmoud Mansouri",
  initials: "MM",
  role: "Software engineer",
  headline: "Software engineer and Master's student in cybersecurity.",
  tagline:
    "Currently a cybersecurity intern at NoBreach. I'm interested in software security, vulnerability discovery, systems security and AI-assisted cybersecurity.",
  bio: [
    "I am a software engineer and a Master's student in Cybersecurity at Université Internationale de Tunis (UIT). I am currently a cybersecurity intern at NoBreach, building on experience in both software development and security.",
    "My interests are software security, vulnerability discovery, systems security and AI-assisted cybersecurity. I am looking for a research internship or a Master's thesis as a pathway toward a PhD in cybersecurity, and I am also open to building web and mobile apps for teams and businesses that need one.",
    "Outside work and study, I co-organize Google Developer Groups Carthage, where I help run DevFest, Google I/O Extended and International Women's Day events. I am also a certified AWS Cloud Practitioner and Professional Scrum Master.",
  ],
  focus: [
    {
      icon: "web",
      title: "Software development",
      body: "Full-stack web and mobile applications, mostly with Spring Boot and Next.js: TenderPilot and ProcureIQ for procurement, TerraScope for disaster response, VentureScope for startup finance, BuildFlow and BuildSight for construction, Economofar, an iPhone app for receipts and budgets, and a program management system with mobile and web apps.",
      tools: ["Java", "Spring Boot", "Next.js", "React", "PostgreSQL", "React Native", "SwiftUI"],
    },
    {
      icon: "security",
      title: "Security",
      body: "Cybersecurity intern at NoBreach, with a focus on software security, vulnerability discovery and systems security. I also built FinCrime Graph, an anti-money-laundering platform with tamper-evident audit trails.",
    },
    {
      icon: "ai",
      title: "AI-assisted cybersecurity",
      body: "Machine learning applied to security, such as an AI-based antivirus that identifies malware from the features of executable files.",
      tools: ["Python", "scikit-learn", "C++", "Qt"],
    },
  ],
  location: "Tunisia",
  timezone: "GMT+1 (Tunisia)",
  email: "mahmoudmansouri2001@gmail.com",
  photo: {
    src: "/images/profile.svg",
    alt: "Mahmoud Mansouri",
    width: 640,
    height: 640,
  },
  languagesSpoken: ["Arabic", "French", "English"],
  availability: {
    status: "open-to-work",
    label: "Open to research and app projects",
    detail: "Research, thesis or app development",
  },
  socials: [
    {
      kind: "github",
      label: "GitHub",
      handle: "MahmoudMans",
      href: "https://github.com/MahmoudMans",
    },
    {
      kind: "linkedin",
      label: "LinkedIn",
      handle: "in/mahmoud-mansouri-6548b41b6",
      href: "https://www.linkedin.com/in/mahmoud-mansouri-6548b41b6/",
    },
  ],
};
