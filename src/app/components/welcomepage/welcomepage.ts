import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcomepage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './welcomepage.html',
  styleUrl: './welcomepage.css'
})
export class Welcomepage {
  visibleTextId: string | null = null; // Change to public
  
  constructor(private router: Router) {}

  toggleText(textId: string): void {
    // If clicking the same text, close it, otherwise show the new one
    this.visibleTextId = this.visibleTextId === textId ? null : textId;
  }

  isTextVisible(textId: string): boolean {
    return this.visibleTextId === textId;
  }

  scrollToServices(): void {
    const servicesElement = document.getElementById('services');
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  navigate(): void {
    this.router.navigate(['/login']);
  }
}