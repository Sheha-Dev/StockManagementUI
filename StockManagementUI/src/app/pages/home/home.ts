
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { Menu } from '../menu/menu';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Menu,
    RouterOutlet
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  menuOpen = false;

  selectedMenu = 'Dashboard';

  private routerSubscription?: Subscription;

  private readonly menuRoutes: Record<string, string> = {
    StockRequests: '/list',
    Request: '/request',
    Dispatch: '/dispatch',
    Received: '/received',
    Cancelled: '/cancelled'
  };

  constructor(
    private router: Router,
    private cdr : ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateSelectedMenu();

    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        this.updateSelectedMenu();
        this.menuOpen = false;
      });
  }

  onMenuSelected(menu: string): void {
    const route = this.menuRoutes[menu];

    if (!route) {
      return;
    }

    this.menuOpen = false;

    this.router.navigateByUrl(route);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  private updateSelectedMenu(): void {
    const currentUrl = this.router.url.split('?')[0].split('#')[0];

    const matchedMenu = Object.entries(this.menuRoutes)
      .find(([, route]) => route === currentUrl);

    this.selectedMenu = matchedMenu?.[0] ?? 'Dashboard';
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
