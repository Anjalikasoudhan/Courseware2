import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registrationfailed',
  imports: [CommonModule],
  templateUrl: './registrationfailed.html',
  styleUrl: './registrationfailed.css',
})
export class Registrationfailed implements OnInit {
  constructor(private router : Router) { }
 ngOnInit(): void 
  {
    setTimeout(() => {
      this.router.navigate(['login']);
  }, 7000);
  
}}

