import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Page, Post } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  list(opts: { q?: string; category?: string; page?: number; size?: number } = {}): Observable<Page<Post>> {
    let params = new HttpParams();
    if (opts.q) params = params.set('q', opts.q);
    if (opts.category) params = params.set('category', opts.category);
    params = params.set('page', String(opts.page ?? 0));
    params = params.set('size', String(opts.size ?? 9));
    return this.http.get<Page<Post>>(`${environment.apiUrl}/posts`, { params });
  }

  featured(): Observable<Page<Post>> {
    return this.http.get<Page<Post>>(`${environment.apiUrl}/posts/featured?size=3`);
  }

  trending(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts/trending`);
  }

  getBySlug(slug: string): Observable<Post> {
    return this.http.get<Post>(`${environment.apiUrl}/posts/slug/${slug}`);
  }

  create(payload: Partial<Post> & { categoryId: number; tags?: string[] }): Observable<Post> {
    return this.http.post<Post>(`${environment.apiUrl}/posts`, payload);
  }

  update(id: number, payload: Partial<Post> & { categoryId: number; tags?: string[] }): Observable<Post> {
    return this.http.put<Post>(`${environment.apiUrl}/posts/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/posts/${id}`);
  }

  toggleLike(id: number): Observable<Post> {
    return this.http.post<Post>(`${environment.apiUrl}/posts/${id}/like`, {});
  }
}
