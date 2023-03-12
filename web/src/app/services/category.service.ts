import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

export interface Category {
    name: string,
    isAvailable: boolean,
    categoryId: number
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    categories: Category[] = [];

    constructor() { }

    async getCategories(): Promise<Category[]> {

        try {
            const response: Response = await fetch('http://localhost:8080/api/categories', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
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
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                },
                body: JSON.stringify(newCategory)
            });

            if (response.status === 200) {
                await response.json().then(body => this.categories.push(body.category));
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
            const response: Response = await fetch('http://localhost:8080/api/reservation/' + categoryId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                },
                body: JSON.stringify(editedCategory)
            });

            if (response.status === 200) {
                const index = this.categories.findIndex(reservation => {
                    return reservation.categoryId === editedCategory.categoryId
                });
                console.log(index);
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
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
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
