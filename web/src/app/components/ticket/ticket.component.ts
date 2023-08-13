import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/services/item.service';
import { Order, TicketMode, Status, OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit, OnDestroy {
  @Input() showInstructions: boolean = false;
  @Input() mode: TicketMode;
  @Input() tableNumber: number;
  @Input() order: Order;
  @Input() editMode: boolean;
  newItem: Item;
  items: Item[];
  TicketMode = TicketMode;
  Status = Status;
  label: string;
  server: string;
  role: string;
  orderSubscription: Subscription

  constructor(private orderService: OrderService, private userService: UserService) { }

  ngOnInit() {
    if (!this.order) {
      this.orderSubscription = this.orderService.order.subscribe({
        next: (order) => {
          this.order = order;
          this.editMode = this.order.state === "OPEN" || this.order.state === "MADE";
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.server = this.order.username;
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (!this.order) {
      this.orderSubscription.unsubscribe();
    }
  }

  isMode(ticketMode: string): boolean {
    this.label = this.mode;
    return this.mode == ticketMode;
  }

  getTicketStyle(): any {
    if (this.order == null) {
      return {
        'border-color': '#5b5b5b',
        'border-width': '2px'
      };
    }

    if (this.order.state === Status.MADE) {
      return {
        'border-color': 'darkgreen',
        'border-width': '3px'
      }
    }

    if (this.order.state === Status.CANCELLED) {
      return {
        'border-color': 'darkred',
        'border-width': '3px'
      }
    }
  }

  getItemStyle(item: Item): any {
    if (item.orderitems?.status === Status.OPEN) {
      return {
        'border-color': '#5b5b5b',
        'border-width': '2px'
      };
    }

    if (item.orderitems?.status === Status.MADE) {
      return {
        'border-color': 'darkgreen',
        'border-width': '3px'
      }
    }

    if (item.orderitems?.status === Status.CANCELLED) {
      return {
        'border-color': 'darkred',
        'border-width': '3px'
      };
    }
  }

  cancelOrder(event: any) {
    this.order.state = Status.CANCELLED;
    this.orderService.updateOrder(this.order.orderId, this.order);
    this.orderService.updateOrderWithSocket(this.order);
  }

  makeOrder(event: any) {
    this.order.state = Status.MADE;
    this.orderService.updateOrder(this.order.orderId, this.order);
    this.orderService.updateOrderWithSocket(this.order);
  }

  onDeleteItem(removedItem: Item) {
    const index = this.order.items.findIndex(item => {
      return item.itemId === removedItem.itemId;
    });
    if (removedItem.orderitems.quantity > 1) {
      removedItem.orderitems.quantity -= 1;
      this.order.orderTotal -= removedItem.price;
    } else {
      this.order.items.splice(index, 1);
      this.order.orderTotal -= removedItem.price;
    }
    this.orderService.order.next(this.order);
  }

}
