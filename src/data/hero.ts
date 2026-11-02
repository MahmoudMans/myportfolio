import type { HeroShowcase } from "@/types";

export const heroShowcase: HeroShowcase = {
  projectSlug: "ai-antivirus",
  appName: "AI-based antivirus",
  status: "Model ready",
  listTitle: "Executables scanned",
  files: [
    { name: "setup.exe", verdict: "clean", label: "Clean" },
    { name: "invoice.pdf.exe", verdict: "malicious", label: "Malware" },
    { name: "driver_update.exe", verdict: "suspicious", label: "Review" },
    { name: "editor.exe", verdict: "clean", label: "Clean" },
  ],
  featuresTitle: "File features",
  features: [
    { name: "Header", weight: 72 },
    { name: "Imports", weight: 90 },
    { name: "Sections", weight: 58 },
    { name: "Strings", weight: 40 },
  ],
  verdictLabel: "Classified with machine learning",
  verdictName: "Malware detected",
  verdictFile: "invoice.pdf.exe",
  chips: [
    { icon: "work", value: "7 internships", label: "since 2020" },
    { icon: "study", value: "Master's student", label: "Cybersecurity, UIT" },
    { icon: "community", value: "GDG Carthage", label: "Co-organizer since 2024" },
  ],
  chipsLabel: "Mahmoud Mansouri in numbers",
  caption: "An illustration of my AI-based antivirus, which analyzes the features of executable files and uses machine learning to identify malware.",
  linkLabel: "See the project",
};
