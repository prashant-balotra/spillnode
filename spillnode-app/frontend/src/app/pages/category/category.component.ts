import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { Category, Post } from '../../models/models';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PostCardComponent],
  template: `
    <section class="border-b border-border relative overflow-hidden">
      <div class="absolute inset-0 gradient-amber-soft pointer-events-none"></div>
      <div class="absolute inset-0 grain-overlay pointer-events-none"></div>

      <div class="relative max-w-7xl mx-auto px-6 sm:px-8 py-16">
        @if (category) {
          <div class="code-label mb-3">// category.{{ category.slug }}</div>
          <h1 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest"
              [style.color]="category.colorHex">
            {{ category.name }}
          </h1>
          @if (category.description) {
            <p class="mt-3 text-muted-foreground max-w-2xl">{{ category.description }}</p>
          }
        }

        <form (ngSubmit)="search()" class="mt-8 flex max-w-md border border-border focus-within:border-primary transition-colors">
          <span class="px-3 flex items-center font-mono text-xs text-muted-foreground select-none">{{ '\\$' }}</span>
          <input type="text" [(ngModel)]="q" name="q"
            placeholder="filter('keyword')"
            data-testid="cat-search-input"
            class="flex-1 px-2 py-2.5 bg-transparent font-mono text-sm focus:outline-none" />
          <button class="px-4 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider"
                  data-testid="cat-search-submit">run</button>
        </form>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-6 sm:px-8 py-16">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (p of posts; track p.id) {
          <app-post-card [post]="p"></app-post-card>
        } @empty {
          <p class="text-muted-foreground col-span-3 font-mono text-sm">// no posts in this category yet</p>
        }
      </div>
    </section>
  `
})
export class CategoryComponent implements OnInit {
  category?: Category;
  posts: Post[] = [];
  q = '';
  slug = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      this.slug = p.get('slug') ?? '';
      if (!this.slug) return;
      this.categoryService.getBySlug(this.slug).subscribe(c => this.category = c);
      this.load();
    });
  }

  load() {
    this.postService.list({ category: this.slug, q: this.q, size: 30 })
      .subscribe(p => this.posts = p.content);
  }

  search() { this.load(); }
}
