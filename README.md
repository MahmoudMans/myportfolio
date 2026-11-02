# Portfolio

Personal portfolio for a software engineer, built with Next.js (App Router), TypeScript, Tailwind CSS v4 and motion.

## Run it

```bash
npm install
npm run dev
```

Open the local URL printed in the terminal. Other scripts:

- `npm run build` builds the production site
- `npm run start` serves the production build
- `npm run lint` runs ESLint

## Replace the content

Every word, number, link and image path on the site comes from the typed files in `src/data`. Edit those files and the pages, the command palette and the PDF CV update together.

| File | What it holds |
| --- | --- |
| `site.ts` | Site name, description, URL and CV file name |
| `profile.ts` | Name, headline, bio, focus areas, photo, location, availability, GitHub and LinkedIn links |
| `hero.ts` | The antivirus illustration and facts in the hero |
| `navigation.ts` | Header, footer and palette navigation |
| `sections.ts` | Section titles and page introductions |
| `experience.ts` | Internships and roles |
| `education.ts` | Degrees and schools |
| `projects.ts` | Projects, categories and project pages |
| `research.ts` | Research interests, research experience and what you are looking for |
| `skills.ts` | Skill groups |
| `languages.ts` | Spoken languages and levels |
| `timeline.ts` | The journey from high school to today |
| `now.ts` | Current focus and last updated date |
| `ui.ts` | Interface labels such as button text |

Images live in `public/images`. Replace the SVG placeholders with your own files and update the paths in `src/data`. The avatar is `public/images/profile.svg`; point `profile.photo` at a real photo when you have one.

## How it is built

- `src/app` holds the routes: home, `/projects`, `/projects/[slug]`, `/cv`, `/posts`, the 404 page and `/cv.pdf`.
- `src/components` holds small server components by default. Only interactive pieces such as the header, command palette, filters and tabs are client components.
- `src/lib` holds helpers: the PDF builder (pdf-lib), palette search and formatting.
- `src/types` holds the data types used everywhere.

The contact section links to LinkedIn and GitHub only. Change those links in `profile.ts`.
