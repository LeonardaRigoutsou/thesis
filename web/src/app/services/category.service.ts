import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    categories: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);

    constructor(private http: HttpClient) { }

    getCategories() {
        this.http.get<{ categories: Category[] }>('http://localhost:8080/api/categories', {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (response) => {
                this.categories.next(response.categories);
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => { }
        });
    }

    createCategory(newCategory: Category) {
        let errorMessage: string = "";

        this.http.post<{ category: Category }>('http://localhost:8080/api/category', newCategory, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (response) => {
                const updatedCategories = this.categories.getValue();
                updatedCategories.push(response.category);
                this.categories.next(updatedCategories);
            },
            error: (error) => {
                console.log(error);
                errorMessage = error.error.message;
            },
            complete: () => { }
        });

        return errorMessage;
    }

    updateCategory(categoryId: number, editedCategory: Category) {
        let errorMessage: string = "";
        console.log(categoryId);
        this.http.put<{ category: Category }>('http://localhost:8080/api/category/' + categoryId, editedCategory, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (response) => {
                const updatedCategories = this.categories.getValue();
                const index = updatedCategories.findIndex(category => {
                    return category.categoryId === editedCategory.categoryId
                });
                updatedCategories.splice(index, 1, editedCategory);
                this.categories.next(updatedCategories);
            },
            error: (error) => {
                console.log(error);
                errorMessage = error.error.message;
            }
        });

        return errorMessage;
    }

    async deleteCategory(categoryId: number) {
        let errorMessage: string = "";

        this.http.delete<{ category: Category }>('http://localhost:8080/api/category/' + categoryId, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (response) => {
                const updatedCategories = this.categories.getValue();
                const index = updatedCategories.findIndex(category => {
                    return category.categoryId === categoryId;
                })
                updatedCategories.splice(index, 1);
                this.categories.next(updatedCategories);
            },
            error: (error) => {
                console.log(error);
                errorMessage = error.error.message;
            },
            complete: () => { }
        });

        return errorMessage;
    }

}