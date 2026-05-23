import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-grain">
      <div class="w-full max-w-md card p-8 fade-up">
        <h1 class="font-display text-3xl font-extrabold">Create your account</h1>
        <p class="text-sm text-ink-400 mt-1">Join the Spillnode community.</p>

        <form (ngSubmit)="onSubmit()" class="mt-8 space-y-4">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Name</label>
            <input type="text" [(ngModel)]="name" name="name" required minlength="2"
              data-testid="signup-name"
              class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
              data-testid="signup-email"
              class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="6"
              data-testid="signup-password"
              class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm" />
          </div>
          @if (error) {
            <p class="text-sm text-red-600" data-testid="signup-error">{{ error }}</p>
          }
          <button type="submit" [disabled]="loading"
            class="btn-pill btn-accent w-full justify-center disabled:opacity-60"
            data-testid="signup-submit">
            {{ loading ? 'Creating...' : 'Create account' }}
          </button>
        </form>

        <p class="text-sm text-ink-400 mt-6 text-center">
          Already have one? <a routerLink="/login" class="text-accent-700 font-semibold hover:underline">Sign in</a>
        </p>
      </div>
    </section>
  `
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (e) => {
        this.loading = false;
        this.error = e.error?.error ?? 'Sign up failed';
      },
      complete: () => this.loading = false
    });
  }
}
