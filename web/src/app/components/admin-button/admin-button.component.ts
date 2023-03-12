import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-button',
  templateUrl: './admin-button.component.html',
  styleUrls: ['./admin-button.component.css']
})
export class AdminButtonComponent {
  @Input() text: string = '';
  @Input() img: string = '';
}
