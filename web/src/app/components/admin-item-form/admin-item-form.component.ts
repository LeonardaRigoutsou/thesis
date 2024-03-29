import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/models/item.model';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'admin-item-form',
  templateUrl: './admin-item-form.component.html',
  styleUrls: ['./admin-item-form.component.css']
})
export class AdminItemFormComponent {
  newItemForm: FormGroup;
  errorMessage: string = "";

  constructor(private itemService: ItemService, protected categoryService: CategoryService,
    public dialogRef: MatDialogRef<AdminItemFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newItemForm = new FormGroup({
      'itemName': new FormControl("", Validators.required),
      'categoryId': new FormControl(null, Validators.required),
      'price': new FormControl("", Validators.required),
      'isAvailable': new FormControl("", Validators.required),
      'ingredients': new FormControl("", Validators.required)
    });

    if (this.data.item) {
      const item = this.data.item;
      this.newItemForm.patchValue({
        itemName: item.title,
        categoryId: item.categoryId,
        price: item.price,
        isAvailable: item.isAvailable,
        ingredients: item.ingredients
      });
    }
  }

  onCreate(): void {
    let newItem = this.formToItem();
    this.errorMessage = this.itemService.createItem(newItem);
    this.dialogRef.close(newItem);
  }

  onUpdate(): void {
    let updatedItem = this.formToItem();
    this.errorMessage = this.itemService.updateItem(this.data.item.itemId, updatedItem);
    this.dialogRef.close(updatedItem);
  }

  private formToItem(): Item {
    let newItem: Item = {} as Item;
    newItem.title = this.newItemForm.get('itemName')?.value;
    newItem.categoryId = this.newItemForm.get('categoryId')?.value;
    newItem.price = this.newItemForm.get('price')?.value;
    newItem.isAvailable = this.newItemForm.get('isAvailable')?.value;
    newItem.ingredients = this.newItemForm.get('ingredients')?.value;

    return newItem;
  }

  getCategoryNameById(categoryId: number): string {
    const updatedCategories = this.categoryService.categories.getValue();
    let categoryIndex = updatedCategories.findIndex(category => {
      return category.categoryId === categoryId;
    });
    return updatedCategories.at(categoryIndex)?.name as string;
  }
}
