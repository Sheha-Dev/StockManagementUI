
import { Component, EventEmitter, Output } from '@angular/core';

export type StockMenuView =
  | 'all'
  | 'form'
  | 'dispatch'
  | 'received'
  | 'cancelled';

@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu-component.html',
  styleUrl: './menu-component.scss'
})
export class MenuComponent {
  @Output() menuSelected = new EventEmitter<StockMenuView>();

  selectedView: StockMenuView = 'all';

  selectMenu(view: StockMenuView): void {
    this.selectedView = view;
    this.menuSelected.emit(view);
  }
}
