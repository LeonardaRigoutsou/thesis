import { Component, OnInit } from '@angular/core';
import { Status, TicketMode } from 'src/app/components/ticket/ticket.component';
import { Order } from 'src/app/components/ticket/ticket.component';

@Component({
  selector: 'app-server-order-page',
  templateUrl: './server-order-page.component.html',
  styleUrls: ['./server-order-page.component.css']
})
export class ServerOrderPageComponent {
  showInstructions: boolean = false;
  ticketMode: TicketMode = TicketMode.Total;
  newOrder: Order = {
    serverId: 18,
    tableNum: 1,
    orderDate: "",
    state: Status.open,
    instructions: "string"
    // items: [
    //   {
    //     item: {
    //       itemId: 1,
    //       title: "Capp",
    //       price: 250,
    //       isAvailable: true,
    //       ingredients: "none",
    //       categoryId: 1,
    //       orderitems: {
    //         status: "open",
    //         quantity: 1,
    //         qualifiers: "none",
    //         orderId: 1,
    //         itemId: 1
    //       }
    //     }
    //   },
    //   {
    //     item: {
    //       itemId: 2,
    //       title: "Capp",
    //       price: 250,
    //       isAvailable: true,
    //       ingredients: "none",
    //       categoryId: 1,
    //       orderitems: {
    //         status: "open",
    //         quantity: 1,
    //         qualifiers: "none",
    //         orderId: 1,
    //         itemId: 2
    //       }
    //     }
    //   }
    // ]
  }

  instructionsHandler() {
    this.showInstructions = true;
  }
}
