import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TableService } from './table.service';
import { io } from 'socket.io-client';
import { Order } from '../models/order.model';
import { Status } from '../models/status.model';


@Injectable({
    providedIn: 'root'
})
export class OrderService {
    fetchedOrder: BehaviorSubject<Order> = new BehaviorSubject<Order>({} as Order);
    order: BehaviorSubject<Order> = new BehaviorSubject<Order>({} as Order);
    orders: BehaviorSubject<Order[]> = new BehaviorSubject<Order[]>([]);

    socket = io('localhost:8080');

    getOrderFromSocket() {
        this.socket.on('order', response => {
            this.fetchedOrder.next(response.order);
        });

        return this.fetchedOrder.asObservable();
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
