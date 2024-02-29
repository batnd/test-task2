import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PRETTY_TABLE_FEATURE_KEY } from '@pages/pretty-table/+state/pretty-table.reducer';
import { PrettyTableState } from '@pages/pretty-table/+state/pretty-table-state.interface';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';
import { SortingState } from '@core/models/sorting-state.interface';
import { Pagination } from '@pages/pretty-table/models/pagination.interface';
import { filterUsers } from '@pages/pretty-table/utility/filter-users';

export const selectPrettyTableState = createFeatureSelector<PrettyTableState>(PRETTY_TABLE_FEATURE_KEY);

export const selectUsersData = createSelector(
  selectPrettyTableState,
  (state: PrettyTableState) => state.usersData,
);

export const selectFilters = createSelector(
  selectPrettyTableState,
  (state: PrettyTableState) => state.filter,
);
export const selectTags = createSelector(
  selectPrettyTableState,
  (state: PrettyTableState) => state.tags,
);

export const selectSort = createSelector(
  selectPrettyTableState,
  (state: PrettyTableState) => state.sort,
);

export const selectPagination = createSelector(
  selectPrettyTableState,
  (state: PrettyTableState) => state.pagination,
);

export const selectCurrentPage = createSelector(
  selectPrettyTableState,
  (state: PrettyTableState) => state.pagination.currentPage,
);


export const selectFilteredUsers = createSelector(
  selectUsersData,
  selectFilters,
  selectTags,
  (allUsers: UserProfileVm[], filters, tags: string[]) => {
    return filterUsers(allUsers, filters, tags);
  },
);

export const selectSortedUsers = createSelector(
  selectFilteredUsers,
  selectSort,
  (filteredUsers: UserProfileVm[], sortOrder: SortingState) => {
    const filteredAndSortedUsers: UserProfileVm[] = [...filteredUsers];
    if (sortOrder.field && sortOrder.direction) {
      filteredAndSortedUsers.sort((a: UserProfileVm, b: UserProfileVm) => {
        const field: keyof UserProfileVm = sortOrder.field as keyof typeof a;
        const dirMultiplier = sortOrder.direction === 'asc' ? 1 : -1;
        return a[field] > b[field] ? dirMultiplier : a[field] < b[field] ? -dirMultiplier : 0;
      });
    }
    return filteredAndSortedUsers;
  },
);

export const selectPaginatedUsers = createSelector(
  selectSortedUsers,
  selectPagination,
  (filteredSortedUsers: UserProfileVm[], pagination: Pagination) => {
    const startIndex: number = (pagination.currentPage - 1) * pagination.itemsOnPage;
    const endIndex: number = startIndex + pagination.itemsOnPage;
    return filteredSortedUsers.slice(startIndex, endIndex);
  },
);

export const selectDisplayedHiddenUsers = createSelector(
  selectPaginatedUsers,
  (users: UserProfileVm[]) => {
    return users.filter((user: UserProfileVm) => !user.isVisible).length;
  },
);

export const selectCurrentPagination = createSelector(
  selectPrettyTableState,
  selectFilteredUsers,
  (state: PrettyTableState, users: UserProfileVm[]): Pagination => {
    const totalPages: number = Math.ceil(users.length / state.pagination.itemsOnPage);

    return {
      currentPage: state.pagination.currentPage,
      itemsOnPage: state.pagination.itemsOnPage,
      totalItems: users.length,
      totalPages
    }
  },
);
