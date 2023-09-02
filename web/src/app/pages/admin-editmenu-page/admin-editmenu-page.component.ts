import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminCategoryFormComponent } from 'src/app/components/admin-category-form/admin-category-form.component';
import { AdminItemFormComponent } from 'src/app/components/admin-item-form/admin-item-form.component';
import { ConfirmationModalComponent } from 'src/app/components/confirmation-modal/confirmation-modal.component';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { DialogData } from '../admin-employee-page/admin-employee-page.component';
import { BehaviorSubject } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';

@Component({
  selector: 'app-admin-editmenu-page',
  templateUrl: './admin-editmenu-page.component.html',
  styleUrls: ['./admin-editmenu-page.component.css']
})
export class AdminEditmenuPageComponent {
  categories: Category[];
  dialogData: DialogData;
  itemsMap: BehaviorSubject<Map<number, Item[]>> = new BehaviorSubject<Map<number, Item[]>>(new Map<number, Item[]>());
  currentItems: Item[] | undefined;
  showCategory: boolean = false;

  constructor(private categoryService: CategoryService, private itemService: ItemService, public dialog: MatDialog) { }

  ngOnInit() {
    this.categoryService.getCategories();
    this.categoryService.categories.subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        // this.categories.forEach(category => {
        //   this.loadItems(category.categoryId);
        // });
        console.log(this.categories);

      }
    });

  }

  // loadItems(categoryId: number) {
  //   this.itemService.getItemsByCategoryId(categoryId).subscribe(response => {
  //     const map = new Map<number, Item[]>();
  //     map.set(categoryId, response.items);
  //     this.itemsMap.next(map);
  //   });
  // }

  getItems(categoryId: number) {
    return this.itemsMap.getValue().get(categoryId);
  }

  categoryButtonHandler(categoryId: number) {
    this.showCategory = true;
    this.currentItems = this.itemsMap.getValue().get(categoryId);
  }

  openConfirmationDialog(categoryId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data === 'yes') {
        this.categoryService.deleteCategory(categoryId);
      }
    });
  }

  openNewCategoryDialog(): void {
    const dialogRef = this.dialog.open(AdminCategoryFormComponent, {
      width: '400px',
      data: {
        editMode: false,
        category: null
      }
    });
  }

  openNewItemDialog(): void {
    const dialogRef = this.dialog.open(AdminItemFormComponent, {
      width: '400px',
      data: {
        editMode: false,
        item: null
      }
    });
  }

}
