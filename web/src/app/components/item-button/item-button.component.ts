import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

export interface Qualifier { }

interface CoffeeQualifier extends Qualifier {
  milk: string,
  sugar: string,
  toppings: string
}

interface DrinkQualifier extends Qualifier {
  ice: string,
  sides: string,
}

@Component({
  selector: 'item-button',
  templateUrl: './item-button.component.html',
  styleUrls: ['./item-button.component.css']
})
export class ItemButtonComponent {
  @Input() title: string;
  @Input() qualifierType: any;
  @Input() isAvailable: boolean;
  itemButtonClicked: boolean = false;
  milk: boolean = true;
  ice: boolean = true;
  qualifier: Qualifier = {};
  @Output() qualifiers: EventEmitter<Qualifier> = new EventEmitter<Qualifier>();
  @Output() itemClicked: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor() { }

  onDoneClicked() {
    this.itemButtonClicked = !this.itemButtonClicked;
    this.qualifiers.emit(this.qualifier);
    this.qualifier = {};
    this.itemClicked.emit(true);
  }

  onMilkQualifierClicked(event: any) {
    let coffeeQualifier = this.qualifier as CoffeeQualifier;
    coffeeQualifier.milk = event.target.defaultValue ? 'Milk' : '';
    this.milk = !this.milk;
    this.qualifier = coffeeQualifier;
  }

  onSugarQualifierClicked(qualifier: string) {
    let coffeeQualifier = this.qualifier as CoffeeQualifier;
    coffeeQualifier.sugar = qualifier;
    this.qualifier = coffeeQualifier;
  }

  onToppingQualifierClicked(qualifier: string) {
    let coffeeQualifier = this.qualifier as CoffeeQualifier;
    coffeeQualifier.toppings = qualifier;
    this.qualifier = coffeeQualifier;
  }

  onIceQualifierClicked(event: any) {
    let drinkQualifier = this.qualifier as DrinkQualifier;
    drinkQualifier.ice = event.target.defaultValue ? 'Ice' : '';
    this.ice = !this.ice;
    this.qualifier = drinkQualifier;
  }

  onSidesQualifierClicked(qualifier: string) {
    let sidesQualifier = this.qualifier as CoffeeQualifier;
    sidesQualifier.sugar = qualifier;
    this.qualifier = sidesQualifier;
  }


  onItemClicked() {
    if (!!this.qualifierType) {
      this.itemButtonClicked = !this.itemButtonClicked;
    } else {
      this.onDoneClicked();
    }
  }
}
