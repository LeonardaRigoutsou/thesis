import { Injectable } from "@angular/core";

export interface Table {
    tableNum: number,
    seats: number,
    locationX: number,
    locationY: number
}

@Injectable({
    providedIn: 'root'
})
export class TableService {
    tables: Table[] = [];

    async getTables(): Promise<Table[]> {

        try {
            const response: Response = await fetch('http://localhost:8080/api/tables', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });

            if (response.status === 200) {
                await response.json().then(body => { this.tables = body.tables; });
            }
        } catch (err) {
            console.log(err);
        }

        return this.tables;
    }
}