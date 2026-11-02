import type { LinkedInPost, PostKind } from "@/types";

export const postKinds: PostKind[] = ["Community", "Certification", "Learning", "Milestone"];

export const linkedInPosts: LinkedInPost[] = [
  {
    id: "7522932440529588226",
    date: "2026-11-02",
    kind: "Certification",
    title: "Earned the CCNA: Introduction to Networks certificate",
    summary:
      "A Cisco Networking Academy course on network architectures, IP addressing, Ethernet, routing and switching and basic network security, as a foundation for deeper work in cybersecurity.",
  },
  {
    id: "7396098533268987904",
    date: "2025-11-17",
    kind: "Certification",
    title: "Earned the Professional Scrum Master I certification",
    summary:
      "Certified in Scrum and Agile delivery, to bring more structure, focus and value to the projects I work on with my teams.",
  },
  {
    id: "7256607138964262912",
    date: "2024-10-28",
    kind: "Community",
    title: "Last call for the Daytona Developers Club Tour in Tunis",
    summary:
      "Invited developers to the free Tunis stop of the Daytona Developers Club Tour '24 on 31 October: an evening on developer experience, tooling and open source.",
  },
  {
    id: "7251509628050587648",
    date: "2024-10-14",
    kind: "Learning",
    title: "Completed the Arcade Trivia, September 2024",
    summary:
      "Four weeks of Google Cloud Skills Boost labs on Looker, Google Sheets, Connected Sheets, BigQuery, Pub/Sub and the Speech-to-Text API.",
  },
  {
    id: "7250059989564751872",
    date: "2024-10-10",
    kind: "Learning",
    title: "Completed the Arcade Explorers, September 2024",
    summary:
      "Challenge labs on Google Workspace, Apps Script, BigQuery, virtual agents and Vertex AI Workbench.",
  },
  {
    id: "7248972837414203394",
    date: "2024-10-07",
    kind: "Learning",
    title: "Completed the Arcade Base Camp, September 2024",
    summary:
      "Twelve Google Cloud labs, from networking, Identity-Aware Proxy and quotas to BigQuery, Cloud SQL and Looker Studio dashboards.",
  },
  {
    id: "7244616653378883584",
    date: "2024-09-25",
    kind: "Community",
    title: "Co-organized Google I/O Extended Carthage 2024",
    summary:
      "Brought I/O Extended to South Mediterranean University with GDG on Campus SMU, with talks on Google AI, multimodal RAG with the Gemini API, Google Cloud, Flutter and the web.",
  },
  {
    id: "7231933106763554817",
    date: "2024-08-21",
    kind: "Learning",
    title: "Completed the Cloud Digital Leader learning path",
    summary:
      "Courses, labs and skill badges on digital transformation, data, AI, infrastructure modernization, security and operations with Google Cloud.",
  },
  {
    id: "7231668330674221056",
    date: "2024-08-20",
    kind: "Community",
    title: "Thank you to our GenAI workshop speaker",
    summary:
      "GDG Carthage thanked Yannick Serge Obam, AI/ML Google Developer Expert, for the workshop on building GenAI solutions on Google Cloud.",
    sharedFrom: "GDG Carthage",
  },
  {
    id: "7229092826142187520",
    date: "2024-08-13",
    kind: "Community",
    title: "Workshop: building GenAI solutions on Google Cloud",
    summary:
      "An online workshop in French on 14 August 2024, led by Yannick Serge Obam, AI and data consultant and AI/ML Google Developer Expert.",
    sharedFrom: "GDG Carthage",
  },
  {
    id: "7217996215269879808",
    date: "2024-07-13",
    kind: "Community",
    title: "Technical Activities Manager at the Metaverse Tunisian Summit 2.0",
    summary: "Ran the technical activities of the summit, organized by the IEEE SupCom and IEEE SMU Student Branches.",
  },
  {
    id: "7215980517261733889",
    date: "2024-07-08",
    kind: "Community",
    title: "Attended Google I/O Connect in Berlin",
    summary:
      "Discovered new Google products and developer tools, and met members of Google Developer Groups and Google Developer Experts.",
  },
  {
    id: "7210914630469120000",
    date: "2024-06-24",
    kind: "Milestone",
    title: "Capstone project graded Outstanding",
    summary:
      "Completed my Software Engineering studies at South Mediterranean University with a capstone project supervised by Dr. Jihen Bennaceur.",
  },
  {
    id: "7193972400978354176",
    date: "2024-05-08",
    kind: "Certification",
    title: "Google Solution Challenge 2024 certificate",
    summary:
      "Received a certificate for submitting Mentalo, our team's mental health project, to the Google Solution Challenge 2024.",
    links: [{ kind: "demo", label: "Mentalo demo", href: "https://lnkd.in/d2savcca" }],
  },
  {
    id: "7186778936477970434",
    date: "2024-04-18",
    kind: "Community",
    title: "International Women's Day 2024: Impact the Future",
    summary:
      "Registration call for the GDG Carthage and Women Techmakers Carthage event on AI and the future of tech, on 21 April at The DOT, Lac 1.",
  },
  {
    id: "7160233738008772608",
    date: "2024-02-05",
    kind: "Community",
    title: "Organized DevFest with GDG Carthage",
    summary:
      "My first event as a co-organizer, with GDSC SMU and GDSC Sup'Com, talks on BioAI and on Flutter, and support from SMU, InstaDeep and INPHA-MédiS.",
  },
  {
    id: "7157698653279666177",
    date: "2024-01-29",
    kind: "Milestone",
    title: "Joined GDG Carthage as a co-organizer",
    summary: "Started co-organizing Google Developer Groups Carthage, with thanks to Nouha Jaafar and Yosra Miladi for the opportunity.",
  },
  {
    id: "7150780082708500480",
    date: "2024-01-10",
    kind: "Certification",
    title: "AWS Certified Cloud Practitioner",
    summary: "Earned the AWS Certified Cloud Practitioner certification from Amazon Web Services.",
    links: [
      {
        kind: "verify",
        label: "Verify on Credly",
        href: "https://www.credly.com/badges/4b1b35e9-ee08-4760-895e-1df3d667ca8a",
      },
    ],
  },
];
