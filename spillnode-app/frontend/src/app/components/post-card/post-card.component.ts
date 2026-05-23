import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/models';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <a [routerLink]="['/post', post.slug]"
       class="group block border border-border hover:border-primary/60 transition-all bg-card relative overflow-hidden h-full"
       [attr.data-testid]="'post-card-' + post.slug">
      <div class="aspect-[16/9] overflow-hidden bg-muted relative">
        @if (post.thumbnailUrl) {
          <img [src]="post.thumbnailUrl" [alt]="post.title" loading="lazy"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        } @else {
          <div class="w-full h-full flex items-center justify-center font-mono text-4xl text-muted-foreground/30">
            &lt;/&gt;
          </div>
        }
        <div class="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
        <div class="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-[0.2em] bg-primary text-primary-foreground px-2 py-1">
          {{ post.category.slug }}
        </div>
        @if (post.featured) {
          <div class="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-[0.2em] border border-primary text-primary px-2 py-1">
            featured
          </div>
        }
        @if (post.youtubeVideoId) {
          <div class="absolute bottom-3 right-3 flex items-center gap-1 bg-red-600 text-white text-[10px] font-mono uppercase tracking-wider px-2 py-1">
            ▶ video
          </div>
        }
      </div>
      <div class="p-5">
        <h3 class="font-heading text-xl font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {{ post.title }}
        </h3>
        @if (post.excerpt) {
          <p class="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">{{ post.excerpt }}</p>
        }
        <div class="flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span class="flex items-center gap-1">👁 {{ post.viewCount }}</span>
          <span class="flex items-center gap-1">♥ {{ post.likeCount }}</span>
          <span>{{ post.createdAt | date:'MMM d, y' }}</span>
        </div>
      </div>
    </a>
  `
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
}
