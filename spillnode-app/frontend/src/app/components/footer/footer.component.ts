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
      <div class="max-w-7xl mx-auto px-6 sm:px-8 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground font-mono font-bold text-sm">
              &lt;/&gt;
            </div>
            <div class="font-heading font-black text-lg">spillnode</div>
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Deep dives into Java, Spring Boot, Angular, Next.js and cloud — paired with end-to-end tutorials and the stories behind them.
          </p>
        </div>

        <div>
          <div class="code-label mb-4">// explore</div>
          <ul class="space-y-2 text-sm">
            <li><a routerLink="/category/java" class="text-muted-foreground hover:text-primary transition-colors">Java</a></li>
            <li><a routerLink="/category/spring-boot" class="text-muted-foreground hover:text-primary transition-colors">Spring Boot</a></li>
            <li><a routerLink="/category/angular" class="text-muted-foreground hover:text-primary transition-colors">Angular</a></li>
            <li><a routerLink="/category/nextjs" class="text-muted-foreground hover:text-primary transition-colors">Next.js</a></li>
            <li><a routerLink="/about" class="text-muted-foreground hover:text-primary transition-colors">About</a></li>
          </ul>
        </div>

        <div>
          <div class="code-label mb-4">// newsletter.subscribe()</div>
          <p class="text-sm text-muted-foreground mb-4">Weekly drops on new tutorials and roadmaps.</p>
          <form (ngSubmit)="subscribe()" class="flex gap-2">
            <input
              type="email" [(ngModel)]="email" name="email" required
              placeholder="you@dev.com"
              data-testid="footer-newsletter-email"
              class="flex-1 px-3 py-2 bg-card border border-border text-sm focus:outline-none focus:border-primary placeholder:text-muted-foreground" />
            <button type="submit" class="btn btn-primary text-xs" data-testid="footer-newsletter-submit">
              join
            </button>
          </form>
          @if (message) {
            <p class="font-mono text-xs mt-3" [class.text-primary]="!error" [class.text-red-500]="error">
              {{ error ? '// error: ' : '// ✓ ' }}{{ message }}
            </p>
          }
        </div>
      </div>
      <div class="border-t border-border">
        <div class="max-w-7xl mx-auto px-6 sm:px-8 py-5 font-mono text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <span>// © {{ year }} spillnode — all.rights.reserved()</span>
          <span>built.with(&lt;3) for developers</span>
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
