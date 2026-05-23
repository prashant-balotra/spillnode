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
    <section class="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-display text-3xl font-extrabold">Admin · Posts</h1>
          <p class="text-sm text-ink-400 mt-1">Manage all blog posts.</p>
        </div>
        <a routerLink="/admin/posts/new" class="btn-pill btn-accent" data-testid="admin-new-post">
          + New post
        </a>
      </div>

      <div class="card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-ink-50 text-xs uppercase tracking-wider text-ink-400">
            <tr>
              <th class="text-left px-4 py-3">Title</th>
              <th class="text-left px-4 py-3">Category</th>
              <th class="text-left px-4 py-3">Featured</th>
              <th class="text-left px-4 py-3">Views</th>
              <th class="text-left px-4 py-3">Likes</th>
              <th class="text-left px-4 py-3">Created</th>
              <th class="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of posts; track p.id) {
              <tr class="border-t border-ink-100 hover:bg-ink-50">
                <td class="px-4 py-3 font-semibold">{{ p.title }}</td>
                <td class="px-4 py-3">{{ p.category.name }}</td>
                <td class="px-4 py-3">{{ p.featured ? '⭐' : '—' }}</td>
                <td class="px-4 py-3">{{ p.viewCount }}</td>
                <td class="px-4 py-3">{{ p.likeCount }}</td>
                <td class="px-4 py-3 text-ink-400">{{ p.createdAt | date:'mediumDate' }}</td>
                <td class="px-4 py-3 text-right">
                  <a [routerLink]="['/admin/posts/edit', p.id]" class="text-accent-700 font-semibold hover:underline mr-3">
                    Edit
                  </a>
                  <button (click)="del(p.id)" class="text-red-600 font-semibold hover:underline"
                    [attr.data-testid]="'admin-delete-' + p.id">
                    Delete
                  </button>
                </td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="px-4 py-8 text-center text-ink-400">No posts yet.</td></tr>
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

  load() {
    this.postService.list({ size: 100 }).subscribe(p => this.posts = p.content);
  }

  del(id: number) {
    if (!confirm('Delete this post?')) return;
    this.postService.delete(id).subscribe(() => this.load());
  }
}
