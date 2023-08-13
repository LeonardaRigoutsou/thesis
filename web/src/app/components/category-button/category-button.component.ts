import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category, CategoryService } from 'src/app/services/category.service';
import { Item, ItemService } from 'src/app/services/item.service';
import { AdminCategoryFormComponent } from '../admin-category-form/admin-category-form.component';
import { AdminItemFormComponent } from '../admin-item-form/admin-item-form.component';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'category-button',
  templateUrl: './category-button.component.html',
  styleUrls: ['./category-button.component.css']
})
export class CategoryButtonComponent {

  @Input() category: Category;
  @ViewChild('img') image: ElementRef;
  items: Item[] = [];
  itemsMap: Map<number, Item[]> = new Map<number, Item[]>();
  categoryClicked: Boolean = false;

  constructor(private dialog: MatDialog, private categoryService: CategoryService, private itemService: ItemService, private renderer: Renderer2) { }

  ngOnInit() {
    this.itemService.items.subscribe(items => {
      this.items = items;
    })
    this.loadItems(this.category.categoryId);
  }

  showItemsOfCategory() {
    this.categoryClicked = !this.categoryClicked;
    if (this.categoryClicked) {
      this.renderer.setStyle(this.image.nativeElement, 'transform', 'rotate(90deg)');
    } else {
      this.renderer.setStyle(this.image.nativeElement, 'transform', 'rotate(0deg)');
    }
  }

  openEditCategoryDialog(category: Category): void {
    this.categoryClicked = !this.categoryClicked;
    const dialogRef = this.dialog.open(AdminCategoryFormComponent, {
      width: '400px',
      data: {
        editMode: true,
        category: category
      }
    });
  }

  openEditItemDialog(item: Item): void {
    const dialogRef = this.dialog.open(AdminItemFormComponent, {
      width: '400px',
      data: {
        editMode: true,
        item: item
      }
    });
  }

  openCategoryConfirmationDialog(categoryId: number): void {
    this.categoryClicked = !this.categoryClicked;
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data === 'yes') {
        this.categoryService.deleteCategory(categoryId);
      }
    });
  }

  openItemConfirmationDialog(itemId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data === 'yes') {
        this.itemService.deleteItem(itemId);
      }
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

  checkIfCategoryEmpty(categoryId: number) {
    return this.getItems(categoryId)?.length === 0;
  }
}
