import { Component, ViewChild, ViewContainerRef, OnInit, ComponentRef } from '@angular/core';
import { TableButtonComponent } from 'src/app/components/table-button/table-button.component';
import { Order } from 'src/app/models/order.model';
import { Table } from 'src/app/models/table.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-server-map-page',
  templateUrl: './server-map-page.component.html',
  styleUrls: ['./server-map-page.component.css']
})
export class ServerMapPageComponent implements OnInit {

  tables: Table[] = [];
  orders: Order[] = [];
  tableRefs: ComponentRef<TableButtonComponent>[] = [];
  @ViewChild('tables', { read: ViewContainerRef }) mapContainerRef: ViewContainerRef;

  constructor(private authService: AuthService, private tableService: TableService, private orderService: OrderService) { }

  ngOnInit(): void {
    this.tableService.getTables().subscribe({
      next: (response) => {
        this.tables = response.tables;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.placeTables();
      }
    });
    this.orderService.getOrderFromSocket().subscribe(order => {
      this.tableRefs.forEach(tableRef => {
        if (order.tableNum === tableRef.instance.table.tableNum) {
          tableRef.instance.order = order;
          console.log(order);
          return;
        }
      });
    });
  }

  onLogout() {
    this.authService.logout();
  }

  placeTables() {
    this.tables.forEach(table => {
      let tableRef = this.mapContainerRef.createComponent(TableButtonComponent);
      tableRef.instance.table = table;

      this.orderService.getOrderByTableNum(table.tableNum).subscribe(response => {
        tableRef.instance.order = response.order;
      });
      this.tableRefs.push(tableRef);
    })
  }
}
