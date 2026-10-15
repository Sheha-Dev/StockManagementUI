import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home } from './pages/home/home';
import { RequestList } from './pages/request-list/request-list';

@Component({
  selector: 'app-root',
  imports: [Home,RequestList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('StockManagementUI');
}
