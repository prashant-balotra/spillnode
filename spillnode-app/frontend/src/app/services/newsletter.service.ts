import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { YouTubeVideo } from '../models/models';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private http: HttpClient) {}

  subscribe(email: string): Observable<{ message: string; email: string }> {
    return this.http.post<{ message: string; email: string }>(
      `${environment.apiUrl}/newsletter/subscribe`, { email });
  }
}

@Injectable({ providedIn: 'root' })
export class YouTubeApiService {
  constructor(private http: HttpClient) {}

  latest(max = 6): Observable<YouTubeVideo[]> {
    return this.http.get<YouTubeVideo[]>(`${environment.apiUrl}/youtube/latest?max=${max}`);
  }
}
