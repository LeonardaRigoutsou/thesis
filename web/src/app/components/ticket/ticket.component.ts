import { InputModalityDetector } from '@angular/cdk/a11y';
import { Component, Input } from '@angular/core';

export enum TicketMode {
  Total,
  Buttons,
  Labels
}

export enum Status {
  open = "open",
  cancelled = "cancelled",
  made = "made",
  closed = "closed"
}

// export interface OrderItem {
//   item: Item,
//   orderitems: {
//     status: Status,
//     quantity: number,
//     qualifiers: string,
//     orderId: number,
//     itemId: number
//   };
// }

export interface Item {
  itemId: number,
  title: string,
  price: number,
  isAvailable: boolean,
  ingredients: string,
  categoryId: number,
}

export interface Order {
  serverId: number,
  tableNum: number,
  orderDate: string,
  state: Status,
  instructions: string,
  //items: OrderItem[]
}

@Component({
  selector: 'ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent {
  showInstructions: boolean = false;
  @Input() mode: TicketMode;
  @Input() order: Order;
  newItem: Item;
  items: Item[];
  TicketMode = TicketMode;
  OrderStatus = Status;

  instructionsHandler() {
    this.showInstructions = true;
  }

  isMode(ticketMode: TicketMode): boolean {
    return this.mode === ticketMode;
  }

}
