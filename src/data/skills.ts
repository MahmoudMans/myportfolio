import type { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    icon: "code",
    title: "Programming languages",
    skills: [
      { name: "C" },
      { name: "C++" },
      { name: "C#" },
      { name: "Java" },
      { name: "Python" },
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "Go" },
      { name: "PHP" },
    ],
  },
  {
    id: "frameworks",
    icon: "frameworks",
    title: "Libraries and frameworks",
    skills: [
      { name: "Spring Boot" },
      { name: "Next.js" },
      { name: "NestJS" },
      { name: "Node.js" },
      { name: "React" },
      { name: "React Native" },
      { name: "Angular" },
      { name: "Vue" },
    ],
  },
  {
    id: "data",
    icon: "data",
    title: "Data analysis",
    skills: [
      { name: "Pandas" },
      { name: "NumPy" },
      { name: "scikit-learn" },
      { name: "NLTK" },
      { name: "Seaborn" },
      { name: "TensorFlow" },
    ],
  },
  {
    id: "databases",
    icon: "database",
    title: "Databases",
    skills: [{ name: "MySQL" }, { name: "PostgreSQL" }, { name: "MongoDB" }, { name: "Firebase" }, { name: "Cassandra" }],
  },
  {
    id: "other",
    icon: "tools",
    title: "Other technologies",
    skills: [
      { name: "Linux" },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "Virtual machines" },
      { name: "AWS" },
      { name: "Google Cloud" },
    ],
  },
];
