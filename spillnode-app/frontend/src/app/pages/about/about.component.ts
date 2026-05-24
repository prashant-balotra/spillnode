import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="max-w-4xl mx-auto px-6 sm:px-8 py-20">
      <div class="code-label mb-4">// about.spillnode</div>
      <h1 class="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tightest leading-[0.95]">
        A network of devs <span class="text-primary">spilling</span> what they learn.
      </h1>

      <div class="prose-content mt-10 text-lg">
        <p>
          <strong>SpillNode</strong> is a home for developer-to-developer knowledge. Tutorials, deep dives,
          and end-to-end project breakdowns across Java, Spring Boot, Angular, Next.js, full-stack and cloud —
          written by people who actually ship.
        </p>
        <p>
          Every post is one node in a growing network. Follow a track, jump between topics, or search your way
          to the exact answer. No fluff, no listicles, no SEO theatre.
        </p>

        <h2>What you'll find here</h2>
        <ul>
          <li>End-to-end project tutorials with code walkthroughs</li>
          <li>Deep dives into Spring Boot internals, JPA, security and REST design</li>
          <li>Angular &amp; Next.js patterns that scale beyond demos</li>
          <li>DSA and system design notes that hold up in interviews</li>
          <li>Cloud deployments — Docker, Kubernetes, AWS</li>
        </ul>

        <h2>How posts are structured</h2>
        <p>
          Each tutorial pairs a video on the channel with a written, searchable companion post here —
          so you can scan, copy code, and revisit fast.
        </p>

        <blockquote>
          The goal isn't to memorize syntax. It's to <strong>understand the why</strong> so you can build anything.
        </blockquote>

        <h2>Want to connect?</h2>
        <p>
          Subscribe to the newsletter below — a short note when a new tutorial drops.
          Drop a comment on any post and we'll spill back.
        </p>
      </div>

      <div class="mt-12 flex flex-wrap gap-3">
        <a routerLink="/categories" class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all rounded-sm">
          Browse tracks →
        </a>
        <a routerLink="/category/spring-boot" class="inline-flex items-center gap-2 px-6 py-3 border border-border hover:border-primary text-foreground font-semibold transition-all rounded-sm">
          Start with Spring Boot
        </a>
      </div>
    </section>
  `
})
export class AboutComponent {}
