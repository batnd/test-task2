import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgForOf, NgIf, TitleCasePipe } from '@angular/common';
import { UserProfileVm } from '@pages/pretty-table/models/user-profile-vm.interface';
import { SortingState } from '@core/models/sorting-state.interface';
import { Filtering } from '@pages/pretty-table/models/filtering.interface';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    NgIf,
  ],
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss', 'users-table-adaptive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersTableComponent implements OnInit {
  @Input({ required: true })
  public usersData: UserProfileVm[] | null = null;
  @Input({ required: true })
  public sortingSettings: SortingState | null = null;
  @Input({ required: true })
  public hiddenUsers: number | null = null;
  @Output()
  public sortingEmit: EventEmitter<SortingState> = new EventEmitter<SortingState>();
  @Output()
  public filteringEmit: EventEmitter<Filtering> = new EventEmitter<Filtering>();
  @Output()
  public hideUserEmit: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  public showAllUsersEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  private filterInputSubject: Subject<Filtering> = new Subject<Filtering>();
  private destroyRef: DestroyRef = inject(DestroyRef);

  public inputStates: { [key: string]: string } = {
    name: '',
    lastName: '',
    age: '',
    address: '',
    email: '',
    company: '',
    balance: '',
    favoriteFruit: '',
  };

  ngOnInit(): void {
    this.filterInputSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(({ field, value }): void => {
      this.filteringEmit.emit({ field, value });
    })
  }

  public getSvgClass(field: string): string {
    if (!this.sortingSettings || this.sortingSettings.field !== field) {
      return 'filter-none';
    }
    return this.sortingSettings.direction === 'asc' ? 'filter-asc' : (this.sortingSettings.direction === 'desc' ? 'filter-desc' : 'filter-none');
  }

  public onSort(field: string): void {
    let direction: 'asc' | 'desc' | '' = this.sortingSettings?.field === field
      ? (this.sortingSettings.direction === 'asc' ? 'desc' : (this.sortingSettings.direction === 'desc' ? '' : 'asc'))
      : 'asc';
    const sortingSettings: SortingState = { field, direction };
    this.sortingEmit.emit(sortingSettings);
  }

  public filtering(field: string, input: Event): void {
    const value: string = (input.target as HTMLInputElement).value;
    this.inputStates[field] = value;
    this.filterInputSubject.next({ field, value });
  }

  public clearFiltering(field: string, input: HTMLInputElement): void {
    input.value = '';
    this.inputStates[field] = '';
    this.filteringEmit.emit({ field, value: '' });
  }

  public isInputFilled(field: string): boolean {
    return !!this.inputStates[field];
  }

  public onHide(id: string): void {
    this.hideUserEmit.emit(id);
  }

  public showAll(): void {
    if (this.hiddenUsers) {
      this.showAllUsersEmit.emit(true);
    }
  }

}
