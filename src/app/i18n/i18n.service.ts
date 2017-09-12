import { Observable } from 'rxjs/Observable';

import de from './messages.de';
import en from './messages.en';

const bundles = { de, en };

export interface Bundle {
  id: string;
  label: string;
}

export class I18nService {
  bundles : Bundle[] = [
    { id: 'en', label: 'English' },
    { id: 'de', label: 'Deutsch' },
  ];

  getLanguage(lang: string): string {
    const options = getLanguageOptions(lang);
    for (const option of options) {
      if (option in bundles) return option;
    }
    return null;
  }

  getMessages(lang: string): Observable<any> {
    if (lang in bundles) {
      return Observable.of(bundles[lang]);
    }

    console.warn('i18n bundle not found for language: %s', lang);
    return Observable.of({});
  }
}

function getLanguageOptions(lang: string): string[] {
  const tokens = lang.split(/-/);
  const options = [];
  for (let i = tokens.length; i > 0; i--) {
    options.push(tokens.slice(0, i).join('-'));
  }
  return options;
}
