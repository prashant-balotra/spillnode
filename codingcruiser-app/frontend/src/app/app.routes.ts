import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'signup', loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
  { path: 'category/:slug', loadComponent: () => import('./pages/category/category.component').then(m => m.CategoryComponent) },
  { path: 'post/:slug', loadComponent: () => import('./pages/post-detail/post-detail.component').then(m => m.PostDetailComponent) },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'admin/posts/new',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/create-post/create-post.component').then(m => m.CreatePostComponent)
  },
  {
    path: 'admin/posts/edit/:id',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/create-post/create-post.component').then(m => m.CreatePostComponent)
  },
  { path: '**', redirectTo: '' }
];
