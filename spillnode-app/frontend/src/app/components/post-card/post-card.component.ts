import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Post } from '../../models/models';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <a [routerLink]="['/post', post.slug]" class="card block overflow-hidden h-full"
       [attr.data-testid]="'post-card-' + post.slug">
      <div class="aspect-[16/9] bg-ink-100 overflow-hidden relative">
        @if (post.thumbnailUrl) {
          <img [src]="post.thumbnailUrl" [alt]="post.title" class="w-full h-full object-cover" />
        } @else {
          <div class="w-full h-full bg-grain flex items-center justify-center font-display text-4xl text-ink-900/30">
            &lt;/&gt;
          </div>
        }
        @if (post.featured) {
          <span class="absolute top-3 left-3 bg-accent text-ink-900 text-xs font-bold px-2 py-1 rounded-full">
            FEATURED
          </span>
        }
        @if (post.youtubeVideoId) {
          <span class="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            ▶ VIDEO
          </span>
        }
      </div>
      <div class="p-5">
        <div class="flex items-center gap-2 text-xs mb-3">
          <span class="px-2 py-1 rounded-full font-semibold"
                [style.background-color]="post.category.colorHex + '22'"
                [style.color]="post.category.colorHex">
            {{ post.category.name }}
          </span>
          <span class="text-ink-400">·</span>
          <span class="text-ink-400">{{ post.createdAt | date:'MMM d, y' }}</span>
        </div>
        <h3 class="font-display font-bold text-lg leading-tight mb-2 line-clamp-2">{{ post.title }}</h3>
        @if (post.excerpt) {
          <p class="text-sm text-ink-700 line-clamp-2 mb-3">{{ post.excerpt }}</p>
        }
        <div class="flex items-center justify-between text-xs text-ink-400">
          <span>By {{ post.author.name }}</span>
          <span class="flex items-center gap-3">
            <span>♥ {{ post.likeCount }}</span>
            <span>👁 {{ post.viewCount }}</span>
          </span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
}
