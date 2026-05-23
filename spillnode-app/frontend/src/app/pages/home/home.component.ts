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
    <!-- ===== Hero ===== -->
    <section class="relative overflow-hidden border-b border-border">
      <div class="absolute inset-0 gradient-amber-soft pointer-events-none"></div>
      <div class="absolute inset-0 grain-overlay pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 sm:px-8 py-20 lg:py-28 relative">
        <div class="grid lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 animate-fade-up">
            <div class="code-label mb-6">
              <span class="w-3.5 h-3.5 inline-block">▣</span>
              // welcome.to(spillnode)
            </div>
            <h1 class="font-heading text-4xl sm:text-5xl lg:text-7xl font-black tracking-tightest leading-[0.95] mb-6">
              Cruise through<br>
              <span class="text-primary">code</span>, concepts &amp;<br>
              real-world <span class="italic font-light">builds</span>.
            </h1>
            <p class="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              Deep dives into Java, Spring Boot, Angular, Next.js and cloud — paired with end-to-end tutorials and the stories behind them.
            </p>

            <div class="flex flex-wrap gap-3">
              <a routerLink="/category/java" class="btn btn-primary" data-testid="hero-explore-btn">
                Explore categories →
              </a>
              <a href="https://youtube.com/@CodingCruiser" target="_blank" rel="noreferrer"
                 class="btn btn-outline" data-testid="hero-youtube-btn">
                ▶ Watch on YouTube
              </a>
            </div>

            <form (ngSubmit)="search()" class="mt-8 flex max-w-lg border border-border focus-within:border-primary transition-colors">
              <span class="px-3 flex items-center font-mono text-xs text-muted-foreground select-none">{{ '\\$' }}</span>
              <input type="text" [(ngModel)]="q" name="q"
                placeholder="search('JWT in Spring Boot')"
                data-testid="hero-search-input"
                class="flex-1 px-2 py-3 bg-transparent font-mono text-sm focus:outline-none placeholder:text-muted-foreground" />
              <button class="px-4 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider hover:bg-primary/90" data-testid="hero-search-submit">
                run
              </button>
            </form>

            <div class="mt-10 flex gap-8 font-mono text-xs text-muted-foreground">
              <div>
                <div class="font-heading text-3xl font-black text-foreground">{{ totalPosts }}+</div>
                <div class="uppercase tracking-[0.2em] mt-1">posts</div>
              </div>
              <div>
                <div class="font-heading text-3xl font-black text-foreground">{{ categories.length || 8 }}</div>
                <div class="uppercase tracking-[0.2em] mt-1">topics</div>
              </div>
              <div>
                <div class="font-heading text-3xl font-black text-foreground">24/7</div>
                <div class="uppercase tracking-[0.2em] mt-1">learning</div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 relative">
            <div class="relative aspect-[4/5] border border-border overflow-hidden">
              <img alt="Programmer at work" loading="lazy" class="w-full h-full object-cover"
                src="https://images.pexels.com/photos/5473337/pexels-photo-5473337.jpeg" />
              <div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
              <div class="absolute bottom-6 left-6 right-6 font-mono text-xs text-muted-foreground">
                <div class="flex items-center gap-2 mb-2 text-primary">
                  <span class="w-2 h-2 bg-primary animate-pulse-slow"></span>
                  live.session()
                </div>
                <div class="leading-relaxed">// compiling new tutorials every week</div>
              </div>
            </div>
            <div class="absolute -top-3 -right-3 bg-card border border-primary px-3 py-1 font-mono text-xs text-primary hidden lg:block">
              v1.0.0 — stable
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Latest posts ===== -->
    <section class="max-w-7xl mx-auto px-6 sm:px-8 py-20">
      <div class="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div class="code-label mb-2">// latest.posts</div>
          <h2 class="font-heading text-3xl sm:text-4xl font-bold tracking-tight">Fresh from the editor</h2>
        </div>
        <a routerLink="/category/java" class="font-mono text-sm text-muted-foreground hover:text-primary">view.all() →</a>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (p of latest; track p.id) {
          <app-post-card [post]="p"></app-post-card>
        } @empty {
          <p class="text-muted-foreground col-span-3 font-mono text-sm">// no posts yet — sign in as admin to create one</p>
        }
      </div>
    </section>

    <!-- ===== Categories ===== -->
    <section class="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-border">
      <div class="mb-10">
        <div class="code-label mb-2">// categories</div>
        <h2 class="font-heading text-3xl sm:text-4xl font-bold tracking-tight">Pick your track</h2>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        @for (c of categories; track c.id; let i = $index) {
          <a [routerLink]="['/category', c.slug]"
             class="group relative block border border-border hover:border-primary transition-all bg-card p-6 overflow-hidden"
             [attr.data-testid]="'category-card-' + c.slug">
            <div class="absolute top-0 left-0 w-full h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                 [style.background]="c.colorHex"></div>
            <div class="flex items-start justify-between mb-8">
              <span class="font-mono text-xs text-muted-foreground">{{ (i+1).toString().padStart(2, '0') }}</span>
              <span class="font-mono text-muted-foreground/60 group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1 transition-all">↗</span>
            </div>
            <div class="font-mono text-2xl mb-3" [style.color]="c.colorHex">
              {{ getCategoryIcon(c.slug) }}
            </div>
            <h3 class="font-heading text-xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">
              {{ c.name }}
            </h3>
            @if (c.description) {
              <p class="text-xs text-muted-foreground line-clamp-2 mb-4">{{ c.description }}</p>
            }
            <div class="font-mono text-xs text-muted-foreground/70">
              {{ categoryCount[c.slug] || 0 }} post{{ (categoryCount[c.slug] || 0) === 1 ? '' : 's' }}
            </div>
          </a>
        }
      </div>
    </section>

    <!-- ===== Trending ===== -->
    @if (trending.length) {
      <section class="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-border">
        <div class="mb-10">
          <div class="code-label mb-2">✦ // trending</div>
          <h2 class="font-heading text-3xl sm:text-4xl font-bold tracking-tight">What readers love</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (p of trending; track p.id; let i = $index) {
            <a [routerLink]="['/post', p.slug]"
               class="block group border border-border hover:border-primary/60 transition-colors p-4">
              <div class="flex items-start gap-3">
                <div class="font-mono text-xs text-primary mt-1">{{ p.viewCount.toString().padStart(2, '0') }}</div>
                <div class="flex-1">
                  <div class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {{ p.category.slug }}
                  </div>
                  <h4 class="font-heading font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {{ p.title }}
                  </h4>
                </div>
              </div>
            </a>
          }
        </div>
      </section>
    }

    <!-- ===== YouTube CTA ===== -->
    <section class="relative overflow-hidden border-t border-border">
      <div class="absolute inset-0">
        <img alt="" loading="lazy" class="w-full h-full object-cover opacity-20"
          src="https://images.pexels.com/photos/30820142/pexels-photo-30820142.jpeg" />
        <div class="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-6 sm:px-8 py-24 text-center">
        <div class="code-label mb-6 justify-center">// youtube.subscribe()</div>
        <h2 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-none mb-6">
          Watch the build.<br>
          <span class="text-primary">Live, unfiltered.</span>
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto mb-8">
          Every major post has a companion video. See the code written in real time, complete with the bugs, the detours and the wins.
        </p>
        <a href="https://youtube.com/@CodingCruiser" target="_blank" rel="noreferrer"
           class="btn btn-primary !px-8 !py-4 !text-base font-bold" data-testid="cta-subscribe-btn">
          ▶ Subscribe to CodingCruiser
        </a>
      </div>
    </section>

    <!-- ===== YouTube videos (if API key set) ===== -->
    @if (videos.length) {
      <section class="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-border">
        <div class="mb-10">
          <div class="code-label mb-2">// channel.latestVideos()</div>
          <h2 class="font-heading text-3xl sm:text-4xl font-bold tracking-tight">From the channel</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          @for (v of videos; track v.videoId) {
            <a [href]="v.watchUrl" target="_blank" rel="noopener"
               class="group block border border-border hover:border-primary/60 transition-all bg-card overflow-hidden">
              <img [src]="v.thumbnail" [alt]="v.title" loading="lazy"
                   class="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="p-4">
                <h4 class="font-heading font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {{ v.title }}
                </h4>
              </div>
            </a>
          }
        </div>
      </section>
    }
  `
})
export class HomeComponent implements OnInit {
  categories: Category[] = [];
  categoryCount: Record<string, number> = {};
  latest: Post[] = [];
  trending: Post[] = [];
  videos: YouTubeVideo[] = [];
  q = '';
  totalPosts = 0;

  constructor(
    private postService: PostService,
    private categoryService: CategoryService,
    private youtube: YouTubeApiService
  ) {}

  ngOnInit() {
    this.categoryService.list().subscribe(cs => this.categories = cs);
    this.postService.list({ size: 6 }).subscribe(p => {
      this.latest = p.content;
      this.totalPosts = p.totalElements;
      // tally per-category
      this.postService.list({ size: 200 }).subscribe(all => {
        const counts: Record<string, number> = {};
        all.content.forEach(post => {
          counts[post.category.slug] = (counts[post.category.slug] || 0) + 1;
        });
        this.categoryCount = counts;
      });
    });
    this.postService.trending().subscribe(t => this.trending = t.slice(0, 4));
    this.youtube.latest(3).subscribe(v => this.videos = v);
  }

  search() {
    if (!this.q.trim()) return;
    this.postService.list({ q: this.q, size: 12 }).subscribe(p => this.latest = p.content);
  }

  getCategoryIcon(slug: string): string {
    const icons: Record<string, string> = {
      'java': '☕', 'spring-boot': '🌿', 'angular': '🅰',
      'nextjs': '▲', 'full-stack': '◈', 'cloud': '☁'
    };
    return icons[slug] || '◇';
  }
}
