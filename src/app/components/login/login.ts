import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Professor } from '../../models/professor';
import { User } from '../../models/user';
import { LoginService } from '../../services/login.service';

// This interface should match the one in your service
interface LoginResponse {
  token: string;
  message: string;
  success: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login implements OnInit {

  user = new User();
  professor = new Professor();
  msg = "";
  adminEmail = "";
  adminPassword = "";
  
  // Signal to track active tab
  activeTab = signal<'user' | 'professor' | 'admin'>('user');

  constructor(private _service: LoginService, private _router: Router) { }

  ngOnInit(): void { }

  // Tab switching methods
  switchToUserTab(): void {
    this.activeTab.set('user');
    this.msg = ""; // Clear error message on tab switch
  }

  switchToProfessorTab(): void {
    this.activeTab.set('professor');
    this.msg = ""; // Clear error message on tab switch
  }

  switchToAdminTab(): void {
    this.activeTab.set('admin');
    this.msg = ""; // Clear error message on tab switch
  }

  // Helper methods for template
  isUserTabActive(): boolean {
    return this.activeTab() === 'user';
  }

  isProfessorTabActive(): boolean {
    return this.activeTab() === 'professor';
  }

  isAdminTabActive(): boolean {
    return this.activeTab() === 'admin';
  }

  // Tab button styling methods (Unchanged from your code)
  getUserTabStyles(): any {
    const isActive = this.isUserTabActive();
    const isProfessorActive = this.isProfessorTabActive();
    
    return {
      'border': isActive ? '0' : '',
      'border-bottom': !isActive ? '1.5px solid rgb(6, 50, 53)' : '',
      'border-right': !isActive && isProfessorActive ? '1.5px solid rgb(6, 50, 53)' : '',
      'opacity': isActive ? '1' : '0.3'
    };
  }

  getProfessorTabStyles(): any {
    const isActive = this.isProfessorTabActive();
    const isUserActive = this.isUserTabActive();
    const isAdminActive = this.isAdminTabActive();
    
    return {
      'border': isActive ? '0' : '',
      'border-bottom': !isActive ? '1.5px solid rgb(6, 50, 53)' : '',
      'border-left': !isActive && isUserActive ? '1.5px solid rgb(6, 50, 53)' : '',
      'border-right': !isActive && isAdminActive ? '1.5px solid rgb(6, 50, 53)' : '',
      'opacity': isActive ? '1' : '0.3'
    };
  }

  getAdminTabStyles(): any {
    const isActive = this.isAdminTabActive();
    const isProfessorActive = this.isProfessorTabActive();
    
    return {
      'border': isActive ? '0' : '',
      'border-bottom': !isActive ? '1.5px solid rgb(6, 50, 53)' : '',
      'border-left': !isActive && isProfessorActive ? '1.5px solid rgb(6, 50, 53)' : '',
      'opacity': isActive ? '1' : '0.3'
    };
  }

  // Login Methods
  loginUser(): void {
    this.msg = ""; // Clear previous error
    this._service.loginUserFromRemote(this.user).subscribe({
      next: (data: LoginResponse) => {
        // Service now handles session storage via 'tap'
        console.log(data.message);
        this._router.navigate(['/userdashboard']);
      },
      error: (error: { error: any; }) => {
        console.log(error.error);
        this.msg = "Bad credentials, please enter valid credentials !!!";
      }
    });
  }

  loginProfessor(): void {
    this.msg = ""; // Clear previous error
    this._service.loginProfessorFromRemote(this.professor).subscribe({
      next: (data: LoginResponse) => {
        // Service now handles session storage via 'tap'
        console.log(data.message);
        this._router.navigate(['/professordashboard']);
      },
      error: (error: { error: any; }) => {
        console.log(error.error);
        this.msg = "Bad credentials, please enter valid credentials !!!";
      }
    });
  }

  // *** THIS IS THE CORRECTED FUNCTION ***
  adminLogin(): void {
    this.msg = ""; // Clear previous error
    
    // Call the synchronous function from your service
    const loginSuccess = this._service.adminLoginFromRemote(this.adminEmail, this.adminPassword);

    // Check the boolean result (NO .subscribe())
    if (loginSuccess) {
      console.log("Admin login successful");
      // Your service already set the session storage
      this._router.navigate(['/admindashboard']);
    } else {
      // This 'else' block runs if the login fails
      console.log("Admin login failed");
      this.msg = 'Bad admin credentials !!!';
    }
  }
}