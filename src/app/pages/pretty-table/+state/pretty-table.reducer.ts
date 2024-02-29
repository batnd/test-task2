import { PrettyTableState } from '@pages/pretty-table/+state/pretty-table-state.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { prettyTableActions } from '@pages/pretty-table/+state/pretty-table.actions';
import { LoadingStatus } from '@core/models/loading-status.type';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';
import { filterUsers } from '@pages/pretty-table/utility/filter-users';

export const PRETTY_TABLE_FEATURE_KEY: string = 'pretty-table';

const initialState: PrettyTableState = {
  usersData: [],
  userDataLoadingStatus: null,
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
  tags: [],
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
      let newTags: string[] = state.tags;
      let allFilters: { [key: string]: string } = { ...state.filter };

      if (field === 'tags') {
        newTags = value !== 'ClearAllTags' ? newTags.includes(value) ? newTags : [...newTags, value] : [];
      } else {
        allFilters[field] = value;
      }

      const totalItems: UserProfileVm[] = filterUsers(state.usersData, allFilters, newTags);
      const totalPages: number = Math.ceil(totalItems.length / state.pagination.itemsOnPage);

      return {
        ...state,
        filter: allFilters,
        pagination: {
          ...state.pagination,
          totalItems: totalItems.length,
          currentPage: 1,
          totalPages: totalPages,
        },
        tags: newTags,
      };
    }),
    on(prettyTableActions.hideUser, (state: PrettyTableState, { userId }) => {
      const hidingUser: UserProfileVm[] = [...state.usersData].map((user: UserProfileVm): UserProfileVm => user._id === userId ? {
        ...user,
        isVisible: false,
      } : user);

      return {
        ...state,
        usersData: hidingUser,
      };
    }),
    on(prettyTableActions.showAllUsers, (state: PrettyTableState) => {
      const showAllUsers: UserProfileVm[] = [...state.usersData].map((user: UserProfileVm): UserProfileVm => ({
        ...user,
        isVisible: true,
      }));

      return {
        ...state,
        usersData: showAllUsers,
      };
    }),
  ),
});
