import { Component, ViewContainerRef, ViewChild, OnInit, ComponentRef, TemplateRef } from '@angular/core';
import { InsertionPointDirective } from 'src/app/directives/insertion-point.directive';
import { DragableIconComponent } from 'src/app/components/dragable-icon/dragable-icon.component';
import { Table, TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-admin-map-page',
  templateUrl: './admin-map-page.component.html',
  styleUrls: ['./admin-map-page.component.css']
})
export class AdminMapPageComponent implements OnInit {

  tableList: ComponentRef<DragableIconComponent>[] = [];
  tables: Table[];

  @ViewChild('tables', { read: ViewContainerRef }) mapContainerRef: ViewContainerRef;
  @ViewChild('template', { read: TemplateRef }) tableTemplateRef: TemplateRef<ComponentRef<DragableIconComponent>>;
  @ViewChild(InsertionPointDirective) dragableIcon: InsertionPointDirective;

  constructor(private tableService: TableService) { }

  ngOnInit() {
    this.tableService.deletedTable.subscribe(table => {
      this.destoyDragableIcon(table.tableNum);
    });
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
    const viewContainerRef = this.dragableIcon.viewContainerRef;

    const table = {} as Table;

    const componentRef = this.mapContainerRef.createComponent<DragableIconComponent>(DragableIconComponent);
    componentRef.instance.table = table;
    componentRef.instance.onDeleteTable.subscribe(tableNum => this.destoyDragableIcon(tableNum));
    this.tableList.push(componentRef);
  }

  destoyDragableIcon(deleteNumber: number) {
    const deleteIndex = this.tableList.findIndex(ref => {
      return ref.instance.table.tableNum === deleteNumber
    });
    const toDeleteComponent = this.tableList.at(deleteIndex);
    this.tableList.splice(deleteIndex, 1);
    toDeleteComponent?.destroy();

    this.tableService.deleteTable(deleteNumber);
  }

  placeTables() {
    this.tables.forEach(table => {
      let tableRef = this.mapContainerRef.createComponent(DragableIconComponent);

      tableRef.instance.table = table;
      tableRef.instance.dropped = true;
      tableRef.instance.valid = true;
      tableRef.instance.hasValue = true;
      this.tableList.push(tableRef);
    })
  }

  tableExists(tableNum: number): boolean {
    return !this.tables.find(table => {
      return table.tableNum === tableNum;
    });
  }
}
