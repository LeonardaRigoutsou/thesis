import { Component } from '@angular/core';
import { Category, CategoryService } from 'src/app/services/category.service';
import { Item, ItemService } from 'src/app/services/item.service';
import { OrderItem, OrderService, Status } from 'src/app/services/order.service';
import { Qualifier } from '../item-button/item-button.component';

@Component({
  selector: 'order-menu',
  templateUrl: './order-menu.component.html',
  styleUrls: ['./order-menu.component.css']
})
export class OrderMenuComponent {

  categories: Category[];
  itemsMap: Map<number, Item[]> = new Map<number, Item[]>();
  currentItems: Item[] | undefined;
  showCategory: boolean = false;
  qualifier: Qualifier;

  constructor(private categoryService: CategoryService, private itemService: ItemService, private orderService: OrderService) { }

  ngOnInit() {
    this.categoryService.getCategories();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.categories.subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categories.forEach(category => {
          this.loadItems(category.categoryId);
        });
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {

      }
    });
  }

  loadItems(categoryId: number) {
    this.itemService.getItemsByCategoryId(categoryId).subscribe(response => {
      this.itemsMap.set(categoryId, response.items);
    });
  }

  categoryButtonHandler(categoryId: number) {
    this.showCategory = true;
    this.currentItems = this.itemsMap.get(categoryId);
  }

  goBackHandler() {
    this.showCategory = false;
  }

  getQualifierTypeById(categoryId: number): string | undefined {
    const index = this.categories.findIndex(category => {
      return category.categoryId === categoryId;
    });
    return this.categories[index]?.qualifierType;
  }

  onAddQualifier(event: any) {
    this.qualifier = event;
  }

  onItemClicked(newItem: Item) {
    let order = this.orderService.order.getValue();
    let qualifierString = Object.values(this.qualifier);
    let item = JSON.parse(JSON.stringify(newItem));
    item.orderitems = {
      itemId: item.itemId,
      qualifiers: qualifierString.toString(),
      quantity: 1,
      status: Status.OPEN,
    } as OrderItem;
    let orderedItem: any = order.items?.find(i => {
      return i.itemId === item.itemId && i.orderitems.qualifiers === item.orderitems.qualifiers;
    });
    if (orderedItem != undefined) {
      orderedItem.orderitems.quantity += 1;
      orderedItem.orderitems.status = Status.OPEN;
    } else {
      order.items?.push(item);
    }
    order.orderTotal += item.price;
    this.orderService.order.next(order);
  }
}
