import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <footer class="bg-ink-900 text-ink-100 mt-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-9 h-9 rounded-xl bg-accent text-ink-900 flex items-center justify-center font-display font-extrabold">
              &lt;/&gt;
            </div>
            <span class="font-display font-extrabold text-lg">Spillnode</span>
          </div>
          <p class="text-sm text-ink-200 leading-relaxed">
            Master Java, Spring Boot, Angular, Next.js, full-stack & cloud — taught the way developers actually learn.
          </p>
        </div>

        <div>
          <h4 class="font-display font-bold mb-3 text-accent">Explore</h4>
          <ul class="space-y-2 text-sm text-ink-200">
            <li><a routerLink="/category/java" class="hover:text-accent transition-colors">Java</a></li>
            <li><a routerLink="/category/spring-boot" class="hover:text-accent transition-colors">Spring Boot</a></li>
            <li><a routerLink="/category/angular" class="hover:text-accent transition-colors">Angular</a></li>
            <li><a routerLink="/category/nextjs" class="hover:text-accent transition-colors">Next.js</a></li>
            <li><a routerLink="/about" class="hover:text-accent transition-colors">About</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-display font-bold mb-3 text-accent">Join the newsletter</h4>
          <p class="text-sm text-ink-200 mb-3">Weekly drops on new tutorials and roadmaps.</p>
          <form (ngSubmit)="subscribe()" class="flex gap-2">
            <input
              type="email" [(ngModel)]="email" name="email" required
              placeholder="you@dev.com"
              data-testid="footer-newsletter-email"
              class="flex-1 px-3 py-2 rounded-full bg-ink-700 border border-ink-700 placeholder-ink-200 text-sm focus:outline-none focus:border-accent" />
            <button type="submit" class="btn-pill btn-accent text-sm" data-testid="footer-newsletter-submit">
              Join
            </button>
          </form>
          @if (message) {
            <p class="text-xs mt-2" [class.text-accent]="!error" [class.text-red-400]="error">{{ message }}</p>
          }
        </div>
      </div>
      <div class="border-t border-ink-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-xs text-ink-200 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {{ year }} Spillnode. All rights reserved.</span>
          <span>Made with care for developers.</span>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  email = '';
  message = '';
  error = false;
  year = new Date().getFullYear();

  constructor(private newsletter: NewsletterService) {}

  subscribe() {
    if (!this.email) return;
    this.newsletter.subscribe(this.email).subscribe({
      next: () => { this.message = 'Thanks for subscribing!'; this.error = false; this.email = ''; },
      error: (e) => { this.message = e.error?.error ?? 'Subscription failed'; this.error = true; }
    });
  }
}
