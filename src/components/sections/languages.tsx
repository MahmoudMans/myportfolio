import { LevelMeter } from "@/components/ui/level-meter";
import { Section } from "@/components/ui/section";
import { languages } from "@/data/languages";
import { sections } from "@/data/sections";

export function LanguagesSection() {
  return (
    <Section {...sections.languages}>
      <LanguageList />
    </Section>
  );
}

export function LanguageList() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {languages.map((language) => (
          <li key={language.name} className="card flex flex-col p-5 sm:p-6">
            <p className="font-display text-xl font-bold text-ink">
              {language.name}
              {language.nativeName !== language.name ? (
                <span lang={language.nativeLang} className="ml-2 text-base font-medium text-ink-3">
                  {language.nativeName}
                </span>
              ) : null}
            </p>
            {language.note ? <p className="mt-1 text-sm text-ink-3">{language.note}</p> : null}
            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <span className="badge badge-accent">{language.level}</span>
              <LevelMeter level={language.score} label={language.level} />
            </div>
          </li>
        ))}
    </ul>
  );
}
