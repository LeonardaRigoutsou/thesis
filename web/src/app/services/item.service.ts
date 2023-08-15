import { Injectable } from '@angular/core';
import { OrderItem } from './order.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface Item {
    itemId: number,
    title: string,
    categoryId: number,
    price: number,
    isAvailable: boolean,
    ingredients: string,
    orderitems: OrderItem
}

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    items: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

    constructor(private http: HttpClient) { }

    getItemsByCategoryId(categoryId: number) {
        return this.http.get<{ items: Item[] }>('http://localhost:8080/api/items/' + categoryId, {
            "headers": {
                "Authorization": 'Bearer ' + localStorage.getItem('token')
            }
        });
    }

    createItem(newItem: Item) {
        let errorMessage: string = "";

        this.http.post<{ item: Item }>('http://localhost:8080/api/item', newItem, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (response) => {
                let updatedItems = this.items.getValue();
                updatedItems.push(response.item);
                this.items.next(updatedItems);
            },
            error: (error) => {
                console.log(error);
                errorMessage = error.message;
            },
            complete: () => { }
        });

        return errorMessage;
    }

    updateItem(itemId: number, editedItem: Item) {
        let errorMessage: string = "";

        this.http.put<{ item: Item }>('http://localhost:8080/api/item/' + itemId, editedItem, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (response) => {
                let editedItems = this.items.getValue();

                const index = editedItems.findIndex(item => {
                    return item.itemId === response.item.itemId
                });
                editedItems.splice(index, 1, editedItem);
                this.items.next(editedItems);
            },
            error: (error) => {
                console.log(error);
                errorMessage = error.message;
            },
            complete: () => { }
        });

        return errorMessage;
    }

    deleteItem(itemId: number) {
        return this.http.delete<{ item: Item }>('http://localhost:8080/api/item/' + itemId, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    }

}
