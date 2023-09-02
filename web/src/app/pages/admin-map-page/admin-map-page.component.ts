import { Component, ViewContainerRef, ViewChild, OnInit, ComponentRef } from '@angular/core';
import { InsertionPointDirective } from 'src/app/directives/insertion-point.directive';
import { DragableIconComponent } from 'src/app/components/dragable-icon/dragable-icon.component';
import { TableService } from 'src/app/services/table.service';
import { PlacedDragableIconComponent } from 'src/app/components/placed-dragable-icon/placed-dragable-icon.component';
import { Table } from 'src/app/models/table.model';

@Component({
  selector: 'app-admin-map-page',
  templateUrl: './admin-map-page.component.html',
  styleUrls: ['./admin-map-page.component.css']
})
export class AdminMapPageComponent implements OnInit {

  tableList: ComponentRef<DragableIconComponent>[] = [];
  placedTableList: ComponentRef<PlacedDragableIconComponent>[] = [];
  tables: Table[];

  @ViewChild('tables', { read: ViewContainerRef }) mapContainerRef: ViewContainerRef;
  @ViewChild(InsertionPointDirective) insertionPoint: InsertionPointDirective;

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.getTables().subscribe({
      next: (response) => {
        this.tables = response.tables;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.tableService.tables.next(this.tables);
        this.placeTables();
      }
    });
  }

  createDragableIcon(event: any) {
    const viewContainerRef = this.insertionPoint.viewContainerRef;

    const table = {} as Table;

    const componentRef = viewContainerRef.createComponent<DragableIconComponent>(DragableIconComponent);
    componentRef.instance.table = table;
    componentRef.instance.onDeleteTable.subscribe(tableNum => this.destoyDragableIcon(tableNum));
    this.tableList.push(componentRef);
  }

  destoyDragableIcon(deleteNumber: number) {
    const deleteIndex = this.tableList.findIndex(ref => {
      return ref.instance.table.tableNum === deleteNumber;
    });

    if (deleteIndex !== -1) {
      const toDeleteComponent = this.tableList.at(deleteIndex);
      this.tableList.splice(deleteIndex, 1);
      toDeleteComponent?.destroy();
      this.tableService.deleteTable(deleteNumber);
      return;
    }

    const deletePlacedIndex = this.placedTableList.findIndex(ref => {
      return ref.instance.table.tableNum === deleteNumber;
    })

    if (deletePlacedIndex !== -1) {
      const toDeletePlacedComponent = this.placedTableList.at(deletePlacedIndex);
      this.placedTableList.splice(deletePlacedIndex, 1);
      toDeletePlacedComponent?.destroy();
      this.tableService.deleteTable(deleteNumber);
    }

  }

  placeTables() {
    this.tables.forEach(table => {
      let tableRef = this.mapContainerRef.createComponent(PlacedDragableIconComponent);

      tableRef.instance.table = table;
      tableRef.instance.dropped = true;
      tableRef.instance.valid = true;
      tableRef.instance.hasValue = true;
      tableRef.instance.onDeleteTable.subscribe(tableNum => this.destoyDragableIcon(tableNum));
      this.placedTableList.push(tableRef);
    })
  }

  tableExists(tableNum: number): boolean {
    return !this.tables.find(table => {
      return table.tableNum === tableNum;
    });
  }
}
