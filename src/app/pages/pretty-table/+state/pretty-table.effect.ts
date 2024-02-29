import { Actions, createEffect, FunctionalEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { ApiService } from '@core/ services/api.service';
import { prettyTableActions } from '@pages/pretty-table/+state/pretty-table.actions';
import { catchError, concatMap, of, switchMap } from 'rxjs';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';

export const loadUsers$: FunctionalEffect = createEffect(
  (
    actions$: Actions = inject(Actions),
    apiService: ApiService = inject(ApiService),
  ) => {
    return actions$.pipe(
      ofType(prettyTableActions.loadUsers),
      switchMap(() => {
        return apiService.get<UserProfileVm[]>()
          .pipe(
            concatMap((usersData: UserProfileVm[]) => [
              prettyTableActions.loadUsersSuccess({ usersData }),
            ]),
            catchError(() => {
              return of(prettyTableActions.loadUsersFailure({ error: 'Upload error!' }));
            }),
          );
      }),
    );
  },
  { functional: true },
);
