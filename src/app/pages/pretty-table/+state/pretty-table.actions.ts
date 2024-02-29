import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SortingState } from '@core/models/sorting-state.interface';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';

export const prettyTableActions = createActionGroup({
  source: 'Pretty Table Page',
  events: {
    loadUsers: emptyProps(),
    loadUsersSuccess: props<{ usersData: UserProfileVm[] }>(),
    loadUsersFailure: props<{ error: string }>(),

    updateDisplayedUsersData: props<{ itemsOnPage?: number, currentPage?: number }>(),

    updateItemsOnPage: props<{ itemsOnPage: number }>(),

    changeCurrentPage: props<{ newCurrentPage: number }>(),

    sortDisplayedUsersDataByField: props<{ sortingSettings: SortingState }>(),

    filterUsersData: props<{ field: string, value: string }>(),

    hideUser: props<{ userId?: string }>(),

    showAllUsers: emptyProps()
  }
})
