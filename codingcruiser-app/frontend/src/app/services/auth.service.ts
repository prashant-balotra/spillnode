import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, User } from '../models/models';

const STORAGE_KEY = 'cc_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<AuthResponse | null>(this.loadFromStorage());
  user = this._user.asReadonly();

  isLoggedInSig = computed(() => this._user() !== null);
  isAdminSig = computed(() => this._user()?.role === 'ADMIN');

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return this._user()?.token ?? null;
  }

  isLoggedIn(): boolean { return this._user() !== null; }
  isAdmin(): boolean { return this._user()?.role === 'ADMIN'; }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => this.persist(res)));
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { name, email, password })
      .pipe(tap(res => this.persist(res)));
  }

  me(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`);
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this._user.set(null);
  }

  private persist(res: AuthResponse) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(res));
    this._user.set(res);
  }

  private loadFromStorage(): AuthResponse | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as AuthResponse : null;
    } catch {
      return null;
    }
  }
}
