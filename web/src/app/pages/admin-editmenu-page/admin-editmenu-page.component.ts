import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminCategoryFormComponent } from 'src/app/components/admin-category-form/admin-category-form.component';
import { AdminItemFormComponent } from 'src/app/components/admin-item-form/admin-item-form.component';
import { ConfirmationModalComponent } from 'src/app/components/confirmation-modal/confirmation-modal.component';
import { Category, CategoryService } from 'src/app/services/category.service';
import { Item, ItemService } from 'src/app/services/item.service';
import { DialogData } from '../admin-employee-page/admin-employee-page.component';

@Component({
  selector: 'app-admin-editmenu-page',
  templateUrl: './admin-editmenu-page.component.html',
  styleUrls: ['./admin-editmenu-page.component.css']
})
export class AdminEditmenuPageComponent {
  categories: Category[];
  dialogData: DialogData;
  itemsMap: Map<number, Item[]> = new Map<number, Item[]>();
  currentItems: Item[] | undefined;
  showCategory: boolean = false;

  constructor(private categoryService: CategoryService, private itemService: ItemService, public dialog: MatDialog) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().then(categories => {
      this.categories = categories;
    }).then(() => {
      this.categories.forEach(category => {
        this.loadItems(category.categoryId);
      });
    });
  }

  loadItems(categoryId: number) {
    this.itemService.getItemsByCategoryId(categoryId).subscribe(response => {
      this.itemsMap.set(categoryId, response.items);
    });
  }

  getItems(categoryId: number) {
    return this.itemsMap.get(categoryId);
  }

  categoryButtonHandler(categoryId: number) {
    this.showCategory = true;
    this.currentItems = this.itemsMap.get(categoryId);
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

  openEditCategoryDialog(category: Category): void {
    const dialogRef = this.dialog.open(AdminCategoryFormComponent, {
      width: '400px',
      data: {
        editMode: true,
        category: category
      }
    });
  }

}
