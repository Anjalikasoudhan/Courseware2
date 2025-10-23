import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service'; // Adjust path if needed

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  private _router = inject(Router);
  private loginService = inject(LoginService);

  // Read signals from the service
  loggedUser = this.loginService.loggedUser;
  currRole = this.loginService.currRole;

  title = computed(() => {
    if (this.loggedUser() === "admin@gmail.com") {
      return "Admin Dashboard";
    } else if (this.currRole() === "PROFESSOR") { // Use uppercase
      return "Professor Dashboard";
    } else if (this.currRole() === "USER") { // Use uppercase
      return "User Dashboard";
    }
    return ''; 
  });

  logout() {
    this.loginService.logout();
  }

  // --- ADD THIS METHOD BACK ---
  navigateHome() {
    // Read the signal values to determine navigation
    // Note: We check for uppercase roles to match the LoginService
    if (this.loggedUser() === "admin@gmail.com") {
      this._router.navigate(['/admindashboard']);
    } else if (this.currRole() === "PROFESSOR") {
      this._router.navigate(['/professordashboard']);
    } else if (this.currRole() === "USER") {
      this._router.navigate(['/userdashboard']);
    }
  }
  // --------------------------
  
}