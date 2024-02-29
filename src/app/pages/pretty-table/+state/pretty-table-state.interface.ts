import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';
import { LoadingStatus } from '@core/models/loading-status.type';
import { Pagination } from '@pages/pretty-table/models/pagination.interface';
import { SortingState } from '@core/models/sorting-state.interface';

export interface PrettyTableState {
  usersData: UserProfileVm[],
  userDataLoadingStatus: LoadingStatus | null,
  filters: {
    query: string
  },
  sort: SortingState,
  pagination: Pagination,
  filter: {
    [key: string]: string,
  },
  tags: string[]
}
