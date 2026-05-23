import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="min-h-[80vh] flex items-center justify-center px-6 py-16 relative">
      <div class="absolute inset-0 gradient-amber-soft pointer-events-none"></div>
      <div class="absolute inset-0 grain-overlay pointer-events-none"></div>

      <div class="relative w-full max-w-md border border-border bg-card p-8 animate-fade-up">
        <div class="code-label mb-3">// auth.signIn()</div>
        <h1 class="font-heading text-3xl font-black tracking-tight">Welcome back</h1>
        <p class="text-sm text-muted-foreground mt-2">Sign in to continue your learning track.</p>

        <form (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
          <div>
            <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              data-testid="login-email"
              class="w-full px-3 py-3 bg-background border border-border focus:border-primary focus:outline-none text-sm font-mono" />
          </div>
          <div>
            <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">password</label>
            <input type="password" [(ngModel)]="password" name="password" required
              data-testid="login-password"
              class="w-full px-3 py-3 bg-background border border-border focus:border-primary focus:outline-none text-sm font-mono" />
          </div>
          @if (error) {
            <p class="font-mono text-xs text-red-500" data-testid="login-error">// error: {{ error }}</p>
          }
          <button type="submit" [disabled]="loading"
            class="btn btn-primary w-full justify-center disabled:opacity-60" data-testid="login-submit">
            {{ loading ? 'authenticating...' : 'sign.in()' }}
          </button>
        </form>

        <p class="text-sm text-muted-foreground mt-6 text-center">
          New here? <a routerLink="/signup" class="text-primary font-semibold hover:underline">create.account() →</a>
        </p>

        <div class="mt-6 p-3 border border-border font-mono text-xs text-muted-foreground">
          <span class="text-primary">// seeded admin:</span><br>
          admin&#64;spillnode.com / Admin&#64;123
        </div>
      </div>
    </section>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => { this.loading = false; this.error = e.error?.error ?? 'Login failed'; },
      complete: () => this.loading = false
    });
  }
}
