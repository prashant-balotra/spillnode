import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { Category } from '../../models/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="max-w-7xl mx-auto px-6 sm:px-8 py-20">
      <div class="code-label mb-3">// EXPLORE.ALL()</div>
      <h1 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-[1.0]">
        Topics &amp; tracks
      </h1>
      <p class="mt-5 text-muted-foreground max-w-2xl leading-relaxed">
        Every category is a structured journey. Start with the basics, level up to production-grade patterns.
      </p>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        @for (c of categories; track c.id; let i = $index) {
          <a [routerLink]="['/category', c.slug]"
             class="group relative block border border-border hover:border-primary transition-all bg-card p-6 overflow-hidden"
             [attr.data-testid]="'category-card-' + c.slug">
            <div class="absolute top-0 left-0 w-full h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                 [style.background]="c.colorHex"></div>
            <div class="flex items-start justify-between mb-8">
              <span class="font-mono text-xs text-muted-foreground">{{ pad(i+1) }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/60 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>
            </div>
            <div class="mb-4" [style.color]="c.colorHex" [innerHTML]="getCategoryIcon(c.slug)"></div>
            <h3 class="font-heading text-xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">{{ c.name }}</h3>
            @if (c.description) {
              <p class="text-xs text-muted-foreground line-clamp-2 mb-4">{{ c.description }}</p>
            }
            <div class="font-mono text-xs text-muted-foreground/70">
              {{ categoryCount[c.slug] || 0 }} {{ (categoryCount[c.slug] || 0) === 1 ? 'post' : 'posts' }}
            </div>
          </a>
        }
      </div>
    </section>
  `
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  categoryCount: Record<string, number> = {};

  constructor(private categoryService: CategoryService, private postService: PostService) {}

  ngOnInit() {
    this.categoryService.list().subscribe(cs => this.categories = cs);
    this.postService.list({ size: 200 }).subscribe(all => {
      const counts: Record<string, number> = {};
      all.content.forEach(post => {
        counts[post.category.slug] = (counts[post.category.slug] || 0) + 1;
      });
      this.categoryCount = counts;
    });
  }

  pad(n: number): string { return n.toString().padStart(2, '0'); }

  getCategoryIcon(slug: string): string {
    const size = 'width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    const icons: Record<string, string> = {
      'java': `<svg xmlns="http://www.w3.org/2000/svg" ${size}><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/></svg>`,
      'spring-boot': `<svg xmlns="http://www.w3.org/2000/svg" ${size}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`,
      'angular': `<svg xmlns="http://www.w3.org/2000/svg" ${size}><path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/></svg>`,
      'nextjs': `<svg xmlns="http://www.w3.org/2000/svg" ${size}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
      'full-stack': `<svg xmlns="http://www.w3.org/2000/svg" ${size}><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>`,
      'cloud': `<svg xmlns="http://www.w3.org/2000/svg" ${size}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
      'dsa': `<svg xmlns="http://www.w3.org/2000/svg" ${size}><rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/><path d="M6 14h2v6"/><path d="M14 4h2v6"/></svg>`,
      'system-design': `<svg xmlns="http://www.w3.org/2000/svg" ${size}><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`
    };
    return icons[slug] || `<svg xmlns="http://www.w3.org/2000/svg" ${size}><circle cx="12" cy="12" r="10"/></svg>`;
  }
}
