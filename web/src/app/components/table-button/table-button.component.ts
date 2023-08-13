import { Component, Input } from '@angular/core';

@Component({
  selector: 'table-button',
  templateUrl: './table-button.component.html',
  styleUrls: ['./table-button.component.css']
})
export class TableButtonComponent {
  @Input() img: string = '';
}
