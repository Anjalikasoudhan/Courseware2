import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
 standalone: true,
  imports: [CommonModule,],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements OnInit {
    constructor(){}
currentYear: number = new Date().getFullYear();
    ngOnInit(): void {
        
    }
}
