import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <section class="max-w-7xl mx-auto px-6 sm:px-8 py-16">
      <div class="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <div class="code-label mb-2">// admin.posts</div>
          <h1 class="font-heading text-3xl sm:text-4xl font-black tracking-tight">Manage posts</h1>
        </div>
        <a routerLink="/admin/posts/new" class="btn btn-primary" data-testid="admin-new-post">
          + new.post()
        </a>
      </div>

      <div class="border border-border bg-card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="border-b border-border">
            <tr class="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th class="text-left px-4 py-3">title</th>
              <th class="text-left px-4 py-3">category</th>
              <th class="text-left px-4 py-3">featured</th>
              <th class="text-left px-4 py-3">views</th>
              <th class="text-left px-4 py-3">likes</th>
              <th class="text-left px-4 py-3">created</th>
              <th class="text-right px-4 py-3">actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of posts; track p.id) {
              <tr class="border-t border-border hover:bg-muted/30 transition-colors">
                <td class="px-4 py-3 font-semibold">{{ p.title }}</td>
                <td class="px-4 py-3 font-mono text-xs text-muted-foreground">{{ p.category.slug }}</td>
                <td class="px-4 py-3">{{ p.featured ? '★' : '—' }}</td>
                <td class="px-4 py-3 font-mono text-xs">{{ p.viewCount }}</td>
                <td class="px-4 py-3 font-mono text-xs">{{ p.likeCount }}</td>
                <td class="px-4 py-3 font-mono text-xs text-muted-foreground">{{ p.createdAt | date:'mediumDate' }}</td>
                <td class="px-4 py-3 text-right font-mono text-xs">
                  <a [routerLink]="['/admin/posts/edit', p.id]"
                     class="text-primary hover:underline mr-3">edit()</a>
                  <button (click)="del(p.id)" class="text-red-500 hover:underline"
                    [attr.data-testid]="'admin-delete-' + p.id">delete()</button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="px-4 py-8 text-center font-mono text-muted-foreground">// no posts yet</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class AdminComponent implements OnInit {
  posts: Post[] = [];
  constructor(private postService: PostService) {}

  ngOnInit() { this.load(); }
  load() { this.postService.list({ size: 100 }).subscribe(p => this.posts = p.content); }
  del(id: number) {
    if (!confirm('Delete this post?')) return;
    this.postService.delete(id).subscribe(() => this.load());
  }
}
