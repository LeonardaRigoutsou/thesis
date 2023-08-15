import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'src/app/services/table.service';

@Component({
  selector: 'table-button',
  templateUrl: './table-button.component.html',
  styleUrls: ['./table-button.component.css']
})
export class TableButtonComponent {
  @Input() img: string = '';
  @Input() table: Table;

  constructor(private router: Router) { }

  onTableClick(tableId: number) {
    this.router.navigate(['server', 'order'], {
      queryParams: {
        table: tableId
      }
    });
  }
}
