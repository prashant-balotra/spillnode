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
    <footer class="border-t border-border mt-24">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid md:grid-cols-12 gap-10">
        <!-- Newsletter -->
        <div class="md:col-span-5">
          <div class="code-label mb-4">// NEWSLETTER</div>
          <h3 class="font-heading text-2xl font-black tracking-tight mb-3">Ship coding insights to your inbox.</h3>
          <p class="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
            Weekly drops on Java, Spring Boot, Angular, Next.js and cloud. No fluff, just code that compiles.
          </p>
          <form (ngSubmit)="subscribe()" class="flex gap-2 max-w-md">
            <input type="email" [(ngModel)]="email" name="email" required
              placeholder="you@dev.io"
              data-testid="footer-newsletter-email"
              class="flex-1 px-4 py-2.5 bg-card border border-border text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
            <button type="submit"
              class="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors rounded-sm"
              data-testid="footer-newsletter-submit">
              Subscribe
            </button>
          </form>
          @if (message) {
            <p class="font-mono text-xs mt-3" [class.text-primary]="!error" [class.text-red-500]="error">
              {{ error ? '// error: ' : '// ✓ ' }}{{ message }}
            </p>
          }
        </div>

        <!-- Explore -->
        <div class="md:col-span-2">
          <div class="code-label mb-4">// EXPLORE</div>
          <ul class="space-y-3 text-sm">
            <li><a routerLink="/categories" class="text-muted-foreground hover:text-primary transition-colors">Categories</a></li>
            <li><a routerLink="/about" class="text-muted-foreground hover:text-primary transition-colors">About</a></li>
            <li><a routerLink="/" class="text-muted-foreground hover:text-primary transition-colors">Search</a></li>
          </ul>
        </div>

        <!-- Topics -->
        <div class="md:col-span-2">
          <div class="code-label mb-4">// TOPICS</div>
          <ul class="space-y-3 text-sm">
            <li><a routerLink="/category/java" class="text-muted-foreground hover:text-primary transition-colors">Java</a></li>
            <li><a routerLink="/category/spring-boot" class="text-muted-foreground hover:text-primary transition-colors">Spring Boot</a></li>
            <li><a routerLink="/category/angular" class="text-muted-foreground hover:text-primary transition-colors">Angular</a></li>
            <li><a routerLink="/category/cloud" class="text-muted-foreground hover:text-primary transition-colors">Cloud</a></li>
          </ul>
        </div>

        <!-- Connect -->
        <div class="md:col-span-3">
          <div class="code-label mb-4">// CONNECT</div>
          <div class="flex gap-2">
            <a href="https://youtube.com/@Spillnode" target="_blank" rel="noreferrer" aria-label="YouTube"
               class="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
            </a>
            <a href="https://twitter.com/spillnode" target="_blank" rel="noreferrer" aria-label="Twitter"
               class="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="https://github.com/spillnode" target="_blank" rel="noreferrer" aria-label="GitHub"
               class="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href="https://linkedin.com/company/spillnode" target="_blank" rel="noreferrer" aria-label="LinkedIn"
               class="w-10 h-10 flex items-center justify-center border border-border hover:border-primary hover:text-primary transition-colors text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>

      <div class="border-t border-border">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>© {{ year }} Spillnode. All systems nominal.</span>
          <span>Built with curiosity. Powered by caffeine.</span>
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
