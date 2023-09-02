import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableService } from '../../services/table.service';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Table } from 'src/app/models/table.model';

@Component({
  selector: 'placed-dragable-icon',
  templateUrl: './placed-dragable-icon.component.html',
  styleUrls: ['./placed-dragable-icon.component.css'],
  standalone: true,
  imports: [CdkDrag, CdkDropList, CommonModule]
})
export class PlacedDragableIconComponent {

  table: Table;
  tableRef: any;
  @Input() dropped: boolean;
  hasValue: boolean;
  errorMessage: string;
  valid: boolean;
  tableInput: Subject<string> = new Subject<string>();
  @Output() onDeleteTable: EventEmitter<number> = new EventEmitter<number>();

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableInput.pipe(
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(newValue => {
      this.saveTable(newValue);
    });
  }

  onTableInput(event: any) {
    console.log(event);
    this.errorMessage = "";
    this.tableInput.next(event.target.value);
  }

  deleteTable() {
    this.onDeleteTable.emit(this.table.tableNum);
  }

  saveTable(tableNum: string) {
    this.hasValue = tableNum !== '';
    this.table.tableNum = +tableNum;

    if (!this.hasValue) {
      return;
    }

    this.tableService.createTable(this.table).subscribe({
      next: (response) => {
        this.table = response;
      },
      error: (error) => {
        this.valid = false;
        this.errorMessage = error.error.message;
      },
      complete: () => {
        this.valid = true;
      }
    });
  }

}
