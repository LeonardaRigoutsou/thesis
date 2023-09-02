import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Table } from "../models/table.model";

@Injectable({
    providedIn: 'root'
})
export class TableService {
    tables: BehaviorSubject<Table[]> = new BehaviorSubject<Table[]>([]);

    constructor(private http: HttpClient) { }

    getTables() {
        return this.http.get<{ tables: Table[] }>('http://localhost:8080/api/tables', {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    }

    createTable(table: Table) {
        return this.http.post<Table>('http://localhost:8080/api/table', table, {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
    }

    updateTable(tableId: number, table: Table) {
        this.http.put<Table>('http://localhost:8080/api/table/' + tableId, table, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (result) => {
                const updatedTables = this.tables.getValue();
                let index = updatedTables.findIndex(table => { return table.tableNum === tableId });
                updatedTables.splice(index, 1, result);
                this.tables.next(updatedTables);
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => {

            }
        })
    }

    deleteTable(tableId: number) {
        this.http.delete<Table>('http://localhost:8080/api/table/' + tableId, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (result) => {
                const updatedTables = this.tables.getValue();
                let index = updatedTables.findIndex(table => { return table.tableNum === tableId });
                updatedTables.splice(index, 1);
                this.tables.next(updatedTables);
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => {

            }
        })
    }

    closeOrder(tableId: number) {
        const updatedTables = this.tables.getValue();
        let index = updatedTables.findIndex(table => { return table.tableNum === tableId });
        updatedTables.splice(index, 1);
        this.tables.next(updatedTables);
    }
} 