import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Item } from './item.service';
import { TableService } from './table.service';
import { io } from 'socket.io-client';

export enum TicketMode {
    TOTAL = 'TOTAL',
    BUTTONS = 'BUTTONS',
    LABELS = 'LABELS'
}

export enum Status {
    NEW = 'NEW',
    OPEN = 'OPEN',
    CANCELLED = 'CANCELLED',
    MADE = 'MADE',
    CLOSED = 'CLOSED'
}

export interface OrderItem {
    status: Status,
    quantity: number,
    qualifiers: string,
    orderId: number,
    itemId: number
}

export interface Order {
    orderId: number;
    serverId: number,
    tableNum: number,
    orderDate: string,
    orderTotal: number,
    state: Status,
    instructions: string,
    items: Item[],
    username: string
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    order: BehaviorSubject<Order> = new BehaviorSubject<Order>({} as Order);
    orders: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);

    socket = io('localhost:8080');

    getOrdersFromSocket() {
        this.socket.on('orders', order => {
            console.log(order);
            let updatedOrders = this.orders.getValue();
            updatedOrders.push(order);
            this.orders.next(updatedOrders);
        });

        return this.orders.asObservable();
    }

    updateOrderWithSocket(order: Order) {
        this.socket.emit('order', order);
    }

    constructor(private http: HttpClient, private tableService: TableService) { }

    getOrderByTableNum(tableId: number) {
        return this.http.get<{ order: Order }>('http://localhost:8080/api/order/table/' + tableId, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    }

    getOrders() {
        this.http.get<{ fetchedOrders: Order[] }>('http://localhost:8080/api/orders', {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (value) => {
                this.orders.next(value.fetchedOrders);
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => { }
        })
    }

    createOrder(order: Order) {
        console.log(order);
        this.http.post<Order>('http://localhost:8080/api/order', this.order.getValue(), {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (value) => {
                this.order.next(value);
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => { }
        })
    }

    updateOrder(orderId: number, order: Order) {
        this.http.put<{ order: Order }>('http://localhost:8080/api/order/' + orderId, order, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (result) => {
                this.order.next(result.order);
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => {
                if (this.order.getValue()?.state === Status.CLOSED || this.order.getValue()?.state === Status.CANCELLED) {
                    this.tableService.closeOrder(this.order.getValue().tableNum);
                }
            }
        })
    }

}
