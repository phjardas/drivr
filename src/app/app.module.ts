import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';
import { ReactiveFormsModule }   from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { environment } from '../environments/environment';
import { I18nService } from './i18n/i18n.service';
import { StaticTranslateLoader } from './i18n/static-translate-loader';
import { AuthenticationService } from './authentication.service';
import { CarService } from './car.service';
import { AppComponent } from './app.component';
import { MainMenuComponent } from './main-menu.component';
import { CarComponent } from './car.component';
import { NewCarComponent } from './new-car.component';
import { NewRefuelComponent } from './new-refuel.component';
import { DashboardComponent } from './dashboard.component';

// AoT requires an exported function for factories
export function createTranslateLoader(i18n: I18nService) {
  return new StaticTranslateLoader(i18n);
}

const routes: Routes = [
  { path: 'cars/_new', component: NewCarComponent },
  { path: 'cars/:id', component: CarComponent },
  { path: 'cars/:id/refuels/_new', component: NewRefuelComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    DashboardComponent,
    CarComponent,
    NewCarComponent,
    NewRefuelComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    Ng2GoogleChartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [I18nService],
      }
    }),
  ],
  providers: [
    AuthenticationService,
    CarService,
    I18nService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
