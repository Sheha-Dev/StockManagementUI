
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  @Input() mobileOpen = false;
  @Input() activeMenu = 'Dashboard';

  @Output() menuSelected = new EventEmitter<string>();
  @Output() closeMenu = new EventEmitter<void>();

  menuItems = [
    { label: 'StockRequests', icon: '▦', route: '/list' },
    { label: 'Request', icon: '+', route: '/request' }
  ];

  selectMenu(label: string): void {
    this.menuSelected.emit(label);
    this.closeMenu.emit();
  }
}
