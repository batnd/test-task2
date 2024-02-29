import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { prettyTableActions } from '@pages/pretty-table/+state/pretty-table.actions';
import { Observable } from 'rxjs';
import {
  selectCurrentPagination,
  selectDisplayedHiddenUsers,
  selectPaginatedUsers,
  selectSort,
} from '@pages/pretty-table/+state/pretty-table.selectors';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';
import { Pagination } from '@pages/pretty-table/models/pagination.interface';
import { SortingState } from '@core/models/sorting-state.interface';
import { Filtering } from '@pages/pretty-table/models/filtering.interface';

@Injectable(
  { providedIn: 'root'}
)
export class PrettyTableFacade {
  private readonly store: Store = inject(Store);
  public readonly sortState$: Observable<SortingState> = this.store.select(selectSort);
  public readonly displayedUsers$: Observable<UserProfileVm[]> = this.store.select(selectPaginatedUsers);
  public readonly displayedHiddenUsers$: Observable<number> = this.store.select(selectDisplayedHiddenUsers);
  public readonly pagination$: Observable<Pagination> = this.store.select(selectCurrentPagination);

  public loadUsers(): void {
    this.store.dispatch(prettyTableActions.loadUsers());
  }
  public changeItemsPerPage(itemsPerPage: number): void {
    this.store.dispatch(prettyTableActions.updateItemsOnPage({ itemsOnPage: itemsPerPage }));
  }
  public changeCurrentPage(newCurrentPage: number): void {
    this.store.dispatch(prettyTableActions.changeCurrentPage({ newCurrentPage }));
  }

  public changeSortingSettings(sortingSettings: SortingState): void {
    this.store.dispatch(prettyTableActions.sortDisplayedUsersDataByField({ sortingSettings }));
  }

  public changeFilteringSettings(filteringSettings: Filtering): void {
    this.store.dispatch(prettyTableActions.filterUsersData(filteringSettings));
  }

  public hideUser(userId: string): void {
    this.store.dispatch(prettyTableActions.hideUser({ userId }));
  }

  public showAllUsers(): void {
    this.store.dispatch(prettyTableActions.showAllUsers());
  }
}
