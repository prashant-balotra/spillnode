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
      <article class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <a [routerLink]="['/category', post.category.slug]"
           class="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
           [style.background-color]="post.category.colorHex + '22'"
           [style.color]="post.category.colorHex">
          {{ post.category.name }}
        </a>
        <h1 class="font-display text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
          {{ post.title }}
        </h1>

        <div class="mt-5 flex flex-wrap items-center gap-4 text-sm text-ink-400">
          <span>By <strong class="text-ink-900">{{ post.author.name }}</strong></span>
          <span>·</span>
          <span>{{ post.createdAt | date:'MMM d, y' }}</span>
          <span>·</span>
          <span>👁 {{ post.viewCount }} reads</span>
          <button (click)="toggleLike()"
            class="ml-auto btn-pill text-sm"
            [class.btn-accent]="liked" [class.btn-ghost]="!liked"
            data-testid="post-like-btn">
            ♥ {{ post.likeCount }} {{ liked ? 'Liked' : 'Like' }}
          </button>
        </div>

        @if (post.thumbnailUrl) {
          <img [src]="post.thumbnailUrl" [alt]="post.title"
               class="w-full aspect-video object-cover rounded-2xl mt-8 mb-2" />
        }

        @if (youtubeEmbed) {
          <div class="aspect-video rounded-2xl overflow-hidden mt-6 bg-ink-900">
            <iframe [src]="youtubeEmbed" frameborder="0" class="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowfullscreen></iframe>
          </div>
        }

        @if (post.tags.length) {
          <div class="flex flex-wrap gap-2 mt-6">
            @for (t of post.tags; track t) {
              <span class="px-2 py-1 rounded-full bg-ink-100 text-xs text-ink-700">#{{ t }}</span>
            }
          </div>
        }

        <div class="prose-content mt-8" [innerHTML]="post.content"></div>

        <!-- Comments -->
        <section class="mt-16 pt-8 border-t border-ink-100">
          <h3 class="font-display text-2xl font-extrabold">💬 Comments ({{ comments.length }})</h3>

          @if (auth.isLoggedInSig()) {
            <form (ngSubmit)="addComment()" class="mt-6 card p-4">
              <textarea [(ngModel)]="newComment" name="newComment" rows="3" required
                placeholder="Share your thoughts..." data-testid="comment-input"
                class="w-full px-3 py-2 rounded-lg border border-ink-100 focus:border-accent focus:outline-none text-sm"></textarea>
              <div class="flex justify-end mt-3">
                <button class="btn-pill btn-primary text-sm" data-testid="comment-submit">Post comment</button>
              </div>
            </form>
          } @else {
            <div class="mt-6 p-4 rounded-xl bg-ink-50 text-sm">
              <a routerLink="/login" class="font-semibold text-accent-700 hover:underline">Sign in</a>
              to leave a comment.
            </div>
          }

          <ul class="mt-8 space-y-4">
            @for (c of comments; track c.id) {
              <li class="card p-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-sm">{{ c.user.name }}</span>
                  <span class="text-xs text-ink-400">{{ c.createdAt | date:'short' }}</span>
                </div>
                <p class="text-sm text-ink-700">{{ c.content }}</p>
                @if (canDelete(c)) {
                  <button (click)="deleteComment(c.id)" class="text-xs text-red-600 mt-2 hover:underline">
                    Delete
                  </button>
                }
              </li>
            } @empty {
              <li class="text-sm text-ink-400">No comments yet — be the first!</li>
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
        // load liked state
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
