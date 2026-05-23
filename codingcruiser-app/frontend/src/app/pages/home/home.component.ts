import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { YouTubeApiService } from '../../services/newsletter.service';
import { Category, Post, YouTubeVideo } from '../../models/models';
import { PostCardComponent } from '../../components/post-card/post-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PostCardComponent],
  template: `
    <!-- Hero -->
    <section class="bg-grain border-b border-ink-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 grid lg:grid-cols-5 gap-10 items-center">
        <div class="lg:col-span-3 fade-up">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-700 text-xs font-bold uppercase tracking-wider">
            <span class="w-2 h-2 rounded-full bg-accent-600 animate-pulse"></span>
            New posts every week
          </span>
          <h1 class="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            Learn to <span class="bg-accent text-ink-900 px-2 py-0.5 inline-block -rotate-1">code</span> the way developers <em class="not-italic underline decoration-ocean-500 decoration-4 underline-offset-4">actually</em> learn.
          </h1>
          <p class="mt-6 text-base sm:text-lg text-ink-700 max-w-xl">
            Deep-dive tutorials on Java, Spring Boot, Angular, Next.js, full-stack & cloud. Build real projects, end to end.
          </p>
          <form (ngSubmit)="search()" class="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl">
            <input type="text" [(ngModel)]="q" name="q" placeholder="Search a topic, e.g. JWT in Spring Boot"
              data-testid="hero-search-input"
              class="flex-1 px-5 py-3 rounded-full bg-white border border-ink-200 focus:outline-none focus:border-accent text-sm" />
            <button class="btn-pill btn-primary" data-testid="hero-search-submit">Search →</button>
          </form>
        </div>

        <div class="lg:col-span-2 fade-up-delay-2">
          <div class="card p-6 relative overflow-hidden">
            <div class="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/30 blur-3xl"></div>
            <h3 class="font-display font-bold text-lg mb-4 relative">🔥 Trending now</h3>
            <ul class="space-y-3 relative">
              @for (p of trending; track p.id; let i = $index) {
                <li>
                  <a [routerLink]="['/post', p.slug]" class="flex gap-3 group">
                    <span class="font-display font-extrabold text-2xl text-accent-600 w-8">0{{ i + 1 }}</span>
                    <span class="flex-1">
                      <span class="font-semibold text-sm leading-tight block group-hover:text-accent-700 transition-colors">
                        {{ p.title }}
                      </span>
                      <span class="text-xs text-ink-400">{{ p.viewCount }} reads · {{ p.category.name }}</span>
                    </span>
                  </a>
                </li>
              } @empty {
                <li class="text-sm text-ink-400">No posts yet — admin can add some!</li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div class="flex items-end justify-between mb-8">
        <div>
          <h2 class="font-display text-2xl sm:text-3xl font-extrabold">Browse by category</h2>
          <p class="text-sm text-ink-400 mt-1">Pick your stack — dive into the deep end.</p>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        @for (c of categories; track c.id) {
          <a [routerLink]="['/category', c.slug]" class="card p-5 text-center" [attr.data-testid]="'cat-' + c.slug">
            <div class="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center font-display font-extrabold text-lg"
                 [style.background-color]="c.colorHex + '22'" [style.color]="c.colorHex">
              {{ c.name.charAt(0) }}
            </div>
            <div class="font-display font-bold text-sm">{{ c.name }}</div>
          </a>
        }
      </div>
    </section>

    <!-- Featured -->
    @if (featured.length) {
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h2 class="font-display text-2xl sm:text-3xl font-extrabold mb-8">⭐ Featured posts</h2>
        <div class="grid md:grid-cols-3 gap-6">
          @for (p of featured; track p.id) {
            <app-post-card [post]="p"></app-post-card>
          }
        </div>
      </section>
    }

    <!-- Latest -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h2 class="font-display text-2xl sm:text-3xl font-extrabold mb-8">📚 Latest tutorials</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (p of latest; track p.id) {
          <app-post-card [post]="p"></app-post-card>
        } @empty {
          <p class="text-ink-400 col-span-3">No posts yet. Sign in as admin to create your first post.</p>
        }
      </div>
    </section>

    <!-- YouTube -->
    @if (videos.length) {
      <section class="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 class="font-display text-2xl sm:text-3xl font-extrabold mb-8">🎥 From the channel</h2>
        <div class="grid md:grid-cols-3 gap-6">
          @for (v of videos; track v.videoId) {
            <a [href]="v.watchUrl" target="_blank" rel="noopener" class="card overflow-hidden block">
              <img [src]="v.thumbnail" [alt]="v.title" class="w-full aspect-video object-cover" />
              <div class="p-4">
                <h4 class="font-bold text-sm leading-snug line-clamp-2">{{ v.title }}</h4>
              </div>
            </a>
          }
        </div>
      </section>
    }
  `,
  styles: [`
    .line-clamp-2 {
      display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
    }
  `]
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  latest: Post[] = [];
  featured: Post[] = [];
  trending: Post[] = [];
  videos: YouTubeVideo[] = [];
  q = '';

  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private youtube: YouTubeApiService
  ) {}

  ngOnInit() {
    this.categoryService.list().subscribe(cs => this.categories = cs);
    this.postService.list({ size: 9 }).subscribe(p => this.latest = p.content);
    this.postService.featured().subscribe(p => this.featured = p.content);
    this.postService.trending().subscribe(t => this.trending = t);
    this.youtube.latest(3).subscribe(v => this.videos = v);
  }

  search() {
    if (!this.q.trim()) return;
    this.postService.list({ q: this.q, size: 12 }).subscribe(p => this.latest = p.content);
  }
}
