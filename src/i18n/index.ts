import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './en.json';
import de from './de.json';

const i18n = new I18n({
  en,
  de,
});

i18n.enableFallback = true;

// Set the locale once at the beginning of your app.
// Defaults to 'de' if the language code cannot be determined.
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'en';

export default i18n;
