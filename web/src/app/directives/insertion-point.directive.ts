import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[insertionPoint]'
})
export class InsertionPointDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
