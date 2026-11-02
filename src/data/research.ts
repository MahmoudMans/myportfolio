import type { ResearchData } from "@/types";

export const research: ResearchData = {
  interests: [
    {
      icon: "software",
      title: "Software security",
      body: "How flaws enter software through its design and code, and how to find and prevent them.",
    },
    {
      icon: "vulnerability",
      title: "Vulnerability discovery",
      body: "Finding exploitable weaknesses in programs and systems before attackers do.",
    },
    {
      icon: "systems",
      title: "Systems security",
      body: "Protecting operating systems, infrastructure and the layers that software runs on.",
    },
    {
      icon: "ai",
      title: "AI-assisted cybersecurity",
      body: "Using machine learning to detect threats, the direction of my AI-based antivirus project.",
    },
  ],
  experience: {
    role: "Research Intern",
    organization: "Mediterranean Institute of Technology",
    location: "Tunisia",
    period: "January to June 2024",
  },
  goal: {
    title: "Looking for a research internship or a Master's thesis",
    body: "I want to work on cybersecurity research as a pathway toward a PhD. If your lab or team has a topic in software, systems or AI-assisted security, I would like to hear about it.",
  },
};
