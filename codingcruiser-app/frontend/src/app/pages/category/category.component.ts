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
    <section class="bg-grain border-b border-ink-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        @if (category) {
          <span class="text-xs font-bold uppercase tracking-widest text-ink-400">Category</span>
          <h1 class="font-display text-4xl sm:text-5xl font-extrabold mt-2"
              [style.color]="category.colorHex">
            {{ category.name }}
          </h1>
          @if (category.description) {
            <p class="mt-3 text-ink-700 max-w-2xl">{{ category.description }}</p>
          }
        }

        <form (ngSubmit)="search()" class="mt-6 flex gap-2 max-w-md">
          <input type="text" [(ngModel)]="q" name="q" placeholder="Search in this category"
            data-testid="cat-search-input"
            class="flex-1 px-4 py-2 rounded-full bg-white border border-ink-200 text-sm focus:outline-none focus:border-accent" />
          <button class="btn-pill btn-primary text-sm" data-testid="cat-search-submit">Search</button>
        </form>
      </div>
    </section>

    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (p of posts; track p.id) {
          <app-post-card [post]="p"></app-post-card>
        } @empty {
          <p class="text-ink-400 col-span-3">No posts in this category yet.</p>
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
