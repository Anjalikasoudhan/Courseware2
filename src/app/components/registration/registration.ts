import { Component, OnInit, signal, ViewChild } from '@angular/core'; // Import ViewChild
import { NgForm } from '@angular/forms'; // Import NgForm
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

  // Get references to the forms in the HTML
  @ViewChild('userForm') userForm!: NgForm;
  @ViewChild('professorForm') professorForm!: NgForm;

  user = new User();
  professor = new Professor();
  msg = '';
  agreementChecked: boolean = false;
  boxchecked: boolean = false;

  activeTab = signal<'user' | 'professor'>('user');

  constructor(
    private _registrationService: RegistrationService,
    private _professorService: ProfessorService,
    public _router: Router
  ) { }

  ngOnInit(): void {
    // Set default values for dropdowns
    (this.user as any).gender = "";
    (this.user as any).profession = "";
    (this.professor as any).gender = "";
  }

  // --- TAB SWITCHING METHODS (WITH FORM RESETS) ---

  switchToUserTab(): void {
    this.activeTab.set('user');
    this.msg = ''; // Clear any old error messages
    
    // Reset the professor object to clear the other form
    this.professor = new Professor();
    (this.professor as any).gender = ""; // Reset default
    
    // Reset the professor form's validation state
    if (this.professorForm) {
      this.professorForm.resetForm({ gender: "" }); // Reset with default
    }
  }

  switchToProfessorTab(): void {
    this.activeTab.set('professor');
    this.msg = ''; // Clear any old error messages
    
    // Reset the user object to clear the other form
    this.user = new User();
    (this.user as any).gender = ""; // Reset default
    (this.user as any).profession = ""; // Reset default

    // Reset the user form's validation state
    if (this.userForm) {
      this.userForm.resetForm({ gender: "", profession: "" }); // Reset with defaults
    }
  }

  // Helper methods for template
  isUserTabActive(): boolean {
    return this.activeTab() === 'user';
  }

  isProfessorTabActive(): boolean {
    return this.activeTab() === 'professor';
  }

  // --- REGISTRATION METHODS (WITH VALIDATION) ---

  registerUser(): void {
    this.msg = ''; // Clear any previous errors

    // 1. Check for password mismatch
    if (this.user.password !== this.user.confirmPassword) {
      this.msg = "Passwords do not match!";
      return; // Stop execution
    }

    // 2. Check if form is valid (including the checkbox)
    if (!this.userForm.valid) {
      this.msg = "Please fill all required fields and agree to the terms.";
      // This will trigger your @if messages in the HTML
      this.userForm.control.markAllAsTouched();
      return; // Stop execution
    }

    // If code reaches here, the form is valid and passwords match
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
    this.msg = ''; // Clear any previous errors

    // 1. Check for password mismatch
    if (this.professor.password !== this.professor.confirmPassword) {
      this.msg = "Passwords do not match!";
      return; // Stop execution
    }

    // 2. Check if form is valid (including the checkbox)
    if (!this.professorForm.valid) {
      this.msg = "Please fill all required fields and agree to the terms.";
      // This will trigger your @if messages in the HTML
      this.professorForm.control.markAllAsTouched();
      return; // Stop execution
    }

    // If code reaches here, the form is valid and passwords match
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