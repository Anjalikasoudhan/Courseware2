import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, Footer],
  templateUrl: './userprofile.html',
  styleUrls: ['./userprofile.css']
})
export class Userprofile implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  user: User = new User();
  confirmPassword: string = '';
  msg = '';
  loggedUser = '';
  currRole = '';
  profileView: boolean = true;
  profileUpdated: boolean = false;

  ngOnInit(): void {
   this.loggedUser = sessionStorage.getItem('USER') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';

    console.log('UserProfile Component Initialized');
    console.log('Logged User:', this.loggedUser);
    console.log('Current Role:', this.currRole);

    if (!this.loggedUser) {
      this.msg = 'Please login first';
      console.error('No user found in session storage');
      return;
    }

    this.loadProfile();
  }

  loadProfile(): void {
    console.log('Loading profile for:', this.loggedUser);
    
    this.userService.getProfileDetails(this.loggedUser).subscribe({
      next: (data: any) => {
        console.log('Profile data received:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          this.user = { ...data[0] };
          console.log('User data set from array:', this.user);
        } else if (data && typeof data === 'object') {
          this.user = { ...data };
          console.log('User data set from object:', this.user);
        } else {
          this.msg = 'Invalid profile data received';
          console.error('Invalid data format:', data);
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.msg = 'Error loading profile: ' + (error?.message || 'Unknown error');
        
        // Clear error after 5 seconds
        setTimeout(() => {
          this.msg = '';
        }, 5000);
      }
    });
  }

  editProfile(): void {
    console.log('Editing profile');
    this.profileView = false;
    this.profileUpdated = false;
    this.msg = '';
  }

  cancelEdit(): void {
    console.log('Canceling edit');
    this.profileView = true;
    this.profileUpdated = false;
    this.msg = '';
    // Reload original data
    this.loadProfile();
  }

  updateUserProfile(form: NgForm): void {
    console.log('Updating profile with data:', this.user);
    
    if (!form.valid) {
      this.msg = "Please fill all required fields correctly";
      console.log('Form invalid');
      return;
    }

    if (this.confirmPassword !== this.user.password) {
      this.msg = "Passwords do not match";
      console.log('Password mismatch');
      return;
    }

    this.userService.updateUser(this.user).subscribe({
      next: (data: any) => {
        console.log('Profile update successful:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          this.user = { ...data[0] };
        } else if (data) {
          this.user = { ...data };
        }

        this.profileView = true;
        this.profileUpdated = true;
        this.msg = "Profile Updated Successfully !!!";

        setTimeout(() => {
          this.msg = '';
          this.router.navigate(['/userdashboard']);
        }, 3000);
      },
      error: (error) => {
        console.error('Profile update failed:', error);
        this.msg = 'Profile Update Failed !!!' + (error?.error?.message ? ' - ' + error.error.message : '');
        
        setTimeout(() => {
          this.msg = '';
        }, 5000);
      }
    });
  }
}