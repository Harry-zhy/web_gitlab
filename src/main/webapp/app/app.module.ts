import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import locale from '@angular/common/locales/en';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgxWebstorageModule } from 'ngx-webstorage';
import dayjs from 'dayjs/esm';
import { NgbDateAdapter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import './config/dayjs';
import { SharedModule } from 'app/shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { NgbDateDayjsAdapter } from './config/datepicker-adapter';
import { fontAwesomeIcons } from './config/font-awesome-icons';
import { httpInterceptorProviders } from 'app/core/interceptor/index';
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';
import { BookedactivitypageComponent } from './bookedactivitypage/bookedactivitypage.component';
import { SelfactivitypageComponent } from './selfactivitypage/selfactivitypage.component';
import { FormsModule } from '@angular/forms';
import { FeedbackComponent } from './feedback/feedback.component';
import { ItineraryComponent } from './itinerary/itinerary.component';
import { NotificationComponent } from './notification/notification.component';
import { SupplierProfileComponent } from './supplier-profile/supplier-profile.component';
import { SearchPageComponent } from './venues/search-page/search-page.component';
import { SearchActivityPageComponent } from './venues/search-activity-page/search-activity-page.component';
import { ResultPageComponent } from './venues/result-page/result-page.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { DecorationsComponent } from './decorations/decorations.component';
import { CompanyinfoComponent } from './companyinfopage/companyinfo.component';
import { FeedbackSuccessComponent } from './feedback/feedback-success/feedback-success.component';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    HomeModule,
    FormsModule,
    CommonModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    AppRoutingModule,
    // Set this to true to enable service worker (PWA)
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
    HttpClientModule,
    NgxWebstorageModule.forRoot({ prefix: 'jhi', separator: '-', caseSensitive: true }),
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: NgbDateAdapter, useClass: NgbDateDayjsAdapter },
    httpInterceptorProviders,
  ],
  declarations: [
    MainComponent,
    NavbarComponent,
    ErrorComponent,
    PageRibbonComponent,
    FooterComponent,
    BookedactivitypageComponent,
    SelfactivitypageComponent,
    FeedbackComponent,
    ItineraryComponent,
    NotificationComponent,
    SupplierProfileComponent,
    SearchPageComponent,
    SearchActivityPageComponent,
    ResultPageComponent,
    FavouritesComponent,
    DecorationsComponent,
    CompanyinfoComponent,
    FeedbackSuccessComponent,
  ],
  bootstrap: [MainComponent, FeedbackComponent],
})
export class AppModule {
  constructor(applicationConfigService: ApplicationConfigService, iconLibrary: FaIconLibrary, dpConfig: NgbDatepickerConfig) {
    applicationConfigService.setEndpointPrefix(SERVER_API_URL);
    registerLocaleData(locale);
    iconLibrary.addIcons(...fontAwesomeIcons);
    dpConfig.minDate = { year: dayjs().subtract(100, 'year').year(), month: 1, day: 1 };
  }
}
