import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import { Category } from '../../models/models';
import { CatIconComponent } from '../../components/cat-icon/cat-icon.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink, CatIconComponent],
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
            <div class="mb-4" [style.color]="c.colorHex">
              <app-cat-icon [slug]="c.slug" [size]="28"></app-cat-icon>
            </div>
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
}
