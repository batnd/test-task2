import { Actions, createEffect, FunctionalEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { ApiService } from '@core/ services/api.service';
import { prettyTableActions } from '@pages/pretty-table/+state/pretty-table.actions';
import { catchError, concatMap, of, switchMap, withLatestFrom } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { selectCurrentPage } from '@pages/pretty-table/+state/pretty-table.selectors';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';

export const loadUsers$: FunctionalEffect = createEffect(
  (
    actions$: Actions = inject(Actions),
    apiService: ApiService = inject(ApiService)
  ) => {
    return actions$.pipe(
      ofType(prettyTableActions.loadUsers),
      switchMap(() => {
        return apiService.get<UserProfileVm[]>()
          .pipe(
            concatMap((usersData: UserProfileVm[]) => [
              prettyTableActions.loadUsersSuccess({ usersData }),
              prettyTableActions.updateDisplayedUsersData({})
            ]),
            catchError(() => {
              return of(prettyTableActions.loadUsersFailure({ error: 'Upload error!' }))
            })
          )
      })
    )
  },
  { functional: true }
);

export const updateItemsOnPage$: FunctionalEffect = createEffect(
  (
    actions$: Actions = inject(Actions),
    store: Store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(prettyTableActions.updateItemsOnPage),
      withLatestFrom(store.select(selectCurrentPage)),
      switchMap(([{ itemsOnPage }, currentPage]) => {
        return of(prettyTableActions.updateDisplayedUsersData({ itemsOnPage, currentPage }));
      })
    )
  },
  { functional: true }
);

export const changeCurrentPage$: FunctionalEffect = createEffect(
  (actions$: Actions = inject(Actions)) => {
    return actions$.pipe(
      ofType(prettyTableActions.changeCurrentPage),
      switchMap(({ newCurrentPage }) => {
        return of(prettyTableActions.updateDisplayedUsersData({ currentPage: newCurrentPage }));
      })
    )
  },
  { functional: true }
);


