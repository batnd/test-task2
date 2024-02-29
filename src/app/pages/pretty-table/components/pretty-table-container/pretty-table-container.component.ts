import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { UsersTableComponent } from '@shared/components/users-table/users-table.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PrettyTableFacade } from '@pages/pretty-table/+state/pretty-table.facade';
import { Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';
import { Pagination } from '@pages/pretty-table/models/pagination.interface';
import { SortingState } from '@core/models/sorting-state.interface';
import { Filtering } from '@pages/pretty-table/models/filtering.interface';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';

@Component({
  selector: 'app-pretty-table-container',
  standalone: true,
  imports: [
    UsersTableComponent,
    PaginationComponent,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './pretty-table-container.component.html',
  styleUrl: './pretty-table-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrettyTableContainerComponent implements OnInit {
  private readonly prettyTableFacade: PrettyTableFacade = inject(PrettyTableFacade);
  public sortState$: Observable<SortingState> = this.prettyTableFacade.sortState$;

  public displayedUsers$: Observable<UserProfileVm[]> = this.prettyTableFacade.displayedUsers$;
  public displayedHiddenUsers$: Observable<number> = this.prettyTableFacade.displayedHiddenUsers$;

  public pagination$: Observable<Pagination> = this.prettyTableFacade.pagination$;

  ngOnInit(): void {
    this.prettyTableFacade.loadUsers();
  }

  public changeItemsPerPage(newItemsPerPage: number): void {
    this.prettyTableFacade.changeItemsPerPage(newItemsPerPage);
  }

  public changeCurrentPage(newCurrentPage: number): void {
    this.prettyTableFacade.changeCurrentPage(newCurrentPage);
  }

  public setSorting(sortingSettings: SortingState): void {
    this.prettyTableFacade.changeSortingSettings(sortingSettings);
  }

  public setFiltering(filteringSettings: Filtering): void {
    this.prettyTableFacade.changeFilteringSettings(filteringSettings);
  }

  public hideUser(id: string): void {
    this.prettyTableFacade.hideUser(id);
  }

  public showAllUsers(): void {
    this.prettyTableFacade.showAllUsers();
  }
}
