import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { prettyTableFeature } from '@pages/pretty-table/+state/pretty-table.reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import * as PrettyTableEffects from '@pages/pretty-table/+state/pretty-table.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({
      [prettyTableFeature.name]: prettyTableFeature.reducer,
    }),
    provideEffects(PrettyTableEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
