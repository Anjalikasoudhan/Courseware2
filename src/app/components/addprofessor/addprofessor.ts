import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Professor } from '../../models/professor';
import { AdminService } from '../../services/admin.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-addprofessor',
  standalone: true,
  imports: [CommonModule, FormsModule,Header,Footer],
  templateUrl: './addprofessor.html',
  styleUrls: ['./addprofessor.css']
})
export class Addprofessor implements OnInit {
  professor = signal(new Professor());
  msg = signal(' ');

  constructor(
    private adminService: AdminService, 
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  addProfessor() {
    this.adminService.addProfessor(this.professor()).subscribe({
      next: (data) => {
        console.log("Professor added Successfully !!!");
        this.msg.set("Professor added Successfully");

        setTimeout(()=>{
         this.router.navigate(['/admindashboard']);
        },3000);
        
      },
      error: (error) => {
        console.log("Process Failed");
        console.log(error.error);
        this.msg.set("Professor with " + this.professor().email + " already exists !!!");
      }
    });
  }

  registerUser() {
    // Implementation if needed
  }
}