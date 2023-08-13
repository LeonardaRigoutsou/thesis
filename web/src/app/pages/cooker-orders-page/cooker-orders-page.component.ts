import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Order, OrderService, Status, TicketMode } from 'src/app/services/order.service';

@Component({
  selector: 'cooker-orders-page',
  templateUrl: './cooker-orders-page.component.html',
  styleUrls: ['./cooker-orders-page.component.css']
})
export class CookerOrdersPageComponent implements OnInit, OnDestroy {

  orderSubscription: Subscription;
  orders: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  filteredOrders: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);
  ticketMode: TicketMode = TicketMode.BUTTONS;

  constructor(private authService: AuthService, private orderService: OrderService) { }

  ngOnInit() {
    this.orderService.orders.subscribe(orders => {
      this.orders.next(orders);
    })
    this.orderSubscription = this.orders
      .pipe(map(orders => {
        return orders?.filter((order) => {
          return order.state === Status.OPEN;
        });
      }))
      .subscribe({
        next: (orders) => {
          this.filteredOrders.next(orders);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => { }
      });

    this.orderService.getOrdersFromSocket().subscribe((orders) => {
      this.orders.next(orders);
    })

    this.orderService.getOrders();
  }

  ngOnDestroy(): void {
    this.orderSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
