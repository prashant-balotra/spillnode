import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { Post, Comment } from '../../models/models';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DatePipe],
  template: `
    @if (post) {
      <article class="max-w-3xl mx-auto px-6 sm:px-8 py-16">
        <div class="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
          // post.{{ post.category.slug }}
        </div>

        <a [routerLink]="['/category', post.category.slug]"
           class="inline-block font-mono text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground px-2 py-1 mb-6">
          {{ post.category.slug }}
        </a>

        <h1 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-[1.0]">
          {{ post.title }}
        </h1>

        <div class="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground border-y border-border py-4">
          <span>by <strong class="text-foreground">{{ post.author.name }}</strong></span>
          <span class="text-muted-foreground/50">·</span>
          <span>{{ post.createdAt | date:'MMM d, y' }}</span>
          <span class="text-muted-foreground/50">·</span>
          <span>👁 {{ post.viewCount }} reads</span>
          <button (click)="toggleLike()"
            class="ml-auto btn text-xs"
            [class.btn-primary]="liked" [class.btn-outline]="!liked"
            data-testid="post-like-btn">
            ♥ {{ post.likeCount }} {{ liked ? 'liked' : 'like' }}
          </button>
        </div>

        @if (post.thumbnailUrl) {
          <img [src]="post.thumbnailUrl" [alt]="post.title"
               class="w-full aspect-video object-cover border border-border mt-10 mb-2" />
        }

        @if (youtubeEmbed) {
          <div class="aspect-video border border-border overflow-hidden mt-6 bg-card">
            <iframe [src]="youtubeEmbed" frameborder="0" class="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowfullscreen></iframe>
          </div>
        }

        @if (post.tags.length) {
          <div class="flex flex-wrap gap-2 mt-6">
            @for (t of post.tags; track t) {
              <span class="font-mono text-xs px-2 py-1 border border-border text-muted-foreground">#{{ t }}</span>
            }
          </div>
        }

        <div class="prose-content mt-10" [innerHTML]="post.content"></div>

        <!-- Comments -->
        <section class="mt-20 pt-10 border-t border-border">
          <div class="code-label mb-3">// comments ({{ comments.length }})</div>
          <h3 class="font-heading text-2xl font-black tracking-tight">Discussion</h3>

          @if (auth.isLoggedInSig()) {
            <form (ngSubmit)="addComment()" class="mt-6 border border-border bg-card p-4">
              <textarea [(ngModel)]="newComment" name="newComment" rows="3" required
                placeholder="// share your thoughts..." data-testid="comment-input"
                class="w-full px-3 py-2 bg-background border border-border focus:border-primary focus:outline-none text-sm font-mono"></textarea>
              <div class="flex justify-end mt-3">
                <button class="btn btn-primary text-xs" data-testid="comment-submit">post.comment()</button>
              </div>
            </form>
          } @else {
            <div class="mt-6 p-4 border border-border bg-card font-mono text-sm text-muted-foreground">
              <a routerLink="/login" class="text-primary font-semibold hover:underline">sign.in()</a>
              to leave a comment.
            </div>
          }

          <ul class="mt-8 space-y-3">
            @for (c of comments; track c.id) {
              <li class="border border-border bg-card p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-mono text-xs text-primary">{{ c.user.name }}</span>
                  <span class="font-mono text-[10px] text-muted-foreground">{{ c.createdAt | date:'short' }}</span>
                </div>
                <p class="text-sm text-foreground/85">{{ c.content }}</p>
                @if (canDelete(c)) {
                  <button (click)="deleteComment(c.id)" class="font-mono text-[10px] text-red-500 mt-3 hover:underline">
                    delete()
                  </button>
                }
              </li>
            } @empty {
              <li class="font-mono text-sm text-muted-foreground">// no comments yet — be the first</li>
            }
          </ul>
        </section>
      </article>
    }
  `
})
export class PostDetailComponent implements OnInit {
  post?: Post;
  comments: Comment[] = [];
  newComment = '';
  liked = false;
  youtubeEmbed?: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    public auth: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      const slug = p.get('slug') ?? '';
      this.postService.getBySlug(slug).subscribe(post => {
        this.post = post;
        if (post.youtubeVideoId) {
          this.youtubeEmbed = this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${post.youtubeVideoId}`);
        }
        this.commentService.list(post.id).subscribe(cs => this.comments = cs);
        if (this.auth.isLoggedIn()) {
          this.auth.me().subscribe(me => {
            this.liked = (me.likedPostIds ?? []).includes(post.id);
          });
        }
      });
    });
  }

  toggleLike() {
    if (!this.post) return;
    if (!this.auth.isLoggedIn()) { window.location.href = '/login'; return; }
    this.postService.toggleLike(this.post.id).subscribe(p => {
      this.post = p;
      this.liked = !this.liked;
    });
  }

  addComment() {
    if (!this.post || !this.newComment.trim()) return;
    this.commentService.add(this.post.id, this.newComment).subscribe(c => {
      this.comments = [c, ...this.comments];
      this.newComment = '';
    });
  }

  canDelete(c: Comment): boolean {
    return this.auth.isAdmin() || this.auth.user()?.userId === c.user.id;
  }

  deleteComment(id: number) {
    this.commentService.delete(id).subscribe(() => {
      this.comments = this.comments.filter(c => c.id !== id);
    });
  }
}
