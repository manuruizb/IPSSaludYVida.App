import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'ol-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent {

  @Input() dataFilled: boolean = false;
  @Input() editable: boolean = false;
  @Input() JSONdata: Array<any> = [];
  @Input() dataValues: Array<DatatableDataValues> = [];
  @Input() itemsPerPage: number = 5;
  @Input() totalItems!: number;
  @Input() keyValue: string = '';
  @Input() paginatePosition: string = 'top';
  @Input() filter: boolean = false;
  @Input() filterPlaceHolder: string = 'Buscar...';
  @Output() pageChange = new EventEmitter<number>();
  @Output() onSearch = new EventEmitter<string>();

  searcherText: string = '';

  currentPage: number = 1;

  pageChanged(event: PageChangedEvent): void {
    let page: number = event.page;
    this.pageChange.emit(page);
  }

  search(): void {
    this.onSearch.emit(this.searcherText);
  }

}

export interface DatatableDataValues {
  id?: string;
  header?: string;
  currency?: boolean;
  date?: boolean;
  hour?: boolean;
  template?: TemplateRef<any>;
  boolean?: boolean;
}
