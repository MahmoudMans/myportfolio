import type { SectionCopy } from "@/types";

export const sections = {
  about: {
    id: "about",
    title: "About",
    intro: "Software engineer by training, heading into cybersecurity research.",
  },
  now: {
    id: "now",
    title: "Now",
    intro: "What I am focused on at the moment.",
  },
  experience: {
    id: "experience",
    title: "Experience",
    intro: "Internships and roles since 2020, newest first.",
  },
  projects: {
    id: "projects",
    title: "Projects",
    intro: "Personal projects across full-stack web, security, monitoring, machine learning and mobile.",
  },
  research: {
    id: "research",
    title: "Research",
    intro: "The questions I want to work on next.",
  },
  cv: {
    id: "cv",
    title: "Education",
    intro: "A Master's in cybersecurity on top of a software engineering degree. The full CV is interactive and downloadable.",
  },
  certifications: {
    id: "certifications",
    title: "Certifications",
    intro: "Certifications, course certificates, recognition and learning paths in networking, cloud and Agile delivery.",
  },
  community: {
    id: "community",
    title: "Community",
    intro: "I co-organize Google Developer Groups Carthage and help run tech events in Tunis.",
  },
  skills: {
    id: "skills",
    title: "Skills",
    intro: "Languages, frameworks and tools I have worked with.",
  },
  timeline: {
    id: "timeline",
    title: "Timeline",
    intro: "From high school to today.",
  },
  languages: {
    id: "languages",
    title: "Languages",
    intro: "The languages I speak and work in.",
  },
  contact: {
    id: "contact",
    title: "Contact",
    intro: "Whether you have a research topic in cybersecurity or a web or mobile app to build, send me a message on LinkedIn. My code is on GitHub.",
  },
} satisfies Record<string, SectionCopy>;

export const pageCopy = {
  projects: {
    title: "Projects",
    description: "Personal projects by Mahmoud Mansouri: full-stack platforms for procurement, finance, education, disaster response, construction and neighbors, plus work in security, monitoring and AI.",
    intro: "Filter by type or search by name and technology. Each project has its own page.",
  },
  posts: {
    title: "LinkedIn posts",
    description: "Posts by Mahmoud Mansouri on LinkedIn: community events with GDG Carthage, certifications, learning and milestones.",
    intro: "What I have shared on LinkedIn since 2024: community events, certifications, learning and milestones. Each post opens on LinkedIn.",
  },
  cv: {
    title: "CV",
    description: "Interactive CV of Mahmoud Mansouri: education, experience, certifications, skills and languages, with a downloadable PDF.",
    intro: "Switch between education, experience, certifications and skills, or download the same content as a PDF.",
  },
  notFound: {
    title: "This page does not exist",
    body: "The link may be out of date, or the address has a typo. Try the search, or start again from one of these pages.",
  },
};
