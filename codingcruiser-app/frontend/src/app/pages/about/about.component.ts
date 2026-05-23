import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-20">
      <span class="inline-block text-xs font-bold uppercase tracking-widest text-accent-700">About</span>
      <h1 class="font-display text-4xl sm:text-5xl font-extrabold mt-3 leading-tight">
        Hey, I'm the developer behind <span class="bg-accent text-ink-900 px-2 -rotate-1 inline-block">CodingCruiser</span>
      </h1>

      <div class="prose-content mt-8 text-lg">
        <p>
          CodingCruiser started as a YouTube channel for sharing what I learn while shipping real software —
          Java, Spring Boot, Angular, Next.js, full-stack projects, and now cloud.
        </p>
        <p>
          This site brings those tutorials into one focused home where you can read, search, and learn
          at your own pace — no algorithm to fight, no fluff to scroll past.
        </p>

        <h2>What you'll find here</h2>
        <ul>
          <li>End-to-end project tutorials with code walkthroughs</li>
          <li>Deep-dives into Spring Boot internals, JPA, security, and REST design</li>
          <li>Angular & Next.js patterns that scale beyond demos</li>
          <li>Cloud deployments — coming soon</li>
        </ul>

        <h2>How posts are structured</h2>
        <p>
          Each tutorial pairs a video on the channel with a written, searchable companion post
          here — so you can scan, copy code, and revisit fast.
        </p>

        <blockquote>
          The goal isn't to memorize syntax. It's to <strong>understand the why</strong> so you can build anything.
        </blockquote>

        <h2>Want to connect?</h2>
        <p>
          Subscribe to the newsletter below — I send a short note when a new tutorial drops.
          You can also drop comments on any post and I'll get back to you.
        </p>
      </div>

      <div class="mt-12 flex flex-wrap gap-3">
        <a routerLink="/" class="btn-pill btn-primary">Browse tutorials →</a>
        <a routerLink="/category/spring-boot" class="btn-pill btn-ghost">Start with Spring Boot</a>
      </div>
    </section>
  `
})
export class AboutComponent {}
