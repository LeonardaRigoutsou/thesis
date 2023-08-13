import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor(private http: HttpClient) { }

    uploadImage = (file: any, type: string) => {
        let formData: FormData = new FormData();
        formData.append('file', file);
        return this.http.post<HttpResponse<string>>('http://localhost:8080/api/upload', formData, {
            "headers": {
                "Authorization": 'Bearer' + localStorage.getItem('token'),
            },
            "params": {
                "type": type
            }
        }).subscribe({
            next: (response) => { console.log(response) },
            error: (error) => {
                console.log(error)
            },
            complete: () => { }
        });
    }
}
