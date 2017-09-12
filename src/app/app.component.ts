import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '../environments/environment';
import { I18nService } from './i18n/i18n.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(translate: TranslateService, i18n: I18nService) {
    translate.addLangs(i18n.bundles.map(bundle => bundle.id));
    translate.setDefaultLang(environment.i18n.defaultLanguage);
    translate.use(i18n.getLanguage(translate.getBrowserCultureLang()));
  }
}
