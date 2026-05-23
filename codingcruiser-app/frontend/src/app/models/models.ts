export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  likedPostIds?: number[];
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  colorHex?: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  thumbnailUrl?: string;
  youtubeVideoId?: string;
  category: Category;
  author: { id: number; name: string; email: string };
  tags: string[];
  featured: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  user: { id: number; name: string; email: string };
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  watchUrl: string;
}
