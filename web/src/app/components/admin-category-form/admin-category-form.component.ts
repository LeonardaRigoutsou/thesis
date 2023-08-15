import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Category, CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'admin-category-form',
  templateUrl: './admin-category-form.component.html',
  styleUrls: ['./admin-category-form.component.css']
})
export class AdminCategoryFormComponent {
  newCategoryForm: FormGroup;
  errorMessage: string = "";

  constructor(private authService: AuthService, private categoryService: CategoryService,
    public dialogRef: MatDialogRef<AdminCategoryFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    this.newCategoryForm = new FormGroup({
      'categoryName': new FormControl("", Validators.required),
      'qualifierType': new FormControl("", Validators.required),
      'isAvailable': new FormControl("", Validators.required)
    });

    if (this.data.category) {
      const category = this.data.category;
      this.newCategoryForm.patchValue({
        categoryName: category.name,
        qualifierType: category.qualifierType
      })
      this.newCategoryForm.get('categoryName')?.setValue(category.name);
      this.newCategoryForm.get('qualifierType')?.setValue(category.qualifierType);
      this.newCategoryForm.get('isAvailable')?.setValue(category.isAvailable);
    }
  }

  onCreate(): void {
    let newCategory = this.formToCategory();
    this.errorMessage = this.categoryService.createCategory(newCategory);
    this.dialogRef.close();
  }

  onUpdate(): void {
    let newCategory = this.formToCategory();
    this.errorMessage = this.categoryService.updateCategory(this.data.category.categoryId, newCategory);
    this.dialogRef.close();
  }

  private formToCategory(): Category {
    let newCategory: Category = {} as Category;
    newCategory.categoryId = this.data.category?.categoryId;
    newCategory.name = this.newCategoryForm.get('categoryName')?.value;
    newCategory.qualifierType = this.newCategoryForm.get('qualifierType')?.value;
    newCategory.isAvailable = this.newCategoryForm.get('isAvailable')?.value;

    return newCategory;
  }

}
