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
    <section class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-grain">
      <div class="w-full max-w-md card p-8 fade-up">
        <h1 class="font-display text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p class="text-sm text-ink-400 mt-1">Sign in to continue learning.</p>

        <form (ngSubmit)="onSubmit()" class="mt-8 space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              data-testid="login-email"
              class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required
              data-testid="login-password"
              class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm" />
          </div>
          @if (error) {
            <p class="text-sm text-red-600" data-testid="login-error">{{ error }}</p>
          }
          <button type="submit" [disabled]="loading"
            class="btn-pill btn-primary w-full justify-center disabled:opacity-60"
            data-testid="login-submit">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="text-sm text-ink-400 mt-6 text-center">
          No account? <a routerLink="/signup" class="text-accent-700 font-semibold hover:underline">Create one →</a>
        </p>

        <div class="mt-6 p-3 rounded-xl bg-ink-50 text-xs text-ink-700">
          <strong class="block mb-1">Default admin (seeded):</strong>
          admin&#64;codingcruiser.com / Admin&#64;123
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
      error: (e) => {
        this.loading = false;
        this.error = e.error?.error ?? 'Login failed';
      },
      complete: () => this.loading = false
    });
  }
}
