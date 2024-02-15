import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_DATE_FORMATS_PROVIDER } from '@utilsFunctions/formatDate';
import { CookieService } from 'ngx-cookie-service';
import { InterceptorService } from '@services/interceptor.service';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),

    importProvidersFrom(HttpClientModule, MatMomentDateModule),
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    APP_DATE_FORMATS_PROVIDER,
    CookieService,
  ],
};
