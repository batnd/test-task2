import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from '@pages/pretty-table/models/pagination.interface';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationDirection } from '@core/models/pagination-direction.enum';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  public _paginationData!: Pagination;
  public readonly paginationDirection = PaginationDirection;

  @Input({ required: true })
  public set paginationData(paginationData: Pagination) {
    this._paginationData = { ...paginationData };
  }

  @Output()
  public changeItemsPerPageEmit: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  public changeCurrentPageEmit: EventEmitter<number> = new EventEmitter<number>();

  public setItemsPerPage(itemsPerPage: Event): void {
    const selectElement: HTMLSelectElement = itemsPerPage.currentTarget as HTMLSelectElement;
    this.changeItemsPerPageEmit.emit(+selectElement.value);
  }

  public changeCurrentPage(direction: PaginationDirection): void {
    let newPage: number = this._paginationData.currentPage;

    switch (direction) {
      case PaginationDirection.Left:
        newPage = Math.max(newPage - 1, 1);
        break;
      case PaginationDirection.Right:
        newPage = Math.min(newPage + 1, this._paginationData.totalPages);
        break;
      case PaginationDirection.LeftEnd:
        newPage = 1;
        break;
      case PaginationDirection.RightEnd:
        newPage = this._paginationData.totalPages;
        break;
    }

    if (newPage !== this._paginationData.currentPage) {
      this.changeCurrentPageEmit.emit(newPage);
    }
  }
}
