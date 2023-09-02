import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Order } from 'src/app/models/order.model';
import { Status } from 'src/app/models/status.model';
import { TicketMode } from 'src/app/models/ticket-mode.model';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'server-order-page',
  templateUrl: './server-order-page.component.html',
  styleUrls: ['./server-order-page.component.css']
})
export class ServerOrderPageComponent implements OnInit, OnDestroy {
  tableNumber: number;
  total: number;
  showInstructions: BehaviorSubject<boolean> = new BehaviorSubject(false);
  instructionsLabel: string = 'Add Instructions';
  editMode: boolean;

  order: Order;
  ticketMode: TicketMode = TicketMode.TOTAL;
  paramsSubscription: Subscription;
  orderSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService, protected orderService: OrderService) { }

  ngOnInit() {
    this.paramsSubscription = this.route.queryParams.subscribe(params => {
      this.tableNumber = params['table'];
    });
    this.orderService.order.subscribe(order => {
      this.order = order;
    });
    this.orderSubscription = this.orderService.getOrderByTableNum(this.tableNumber).subscribe({
      next: (result) => {
        if (result.order.orderId === 0) {
          result.order.serverId = +(localStorage.getItem('userId') as string)
          result.order.username = localStorage.getItem('username') as string;
        }
        this.order = result.order;
        this.editMode = result.order?.state === "OPEN" || result.order?.state === "MADE";
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.orderService.order.next(this.order);
      }
    });
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.orderSubscription.unsubscribe();
  }

  instructionsHandler() {
    this.instructionsLabel = this.showInstructions.getValue() ? 'Add Instructions' : 'Clear Instructions';
    this.showInstructions.next(!this.showInstructions.getValue());
  }

  onCancel() {
    this.router.navigate(['/server/map']);
    this.order.state = Status.CANCELLED;
    this.orderService.updateOrder(this.orderService.order.getValue().orderId, this.order);
  }

  onClose() {
    this.router.navigate(['/server/map']);
    this.order.state = Status.CLOSED;
    this.orderService.updateOrder(this.orderService.order.getValue().orderId, this.order);
  }

  onUpdate() {
    this.router.navigate(['/server/map']);
    this.order.state = Status.OPEN;
    this.orderService.updateOrder(this.orderService.order.getValue().orderId, this.order);
  }

  onPlace() {
    this.router.navigate(['/server/map']);
    this.order.state = Status.OPEN;
    this.orderService.createOrder(this.order);
  }
}
