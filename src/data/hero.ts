import type { HeroShowcase } from "@/types";

export const heroShowcase: HeroShowcase = {
  projectSlug: "ai-antivirus",
  appName: "AI-based antivirus",
  status: "Model ready",
  scanningStatus: "Scanning",
  listTitle: "Pick a file to scan",
  files: [
    { name: "setup.exe", verdict: "clean", label: "Clean", result: "No threat found", weights: [24, 30, 18, 14] },
    { name: "invoice.pdf.exe", verdict: "malicious", label: "Malware", result: "Malware detected", weights: [72, 90, 58, 40] },
    { name: "driver_update.exe", verdict: "suspicious", label: "Review", result: "Needs a closer look", weights: [46, 64, 52, 34] },
    { name: "editor.exe", verdict: "clean", label: "Clean", result: "No threat found", weights: [16, 26, 22, 10] },
  ],
  selectedFile: "invoice.pdf.exe",
  scanLabel: "Scan",
  featuresTitle: "File features",
  featureNames: ["Header", "Imports", "Sections", "Strings"],
  verdictLabel: "Classified with machine learning",
  chips: [
    { icon: "work", value: "7 internships", label: "since 2020" },
    { icon: "study", value: "Master's student", label: "Cybersecurity, UIT" },
    { icon: "community", value: "GDG Carthage", label: "Co-organizer since 2024" },
  ],
  chipsLabel: "Mahmoud Mansouri in numbers",
  caption: "An illustration of my AI-based antivirus, which analyzes the features of executable files and uses machine learning to identify malware.",
  linkLabel: "See the project",
};
