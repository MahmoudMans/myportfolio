import { LevelMeter } from "@/components/ui/level-meter";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { languages } from "@/data/languages";
import { sections } from "@/data/sections";

export function LanguagesSection() {
  return (
    <Section {...sections.languages} rail>
      <LanguageList />
    </Section>
  );
}

export function LanguageList() {
  return (
    <Reveal>
      <ul className="cell-panel cell-panel-3">
        {languages.map((language) => (
          <li key={language.name} className="cell lang-cell">
            <p className="lang-native" lang={language.nativeLang}>
              {language.nativeName}
            </p>
            {language.nativeName !== language.name ? <p className="lang-name">{language.name}</p> : null}
            {language.note ? <p className="mt-1 text-sm text-ink-3">{language.note}</p> : null}
            <div className="lang-level">
              <span>{language.level}</span>
              <LevelMeter level={language.score} label={language.level} />
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
