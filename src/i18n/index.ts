/**
 * Internationalisation for volvo-car-card.
 *
 * ── Adding a new language ──────────────────────────────────────────────────
 * 1. Create src/i18n/<lang>.ts implementing the Translations interface.
 * 2. Import it below and add it to the LANGUAGES map.
 * That's all – the card picks it up automatically via hass.language.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { en } from "./en.js";
import { sv } from "./sv.js";

/** All user-visible strings the card renders. */
export interface Translations {
  /** Fallback vehicle name when none can be derived from entities. */
  default_name: string;
  /** Tooltip on the build-version badge. */
  version_tooltip: string;
  /** Shown when the card element has no configuration yet. */
  no_config: string;
  /** Shown in the range area while an entity is reporting a non-numeric state. */
  updating: string;
  state: {
    /** Battery is at 100 % and not charging. */
    fully_charged: string;
    /** Car is idle with no active charging session. */
    ready_to_drive: string;
    /** A scheduled charge is pending. */
    charge_scheduled: string;
  };
  btn: {
    lock: string;
    unlock: string;
    climate: string;
    engine_start: string;
    engine_stop: string;
  };
}

/**
 * Language registry.
 * Key is the BCP-47 primary language subtag (lowercase), e.g. "en", "sv", "de".
 */
const LANGUAGES: Record<string, Translations> = {
  en,
  sv,
};

/**
 * Returns the Translations object for the given language code.
 * Handles full locale tags ("sv-SE") by trying the base tag ("sv") as fallback.
 * Always falls back to English if the language is not registered.
 */
export function getTranslations(lang: string): Translations {
  const lower = lang.toLowerCase();
  return (
    LANGUAGES[lower] ??
    LANGUAGES[lower.split("-")[0]] ??
    en
  );
}
