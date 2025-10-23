import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Professor } from '../../models/professor';
import { User } from '../../models/user';
import { RegistrationService } from '../../services/registration.service';
import { ProfessorService } from '../../services/professor.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registration.html',
  styleUrls: ['./registration.css']
})
export class Registration implements OnInit {

  // These objects will automatically get the new properties
  // from ngModel in the HTML
  user = new User();
  professor = new Professor();
  msg = '';

  // Signal to track active tab
  activeTab = signal<'user' | 'professor'>('user');

  constructor(
    private _registrationService: RegistrationService,
    private _professorService: ProfessorService,
    public _router: Router // Make public to access in template
  ) { }

  ngOnInit(): void {
    // Set default values for dropdowns
    (this.user as any).gender = "";
    (this.user as any).profession = "";
    (this.professor as any).gender = ""; // Keep this for professor
  }

  // Tab switching methods
  switchToUserTab(): void {
    this.activeTab.set('user');
  }

  switchToProfessorTab(): void {
    this.activeTab.set('professor');
  }

  // Helper methods for template
  isUserTabActive(): boolean {
    return this.activeTab() === 'user';
  }

  isProfessorTabActive(): boolean {
    return this.activeTab() === 'professor';
  }

  // Registration methods
  registerUser(): void {
    // The 'this.user' object will contain all fields
    // from the user form
    this._registrationService.registerUser(this.user).subscribe({
      next: (data: User) => {
        console.log("User Registration Success");
        sessionStorage.setItem("username", this.user.username);
        sessionStorage.setItem("gender", (this.user as any).gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error: (error: any) => {
        console.log("User Registration Failed", error.error);
        this.msg = "User with " + this.user.email + " already exists!";
        
      }
    });
  }

  registerProfessor(): void {
    // The 'this.professor' object will now contain all the new fields:
    // professorname, email, gender, mobile, password,
    // institutionName, department, experience, degrees
    this._registrationService.registerProfessor(this.professor).subscribe({
      next: (data: Professor) => {
        console.log("Professor Registration Success");
        sessionStorage.setItem("professorname", this.professor.professorname);
        sessionStorage.setItem("gender", (this.professor as any).gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error: (error: any) => {
        console.log("Professor Registration Failed", error.error);
        this.msg = "Professor with " + this.professor.email + " already exists!";
         
      }
    });
  }

}