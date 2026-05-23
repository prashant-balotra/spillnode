import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comment } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpClient) {}

  list(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/comments/post/${postId}`);
  }

  add(postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUrl}/comments/post/${postId}`, { content });
  }

  delete(commentId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/comments/${commentId}`);
  }
}
