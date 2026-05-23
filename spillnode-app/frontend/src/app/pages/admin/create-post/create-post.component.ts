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
    <section class="max-w-4xl mx-auto px-6 sm:px-8 py-16">
      <a routerLink="/admin" class="font-mono text-xs text-muted-foreground hover:text-primary">← back.to(admin)</a>
      <div class="code-label mt-4 mb-2">// {{ editingId ? 'post.edit()' : 'post.create()' }}</div>
      <h1 class="font-heading text-3xl sm:text-4xl font-black tracking-tight">
        {{ editingId ? 'Edit post' : 'Create new post' }}
      </h1>

      <form (ngSubmit)="save()" class="mt-10 space-y-6">
        <div>
          <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">title</label>
          <input type="text" [(ngModel)]="title" name="title" required
            data-testid="post-title"
            class="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none text-lg font-heading" />
        </div>

        <div>
          <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">excerpt</label>
          <textarea [(ngModel)]="excerpt" name="excerpt" rows="2"
            data-testid="post-excerpt"
            class="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none text-sm"></textarea>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">category</label>
            <select [(ngModel)]="categoryId" name="categoryId" required
              data-testid="post-category"
              class="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none text-sm">
              <option [ngValue]="null" disabled>// pick a category</option>
              @for (c of categories; track c.id) {
                <option [ngValue]="c.id">{{ c.name }}</option>
              }
            </select>
          </div>

          <div class="flex items-center pt-7">
            <input type="checkbox" [(ngModel)]="featured" name="featured" id="featured"
              data-testid="post-featured"
              class="w-5 h-5 accent-primary" />
            <label for="featured" class="ml-2 font-mono text-sm">featured.flag</label>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <div>
            <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">thumbnail.url</label>
            <input type="url" [(ngModel)]="thumbnailUrl" name="thumbnailUrl"
              data-testid="post-thumbnail" placeholder="https://..."
              class="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none text-sm font-mono" />
          </div>
          <div>
            <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">youtube.videoId</label>
            <input type="text" [(ngModel)]="youtubeVideoId" name="youtubeVideoId"
              data-testid="post-youtube" placeholder="dQw4w9WgXcQ"
              class="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none text-sm font-mono" />
          </div>
        </div>

        <div>
          <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">tags (comma-separated)</label>
          <input type="text" [(ngModel)]="tagsInput" name="tagsInput"
            data-testid="post-tags" placeholder="jwt, security, rest-api"
            class="w-full px-4 py-3 bg-card border border-border focus:border-primary focus:outline-none text-sm font-mono" />
        </div>

        <div>
          <label class="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">content</label>
          <quill-editor
            [(ngModel)]="content" name="content"
            [styles]="{ height: '420px' }"
            [modules]="quillModules"
            placeholder="// write your post... use the toolbar for headings, code blocks, quotes"
            data-testid="post-content"
            class="block border border-border overflow-hidden">
          </quill-editor>
          <p class="font-mono text-xs text-muted-foreground mt-2">
            // tip: use the <strong class="text-primary">code-block</strong> button for snippets, <strong class="text-primary">blockquote</strong> for callouts
          </p>
        </div>

        @if (error) { <p class="font-mono text-xs text-red-500">// error: {{ error }}</p> }

        <div class="flex gap-3">
          <button type="submit" [disabled]="saving" class="btn btn-primary disabled:opacity-50"
            data-testid="post-save">
            {{ saving ? 'saving...' : (editingId ? 'update.post()' : 'publish.post()') }}
          </button>
          <a routerLink="/admin" class="btn btn-outline">cancel</a>
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
