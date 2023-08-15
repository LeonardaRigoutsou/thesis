import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Status } from 'src/app/services/order.service';
import { Table } from 'src/app/services/table.service';

@Component({
  selector: 'table-button',
  templateUrl: './table-button.component.html',
  styleUrls: ['./table-button.component.css']
})
export class TableButtonComponent {
  @Input() img: string = '';
  @Input() table: Table;
  order: Order = {
    state: 'NEW'
  } as Order;

  constructor(private router: Router) { }

  onTableClick(tableId: number) {
    this.router.navigate(['server', 'order'], {
      queryParams: {
        table: tableId
      }
    });
  }

  getTableBorder() {
    if (this.order.state === Status.MADE) {
      return {
        border: '2px solid darkgreen'
      }
    } else if (this.order.state === Status.CANCELLED) {
      return {
        border: '2px solid darkred'
      }
    } else if (this.order.state === Status.OPEN) {
      return {
        border: '2px dotted #BEBEBE'
      }
    } else {
      return {
        border: 'none'
      }
    }
  }
}
