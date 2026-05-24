import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SpillNode brand mark — green rounded square with connected-node icon + wordmark.
 * Matches the official logo (white "Spill" + green "Node").
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-3 select-none group">
      <div class="logo-mark relative w-9 h-9 rounded-lg bg-primary flex items-center justify-center
                  transition-all duration-300 group-hover:scale-105 group-hover:rotate-[-4deg]
                  group-hover:shadow-[0_0_24px_-4px_hsl(var(--primary)/0.7)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <!-- connected-nodes / share icon -->
          <circle cx="6" cy="12" r="2.2" fill="white" stroke="none"/>
          <circle cx="17" cy="6.5" r="1.8" fill="white" fill-opacity="0.65" stroke="none"/>
          <circle cx="17" cy="17.5" r="1.8" fill="white" fill-opacity="0.65" stroke="none"/>
          <line x1="7.8" y1="11" x2="15.3" y2="7.4"/>
          <line x1="7.8" y1="13" x2="15.3" y2="16.6"/>
        </svg>
      </div>
      @if (showWordmark) {
        <span class="font-heading font-black text-lg tracking-tight leading-none">
          <span class="text-foreground">Spill</span><span class="text-primary">Node</span>
        </span>
      }
    </div>
  `
})
export class LogoComponent {
  @Input() showWordmark = true;
}
