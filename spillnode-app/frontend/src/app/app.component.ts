import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  // No flex wrapper — `position: sticky` on the navbar depends on the body
  // (or root block container) being the scrolling element, which a flex column
  // wrapper subtly breaks in some browsers.
  template: `
    <app-navbar></app-navbar>
    <main>
      <router-outlet />
    </main>
    <app-footer></app-footer>
  `
})
export class AppComponent {}
