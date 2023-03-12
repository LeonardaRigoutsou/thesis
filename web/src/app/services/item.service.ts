import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

export interface Item {
    itemId: number,
    title: string,
    price: number,
    isAvailable: boolean,
    ingredients: string
}

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    items: Item[] = [];

    constructor() { }

    async getItemsByCategoryId(categoryId: number): Promise<Item[]> {

        try {
            const response: Response = await fetch('http://localhost:8080/api/items/' + categoryId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                }
            });

            if (response.status === 200) {
                await response.json().then(body => { this.items = body.items; });
            }
        } catch (err) {
            console.log(err);
        }

        return this.items;
    }

    async createItem(newItem: Item): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/item', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                },
                body: JSON.stringify(newItem)
            });

            if (response.status === 200) {
                await response.json().then(body => this.items.push(body.item));
            } else if (response.status === 500 || response.status === 409) {
                await response.json().then(body => errorMessage = body.message);
            }
        } catch (err) {
            console.log(err);
        }

        return errorMessage;
    }

    async updateItem(editedItem: Item, itemId: number): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/item/' + itemId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                },
                body: JSON.stringify(editedItem)
            });

            if (response.status === 200) {
                const index = this.items.findIndex(item => {
                    return item.itemId === editedItem.itemId
                });
                console.log(index);
                this.items.splice(index, 1, editedItem);
            } else if (response.status === 500 || response.status === 400) {
                await response.json().then(body => errorMessage = body.message);
            }

        } catch (err) {
            console.log(err);
        }
        return errorMessage;
    }

    async deleteItem(itemId: number): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/item/' + itemId, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                }
            });

            if (response.status === 200) {
                const index = this.items.findIndex(item => {
                    item.itemId === itemId
                })
                this.items.splice(index, 1);
            } else if (response.status === 500 || response.status === 400 || response.status === 404) {
                await response.json().then(body => errorMessage = body.message);
            }

        } catch (err) {
            console.log(err);
        }
        return errorMessage;

    }

}
