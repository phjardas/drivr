import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from 'firebase/app';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { Bundle, I18nService } from './i18n/i18n.service';
import { AuthenticationService, AuthenticationProvider } from './authentication.service';
import { CarService, Car } from './car.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html'
})
export class MainMenuComponent {
  bundles: Bundle[];
  currentLanguage: BehaviorSubject<string>;
  user: User;
  authenticationProviders: AuthenticationProvider[];
  cars: Observable<Car[]>;

  constructor(private carService: CarService, private authenticationService: AuthenticationService, i18n: I18nService, private translate: TranslateService) {
    this.currentLanguage = new BehaviorSubject<string>(translate.currentLang);
    translate.onLangChange.map((params: LangChangeEvent) => params.lang).subscribe(this.currentLanguage.next.bind(this.currentLanguage));

    this.bundles = i18n.bundles;
    authenticationService.user.subscribe(user => this.user = user);
    this.authenticationProviders = authenticationService.providers;
    this.cars = carService.cars;
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
  }

  signin(type) {
    this.authenticationService.signin(type);
  }

  signout() {
    this.authenticationService.signout();
  }
}
