import { Component } from '@angular/core';
import { Category, CategoryService } from 'src/app/services/category.service';
import { Item, ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'order-menu',
  templateUrl: './order-menu.component.html',
  styleUrls: ['./order-menu.component.css']
})
export class OrderMenuComponent {

  categories: Category[];
  items: Map<number, Item[]> = new Map<number, Item[]>();
  currentItems: Item[] | undefined;
  showCategory: boolean = false;

  constructor(private categoryService: CategoryService, private itemService: ItemService) { }

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
    this.itemService.getItemsByCategoryId(categoryId).then(items => {
      this.items.set(categoryId, items);
    });
  }

  categoryButtonHandler(categoryId: number) {
    this.showCategory = true;
    this.currentItems = this.items.get(categoryId);
  }

  goBackHandler() {
    this.showCategory = false;
  }

  showCustomizationPanel() {

  }
}
