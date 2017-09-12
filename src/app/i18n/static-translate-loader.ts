import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { I18nService } from './i18n.service';

export class StaticTranslateLoader implements TranslateLoader {
  constructor(private i18n: I18nService) {}

  getTranslation(lang: string): Observable<any> {
    return this.i18n.getMessages(lang);
  }
}
