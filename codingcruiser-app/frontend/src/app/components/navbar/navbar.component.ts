import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-ink-100">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2 group" data-testid="nav-logo">
          <div class="w-9 h-9 rounded-xl bg-ink-900 text-accent flex items-center justify-center font-display font-extrabold transition-transform group-hover:rotate-[-6deg]">
            &lt;/&gt;
          </div>
          <span class="font-display font-extrabold text-lg tracking-tight">CodingCruiser</span>
        </a>

        <div class="hidden md:flex items-center gap-1">
          <a routerLink="/" routerLinkActive="text-accent-600" [routerLinkActiveOptions]="{exact:true}"
             class="px-3 py-2 text-sm font-semibold hover:text-accent-600 transition-colors">Home</a>
          <a routerLink="/category/java" routerLinkActive="text-accent-600"
             class="px-3 py-2 text-sm font-semibold hover:text-accent-600 transition-colors">Java</a>
          <a routerLink="/category/spring-boot" routerLinkActive="text-accent-600"
             class="px-3 py-2 text-sm font-semibold hover:text-accent-600 transition-colors">Spring Boot</a>
          <a routerLink="/category/angular" routerLinkActive="text-accent-600"
             class="px-3 py-2 text-sm font-semibold hover:text-accent-600 transition-colors">Angular</a>
          <a routerLink="/category/full-stack" routerLinkActive="text-accent-600"
             class="px-3 py-2 text-sm font-semibold hover:text-accent-600 transition-colors">Full Stack</a>
          <a routerLink="/about" routerLinkActive="text-accent-600"
             class="px-3 py-2 text-sm font-semibold hover:text-accent-600 transition-colors">About</a>
        </div>

        <div class="flex items-center gap-2">
          @if (auth.isLoggedInSig()) {
            @if (auth.isAdminSig()) {
              <a routerLink="/admin" class="btn-pill btn-ghost text-sm" data-testid="nav-admin">
                Admin
              </a>
            }
            <span class="hidden sm:inline text-sm text-ink-700 font-medium" data-testid="nav-user-name">
              {{ auth.user()?.name }}
            </span>
            <button (click)="logout()" class="btn-pill btn-primary text-sm" data-testid="nav-logout">
              Sign out
            </button>
          } @else {
            <a routerLink="/login" class="btn-pill btn-ghost text-sm" data-testid="nav-login">Sign in</a>
            <a routerLink="/signup" class="btn-pill btn-accent text-sm" data-testid="nav-signup">Get started</a>
          }
        </div>
      </nav>
    </header>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
