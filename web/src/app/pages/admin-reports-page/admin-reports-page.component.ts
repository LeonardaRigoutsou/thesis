import { Component } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { Status } from 'src/app/models/status.model';
import { TicketMode } from 'src/app/models/ticket-mode.model';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-reports-page',
  templateUrl: './admin-reports-page.component.html',
  styleUrls: ['./admin-reports-page.component.css']
})
export class AdminReportsPageComponent {
  orders: Order[];
  selectedOrder: Order;
  filteredOrders: Order[];
  currentDate: Date;
  ticketMode: TicketMode = TicketMode.TOTAL;
  constructor(private orderService: OrderService, private userService: UserService) {
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.orderService.getOrders();
    this.userService.getUsers();
    this.orderService.orders.subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filterOrders();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => { }
    });
  }

  displayOrder(order: Order) {
    this.selectedOrder = order;
    this.orderService.order.next(order);
  }

  previousDate() {
    let prevDate: Date = new Date(this.currentDate.getTime());
    prevDate.setDate(this.currentDate.getDate() - 1);
    this.currentDate = prevDate;
    this.filterOrders();
  }

  nextDate() {
    let nextDate: Date = new Date(this.currentDate.getTime());
    nextDate.setDate(this.currentDate.getDate() + 1);
    this.currentDate = nextDate;
    this.filterOrders();
  }

  filterOrders(): void {
    this.filteredOrders = this.orders?.filter((order) => {
      return new Date(order.orderDate).toDateString() === this.currentDate.toDateString() && (order.state === Status.CLOSED || order.state === Status.CANCELLED);
    });
  }

}
