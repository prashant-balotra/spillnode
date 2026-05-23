import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { PostService } from '../../../services/post.service';
import { CategoryService } from '../../../services/category.service';
import { Category, Post } from '../../../models/models';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, QuillModule],
  template: `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <a routerLink="/admin" class="text-sm text-ink-400 hover:text-ink-900">← Back to admin</a>
      <h1 class="font-display text-3xl font-extrabold mt-3">
        {{ editingId ? 'Edit post' : 'Create new post' }}
      </h1>

      <form (ngSubmit)="save()" class="mt-8 space-y-5">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Title</label>
          <input type="text" [(ngModel)]="title" name="title" required
            data-testid="post-title"
            class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Excerpt</label>
          <textarea [(ngModel)]="excerpt" name="excerpt" rows="2"
            data-testid="post-excerpt"
            class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm"></textarea>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Category</label>
            <select [(ngModel)]="categoryId" name="categoryId" required
              data-testid="post-category"
              class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm">
              <option [ngValue]="null" disabled>Choose a category</option>
              @for (c of categories; track c.id) {
                <option [ngValue]="c.id">{{ c.name }}</option>
              }
            </select>
          </div>

          <div class="flex items-center pt-7">
            <input type="checkbox" [(ngModel)]="featured" name="featured" id="featured"
              data-testid="post-featured"
              class="w-5 h-5 accent-yellow-500" />
            <label for="featured" class="ml-2 text-sm font-semibold">Mark as featured</label>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Thumbnail URL</label>
            <input type="url" [(ngModel)]="thumbnailUrl" name="thumbnailUrl"
              data-testid="post-thumbnail"
              placeholder="https://..."
              class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">YouTube Video ID</label>
            <input type="text" [(ngModel)]="youtubeVideoId" name="youtubeVideoId"
              data-testid="post-youtube"
              placeholder="e.g. dQw4w9WgXcQ"
              class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Tags (comma separated)</label>
          <input type="text" [(ngModel)]="tagsInput" name="tagsInput"
            data-testid="post-tags"
            placeholder="jwt, security, rest-api"
            class="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent focus:outline-none text-sm" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Content</label>
          <quill-editor
            [(ngModel)]="content" name="content"
            [styles]="{ height: '380px', background: 'white' }"
            [modules]="quillModules"
            placeholder="Write your post... use the toolbar for headings, lists, code blocks, quotes."
            data-testid="post-content"
            class="block rounded-xl border border-ink-200 overflow-hidden">
          </quill-editor>
          <p class="text-xs text-ink-400 mt-1">
            Tip: Use the <strong>code block</strong> button for code snippets, <strong>quote</strong> for callouts.
          </p>
        </div>

        @if (error) { <p class="text-sm text-red-600">{{ error }}</p> }

        <div class="flex gap-3">
          <button type="submit" [disabled]="saving" class="btn-pill btn-primary disabled:opacity-50"
            data-testid="post-save">
            {{ saving ? 'Saving...' : (editingId ? 'Update post' : 'Publish post') }}
          </button>
          <a routerLink="/admin" class="btn-pill btn-ghost">Cancel</a>
        </div>
      </form>
    </section>
  `
})
export class CreatePostComponent implements OnInit {
  editingId: number | null = null;
  categories: Category[] = [];

  title = '';
  excerpt = '';
  content = '';
  thumbnailUrl = '';
  youtubeVideoId = '';
  categoryId: number | null = null;
  featured = false;
  tagsInput = '';
  saving = false;
  error = '';

  // Quill toolbar configuration
  quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ color: [] }, { background: [] }],
      ['clean']
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.list().subscribe(cs => this.categories = cs);
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editingId = Number(idParam);
      // we need slug lookup; here we list all and pick — simpler: skip and rely on post-detail flow
      // Optional: add a /api/posts/{id} endpoint. For now we use list+filter.
      this.postService.list({ size: 200 }).subscribe(page => {
        const found = page.content.find(p => p.id === this.editingId);
        if (found) this.fill(found);
      });
    }
  }

  fill(p: Post) {
    this.title = p.title;
    this.excerpt = p.excerpt ?? '';
    this.content = p.content;
    this.thumbnailUrl = p.thumbnailUrl ?? '';
    this.youtubeVideoId = p.youtubeVideoId ?? '';
    this.categoryId = p.category.id;
    this.featured = p.featured;
    this.tagsInput = (p.tags ?? []).join(', ');
  }

  save() {
    this.error = '';
    if (!this.categoryId) { this.error = 'Pick a category'; return; }
    this.saving = true;
    const payload = {
      title: this.title,
      excerpt: this.excerpt,
      content: this.content,
      thumbnailUrl: this.thumbnailUrl,
      youtubeVideoId: this.youtubeVideoId,
      categoryId: this.categoryId,
      featured: this.featured,
      tags: this.tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    };
    const obs = this.editingId
      ? this.postService.update(this.editingId, payload as any)
      : this.postService.create(payload as any);

    obs.subscribe({
      next: (p) => this.router.navigate(['/post', p.slug]),
      error: (e) => { this.saving = false; this.error = e.error?.error ?? 'Save failed'; }
    });
  }
}
