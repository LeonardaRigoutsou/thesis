import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Category {
    name: string,
    qualifierType: string,
    isAvailable: boolean,
    categoryId: number
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    categories: Category[] = [];

    constructor(private authService: AuthService) { }

    async getCategories(): Promise<Category[]> {

        try {
            const response: Response = await fetch('http://localhost:8080/api/categories', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (response.status === 200) {
                await response.json().then(body => { this.categories = body.categories; });
            }
        } catch (err) {
            console.log(err);
        }

        return this.categories;
    }

    async createCategory(newCategory: Category): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/category', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(newCategory)
            });

            if (response.status === 200) {
                await response.json().then(body => this.categories.push(body.newCategory));
            } else if (response.status === 500 || response.status === 409) {
                await response.json().then(body => errorMessage = body.message);
            }
        } catch (err) {
            console.log(err);
        }

        return errorMessage;
    }

    async updateCategory(editedCategory: Category, categoryId: number): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/category/' + categoryId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(editedCategory)
            });

            if (response.status === 200) {
                const index = this.categories.findIndex(reservation => {
                    return reservation.categoryId === editedCategory.categoryId
                });
                this.categories.splice(index, 1, editedCategory);
            } else if (response.status === 500 || response.status === 400) {
                await response.json().then(body => errorMessage = body.message);
            }

        } catch (err) {
            console.log(err);
        }
        return errorMessage;
    }

    async deleteCategory(categoryId: number): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/category/' + categoryId, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (response.status === 200) {
                const index = this.categories.findIndex(category => {
                    category.categoryId === categoryId
                })
                this.categories.splice(index, 1);
            } else if (response.status === 500 || response.status === 400 || response.status === 404) {
                await response.json().then(body => errorMessage = body.message);
            }
        } catch (err) {
            console.log(err);
        }
        return errorMessage;
    }

}