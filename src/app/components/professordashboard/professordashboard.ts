import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfessorService } from '../../services/professor.service'; // Or UserService if you're using the same
import { toSignal } from '@angular/core/rxjs-interop';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';

interface StatsResponse {
  count: number;
}

@Component({
  selector: 'app-professordashboard',
  standalone: true,
  imports: [
    CommonModule,
    Header,
    Footer
  ],
  templateUrl: './professordashboard.html',
  styleUrls: ['./professordashboard.css']
})
export class Professordashboard implements OnInit {

  name = '';
  loggedUser = '';
  currRole = '';

  private _service = inject(ProfessorService); // Or UserService
  private _router = inject(Router);

  private defaultStats: StatsResponse = { count: 0 };

  // Signals for dashboard data
  professors = toSignal(this._service.getTotalProfessors(), { initialValue: this.defaultStats });
  users = toSignal(this._service.getTotalUsers(), { initialValue: this.defaultStats });
  courses = toSignal(this._service.getTotalCourses(), { initialValue: this.defaultStats });
  enrollments = toSignal(this._service.getTotalEnrollments(), { initialValue: this.defaultStats });
  enrollmentcount = toSignal(this._service.getTotalEnrollmentCount(), { initialValue: this.defaultStats });
  wishlist = toSignal(this._service.getTotalWishlist(), { initialValue: this.defaultStats });
  chapters = toSignal(this._service.getTotalChapters(), { initialValue: this.defaultStats });

  ngOnInit(): void {
    this.name = sessionStorage.getItem('USER') || '';
    this.loggedUser = sessionStorage.getItem('USER') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';
  }

  // Navigation method
  navigateTo(route: string): void {
    this._router.navigate([route]);
  }

  // Helper methods to safely get counts
  getUsersCount(): number {
    return this.users().count || 0;
  }

  getProfessorsCount(): number {
    return this.professors().count || 0;
  }

  getCoursesCount(): number {
    return this.courses().count || 0;
  }

  getEnrollmentsCount(): number {
    return this.enrollments().count || 0;
  }

  getEnrollmentCount(): number {
    return this.enrollmentcount().count || 0;
  }

  getWishlistCount(): number {
    return this.wishlist().count || 0;
  }

  getChaptersCount(): number {
    return this.chapters().count || 0;
  }
}