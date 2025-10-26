import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Professor } from '../../models/professor';
import { ProfessorService } from '../../services/professor.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-professorprofile',
  imports:[Header,Footer,CommonModule,FormsModule],
  templateUrl: './professorprofile.html',
  styleUrls: ['./professorprofile.css'],
  standalone: true
})
export class Professorprofile implements OnInit {
 
  private _service = inject(ProfessorService);
  private activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  profileDetails = signal<Professor[]>([]);
  professor: Professor = new Professor();
  msg = '';
  currRole = '';
  loggedUser = '';
  temp = false;
  confirmPassword = '';

  ngOnInit(): void {
    this.loggedUser = sessionStorage.getItem('USER') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';

    // Show profile card, hide form initially
    this.showProfileCard();
    this.getProfileDetails(this.loggedUser);
  }

  editProfile() {
    // First load the current profile data into the form
    this.loadCurrentProfileData();
    this.showProfileForm();
  }

 getProfileDetails(loggedUser: string) {
    this._service.getProfileDetails(this.loggedUser).subscribe({
      next: (professors: Professor[]) => { // <-- FIX 1: Expect an array
        this.profileDetails.set(professors); // <-- FIX 2: Set the array directly
        console.log('Profile details:', this.profileDetails());
      },
      error: (error: any) => {
        console.error('Error fetching profile details:', error);
      }
    });
}

  loadCurrentProfileData() {
    const professors = this.profileDetails();
    if (professors && professors.length > 0) {
      // Copy the current profile data to the form
      this.professor = { ...professors[0] };
      this.confirmPassword = this.professor.password || '';
    }
  }

  updateProfessorProfile() {
    // Validate passwords match
    if (this.professor.password !== this.confirmPassword) {
      this.msg = "Passwords do not match!";
      return;
    }

    console.log('Updating professor:', this.professor);
    
    // Fixed method name - use updateUserProfile instead of UpdateUserProfile
    this._service.updateUserProfile(this.professor).subscribe({
      next: (data: Professor) => {
        console.log("Professor Profile Updated successfully", data);
        this.msg = "Profile Updated Successfully !!!";
        this.temp = true;
        
        // Show success message and redirect
        this.showProfileCard();
        
        // Refresh the profile data
        this.getProfileDetails(this.loggedUser);
        
        setTimeout(() => {
          this._router.navigate(['/professordashboard']);
        }, 3000);
      },
      error: (error: any) => {
        console.log("Profile Update Failed");
        console.log("Error details:", error);
        this.msg = "Profile Update Failed !!! " + (error.error?.message || '');
        this.temp = false;
      }
    });
  }

  cancelEdit() {
    this.showProfileCard();
    this.msg = '';
  }

  private showProfileCard(): void {
    // Using DOM manipulation to show/hide elements
    const profileCard = document.getElementById('profilecard');
    const profileForm = document.getElementById('profileform');
    
    if (profileCard) profileCard.style.display = 'block';
    if (profileForm) profileForm.style.display = 'none';
  }

  private showProfileForm(): void {
    // Using DOM manipulation to show/hide elements
    const profileCard = document.getElementById('profilecard');
    const profileForm = document.getElementById('profileform');
    
    if (profileCard) profileCard.style.display = 'none';
    if (profileForm) profileForm.style.display = 'block';
  }
}