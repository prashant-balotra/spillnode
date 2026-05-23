import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-border">
      <nav class="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center gap-6">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-3 shrink-0" data-testid="nav-logo">
          <div class="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground font-mono font-bold text-xs">
            SN
          </div>
          <span class="font-heading font-black text-lg tracking-tight hidden sm:inline">Spillnode</span>
        </a>

        <!-- Main links -->
        <div class="hidden md:flex items-center gap-1">
          <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact:true}"
             class="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Home</a>
          <a routerLink="/categories" routerLinkActive="text-primary"
             class="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Categories</a>
          <a routerLink="/about" routerLinkActive="text-primary"
             class="px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">About</a>
        </div>

        <!-- Search -->
        <form (ngSubmit)="onSearch()" class="flex-1 max-w-xl mx-auto hidden md:flex">
          <div class="w-full flex items-center bg-card border border-border focus-within:border-primary transition-colors h-10 px-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 class="text-muted-foreground shrink-0">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
            <input type="text" [(ngModel)]="q" name="q"
                   placeholder="Search posts, tags..."
                   data-testid="nav-search-input"
                   class="flex-1 px-3 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground" />
          </div>
        </form>

        <!-- Auth -->
        <div class="flex items-center gap-3 shrink-0 ml-auto md:ml-0">
          @if (auth.isLoggedInSig()) {
            @if (auth.isAdminSig()) {
              <a routerLink="/admin" class="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors" data-testid="nav-admin">
                Admin
              </a>
            }
            <span class="hidden sm:inline text-sm text-muted-foreground" data-testid="nav-user-name">
              {{ auth.user()?.name }}
            </span>
            <button (click)="logout()"
              class="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              data-testid="nav-logout">
              Sign out
            </button>
          } @else {
            <a routerLink="/login"
               class="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
               data-testid="nav-login">Sign in</a>
            <a routerLink="/signup"
               class="inline-flex items-center px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors rounded-sm"
               data-testid="nav-signup">Sign up</a>
          }
        </div>
      </nav>
    </header>
  `
})
export class NavbarComponent {
  q = '';
  constructor(public auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigateByUrl('/'); }
  onSearch() {
    const q = this.q.trim();
    if (!q) return;
    this.router.navigate(['/'], { queryParams: { q } });
  }
}
