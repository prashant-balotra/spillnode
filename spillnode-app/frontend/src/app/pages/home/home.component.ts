import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { YouTubeApiService } from '../../services/newsletter.service';
import { Category, Post, YouTubeVideo } from '../../models/models';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { CatIconComponent } from '../../components/cat-icon/cat-icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, PostCardComponent, CatIconComponent],
  template: `
    <!-- ===== Hero ===== -->
    <section class="relative overflow-hidden border-b border-border">
      <div class="absolute inset-0 gradient-amber-soft pointer-events-none"></div>
      <div class="absolute inset-0 grain-overlay pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-6 sm:px-8 py-20 lg:py-28 relative">
        <div class="grid lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7 animate-fade-up">
            <div class="code-label mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m7 11 2-2-2-2"></path><path d="M11 13h4"></path>
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
              </svg>
              // welcome.to(SpillNode)
            </div>
            <h1 class="font-heading text-4xl sm:text-5xl lg:text-7xl font-black tracking-tightest leading-[0.95] mb-6">
              Spilling<br>
              <span class="text-primary">code</span>, concepts &amp;<br>
              real-world <span class="italic font-light">builds</span>.
            </h1>
            <p class="text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              A network of developers spilling what they learn — Java, Spring Boot, Angular, Next.js, and cloud. Real tutorials, real projects, real wins.
            </p>

            <div class="flex flex-wrap gap-3">
              <a routerLink="/categories"
                 class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all rounded-sm"
                 data-testid="hero-explore-btn">
                Explore categories
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
              </a>
              <a href="https://youtube.com/@Spillnode" target="_blank" rel="noreferrer"
                 class="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-primary text-foreground font-semibold transition-all rounded-sm"
                 data-testid="hero-youtube-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
                Watch on YouTube
              </a>
            </div>

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
              <img alt="Developer at work" loading="lazy" class="w-full h-full object-cover"
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
          <h2 class="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            {{ searchQuery ? 'Search results' : 'Fresh from the editor' }}
          </h2>
          @if (searchQuery) {
            <p class="font-mono text-sm text-muted-foreground mt-1">// matching '{{ searchQuery }}'</p>
          }
        </div>
        <a routerLink="/categories" class="font-mono text-sm text-muted-foreground hover:text-primary">view.all() →</a>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (p of latest; track p.id) {
          <app-post-card [post]="p"></app-post-card>
        } @empty {
          <p class="text-muted-foreground col-span-3 font-mono text-sm">// no posts yet — sign in as admin to publish the first one</p>
        }
      </div>
    </section>

    <!-- ===== Pick your track ===== -->
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

    <!-- ===== Trending ===== -->
    @if (trending.length) {
      <section class="max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-border">
        <div class="mb-10">
          <div class="code-label mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
            // trending
          </div>
          <h2 class="font-heading text-3xl sm:text-4xl font-bold tracking-tight">What readers love</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (p of trending; track p.id) {
            <a [routerLink]="['/post', p.slug]"
               class="block group border border-border hover:border-primary/60 transition-colors p-4">
              <div class="flex items-start gap-3">
                <div class="font-mono text-xs text-primary mt-1">{{ pad(p.viewCount) }}</div>
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
        <a href="https://youtube.com/@Spillnode" target="_blank" rel="noreferrer"
           class="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all rounded-sm"
           data-testid="cta-subscribe-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
          Subscribe to SpillNode
        </a>
      </div>
    </section>

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
  totalPosts = 0;
  searchQuery = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private categoryService: CategoryService,
    private youtube: YouTubeApiService
  ) {}

  ngOnInit() {
    this.categoryService.list().subscribe(cs => this.categories = cs);
    this.postService.trending().subscribe(t => this.trending = t.slice(0, 4));
    this.youtube.latest(3).subscribe(v => this.videos = v);

    this.route.queryParamMap.subscribe(p => {
      this.searchQuery = p.get('q') ?? '';
      this.loadPosts();
    });
  }

  private loadPosts() {
    this.postService.list({ q: this.searchQuery || undefined, size: 9 }).subscribe(p => {
      this.latest = p.content;
      this.totalPosts = p.totalElements;
    });
    if (!Object.keys(this.categoryCount).length) {
      this.postService.list({ size: 200 }).subscribe(all => {
        const counts: Record<string, number> = {};
        all.content.forEach(post => {
          counts[post.category.slug] = (counts[post.category.slug] || 0) + 1;
        });
        this.categoryCount = counts;
      });
    }
  }

  pad(n: number): string { return n.toString().padStart(2, '0'); }
}
