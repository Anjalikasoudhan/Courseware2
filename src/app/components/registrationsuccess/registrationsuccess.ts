import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registrationsuccess',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './registrationsuccess.html',
  styleUrl: './registrationsuccess.css'
})
export class Registrationsuccess implements OnInit{
constructor(private router : Router) { }

  ngOnInit(): void 
  {
    setTimeout(() => {
      this.router.navigate(['login']);
  }, 7000);
  }
}
