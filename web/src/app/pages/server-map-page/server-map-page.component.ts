import { Component, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DragableIconComponent } from 'src/app/components/dragable-icon/dragable-icon.component';
import { TableButtonComponent } from 'src/app/components/table-button/table-button.component';
import { AuthService } from 'src/app/services/auth.service';
import { Table, TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-server-map-page',
  templateUrl: './server-map-page.component.html',
  styleUrls: ['./server-map-page.component.css']
})
export class ServerMapPageComponent implements OnInit {

  tables: Table[] = [];
  @ViewChild('tables', { read: ViewContainerRef }) mapContainerRef: ViewContainerRef;

  constructor(private authService: AuthService, private tableService: TableService, private router: Router) { }

  ngOnInit(): void {
    this.tableService.getTables().subscribe({
      next: (response) => {
        this.tables = response.tables;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.placeTables();
      }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  placeTables() {
    this.tables.forEach(table => {
      let tableRef = this.mapContainerRef.createComponent(TableButtonComponent);
      tableRef.instance.table = table;
    })
  }
}
