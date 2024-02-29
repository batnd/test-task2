import { PrettyTableState } from '@pages/pretty-table/+state/pretty-table-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { prettyTableActions } from '@pages/pretty-table/+state/pretty-table.actions';
import { LoadingStatus } from '@core/models/loading-status.type';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';

export const PRETTY_TABLE_FEATURE_KEY: string = 'pretty-table';

const initialState: PrettyTableState = {
  usersData: [],
  userDataLoadingStatus: null,
  displayedUsersData: [],
  filters: {
    query: '',
  },
  sort: {
    field: '',
    direction: '',
  },
  pagination: {
    currentPage: 1,
    itemsOnPage: 5,
    totalPages: 0,
    totalItems: 0,
  },
  filter: {},
};

export const prettyTableFeature = createFeature({
  name: PRETTY_TABLE_FEATURE_KEY,
  reducer: createReducer(
    initialState,
    on(prettyTableActions.loadUsers, (state: PrettyTableState) => ({
      ...state,
      userDataLoadingStatus: 'loading' as LoadingStatus,
    })),
    on(prettyTableActions.loadUsersSuccess, (state: PrettyTableState, { usersData }) => {
      const itemsOnPage: number = state.pagination.itemsOnPage;
      const totalPages: number = Math.ceil(usersData.length / itemsOnPage);

      return {
        ...state,
        userDataLoadingStatus: 'loaded' as LoadingStatus,
        usersData,
        pagination: {
          ...state.pagination,
          totalPages,
          totalItems: usersData.length,
        },
      };
    }),
    on(prettyTableActions.loadUsersFailure, (state: PrettyTableState, { error }) => ({
      ...state,
      userDataLoadingStatus: 'error' as LoadingStatus,
    })),
    on(prettyTableActions.updateDisplayedUsersData, (state: PrettyTableState, { itemsOnPage, currentPage }) => {
      const newItemsOnPage: number = itemsOnPage ?? state.pagination.itemsOnPage;
      const newCurrentPage: number = currentPage ?? state.pagination.currentPage;
      const startIndex: number = (newCurrentPage - 1) * newItemsOnPage;
      const endIndex: number = startIndex + newItemsOnPage;
      const totalPages: number = Math.ceil(state.usersData.length / newItemsOnPage);

      const newDisplayedUsersData: UserProfileVm[] = state.usersData.slice(startIndex, endIndex);

      return {
        ...state,
        pagination: {
          ...state.pagination,
          itemsOnPage: newItemsOnPage,
          currentPage: newCurrentPage,
          totalPages,
        },
        displayedUsersData: newDisplayedUsersData,
      };
    }),
    on(prettyTableActions.updateItemsOnPage, (state: PrettyTableState, { itemsOnPage }) => {
      const totalItems: number = state.usersData.length;
      const totalPages: number = Math.ceil(totalItems / itemsOnPage);

      const firstItemIndex: number = (state.pagination.currentPage - 1) * state.pagination.itemsOnPage;
      const newCurrentPage: number = Math.ceil((firstItemIndex + 1) / itemsOnPage) || 1;

      return {
        ...state,
        pagination: {
          ...state.pagination,
          itemsOnPage,
          totalPages,
          currentPage: newCurrentPage,
          totalItems,
        },
      };
    }),
    on(prettyTableActions.changeCurrentPage, (state: PrettyTableState, { newCurrentPage }) => ({
      ...state,
      pagination: {
        ...state.pagination,
        currentPage: newCurrentPage,
      },
    })),
    on(prettyTableActions.sortDisplayedUsersDataByField, (state: PrettyTableState, { sortingSettings }) => ({
      ...state,
      sort: {
        field: sortingSettings.field,
        direction: sortingSettings.direction,
      },
    })),
    on(prettyTableActions.filterUsersData, (state: PrettyTableState, { field, value }) => {
      const allFilters: { [key: string] : string } = { ...state.filter, [field]: value };

      const totalItems: UserProfileVm[] =  state.usersData.filter((user: UserProfileVm) => {
        return Object.keys(allFilters).every(key => {
          if (!allFilters[key]) return true;
          if (!user[key as keyof typeof user]) return false;
          return user[key as keyof typeof user].toString().toLowerCase().includes(allFilters[key].toLowerCase());
        });
      });

      return {
        ...state,
        filter: { ...state.filter, [field]: value },
        pagination: {
          ...state.pagination,
          totalItems: totalItems.length > 0 ? totalItems.length : 0,
          currentPage: 1
        }
      }
    }),
    on(prettyTableActions.hideUser, (state: PrettyTableState, { userId }) => {
      const hidingUser: UserProfileVm[] = [...state.usersData].map((user: UserProfileVm): UserProfileVm => user._id === userId ? { ...user, isVisible: false } : user);

      return {
        ...state,
        usersData: hidingUser
      }
    }),
    on(prettyTableActions.showAllUsers, (state: PrettyTableState) => {
      const showAllUsers: UserProfileVm[] = [...state.usersData].map((user: UserProfileVm): UserProfileVm => ({ ...user, isVisible: true }));

      return {
        ...state,
        usersData: showAllUsers
      }
    })
  ),
});
