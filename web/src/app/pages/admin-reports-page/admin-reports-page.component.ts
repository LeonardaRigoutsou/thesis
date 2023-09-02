import { Component, ElementRef, ViewChild } from '@angular/core';
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
  printedDate: string;
  @ViewChild('date') dateRef: ElementRef;
  ticketMode: TicketMode = TicketMode.TOTAL;
  constructor(private orderService: OrderService, private userService: UserService) {
  }

  ngOnInit() {
    this.currentDate = new Date(Date.now());
    this.printedDate = this.formatDate(new Date());
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
    this.printedDate = this.formatDate(this.currentDate);
    this.filterOrders();
  }

  nextDate() {
    let nextDate: Date = new Date(this.currentDate.getTime());
    nextDate.setDate(this.currentDate.getDate() + 1);
    this.currentDate = nextDate;
    this.printedDate = this.formatDate(this.currentDate);
    this.filterOrders();
  }

  changeDate(event: any) {
    this.currentDate = new Date(event.target.value);
    this.filterOrders();
  }

  filterOrders(): void {
    this.filteredOrders = this.orders?.filter((order) => {
      return new Date(order.orderDate).toDateString() === this.currentDate.toDateString() && (order.state === Status.CLOSED || order.state === Status.CANCELLED);
    });
  }

  formatDate(date: Date) {
    return date.toISOString().substring(0, 10);
  }

}
