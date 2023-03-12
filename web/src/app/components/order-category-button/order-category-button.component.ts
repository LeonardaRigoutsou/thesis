import { Component, Input } from '@angular/core';

@Component({
  selector: 'order-category-button',
  templateUrl: './order-category-button.component.html',
  styleUrls: ['./order-category-button.component.css']
})
export class OrderCategoryButtonComponent {
  @Input() name: string = '';
}
