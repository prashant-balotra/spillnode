import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 backdrop-blur-md bg-background/85 border-b border-border">
      <nav class="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-3 group" data-testid="nav-logo">
          <div class="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground font-mono font-bold text-sm transition-transform group-hover:rotate-[-4deg]">
            &lt;/&gt;
          </div>
          <div class="leading-none">
            <div class="font-heading font-black text-base tracking-tight">spillnode</div>
            <div class="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-0.5">// dev.notes</div>
          </div>
        </a>

        <div class="hidden md:flex items-center gap-1 font-mono text-xs uppercase tracking-[0.15em]">
          <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact:true}"
             class="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">home</a>
          <a routerLink="/category/java" routerLinkActive="text-primary"
             class="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">java</a>
          <a routerLink="/category/spring-boot" routerLinkActive="text-primary"
             class="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">spring</a>
          <a routerLink="/category/angular" routerLinkActive="text-primary"
             class="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">angular</a>
          <a routerLink="/category/full-stack" routerLinkActive="text-primary"
             class="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">full-stack</a>
          <a routerLink="/about" routerLinkActive="text-primary"
             class="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">about</a>
        </div>

        <div class="flex items-center gap-2">
          @if (auth.isLoggedInSig()) {
            @if (auth.isAdminSig()) {
              <a routerLink="/admin" class="btn btn-outline text-xs" data-testid="nav-admin">
                admin.panel()
              </a>
            }
            <span class="hidden sm:inline font-mono text-xs text-muted-foreground" data-testid="nav-user-name">
              {{ auth.user()?.name }}
            </span>
            <button (click)="logout()" class="btn btn-ghost text-xs" data-testid="nav-logout">
              sign.out()
            </button>
          } @else {
            <a routerLink="/login" class="btn btn-ghost text-xs" data-testid="nav-login">sign.in()</a>
            <a routerLink="/signup" class="btn btn-primary text-xs" data-testid="nav-signup">get.started()</a>
          }
        </div>
      </nav>
    </header>
  `
})
export class NavbarComponent {
  constructor(public auth: AuthService, private router: Router) {}
  logout() { this.auth.logout(); this.router.navigateByUrl('/'); }
}
