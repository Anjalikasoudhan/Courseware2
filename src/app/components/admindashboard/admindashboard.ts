import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

interface StatsResponse {
  count: number;
}

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [
    Header,
    Footer,
  ],
  templateUrl: './admindashboard.html',
  styleUrls: ['./admindashboard.css']
})
export class Admindashboard implements OnInit {

  name = 'admin';
  gender = '';
  loggedUser = '';
  currRole = '';

  private _service = inject(AdminService);
  private _router = inject(Router);

  private defaultStats: StatsResponse = { count: 0 };

  professors = toSignal(this._service.getTotalProfessors(), { initialValue: this.defaultStats });
  users = toSignal(this._service.getTotalUsers(), { initialValue: this.defaultStats });
  courses = toSignal(this._service.getTotalCourses(), { initialValue: this.defaultStats });
  enrollments = toSignal(this._service.getTotalEnrollments(), { initialValue: this.defaultStats });
  enrollmentcount = toSignal(this._service.getTotalEnrollmentCount(), { initialValue: this.defaultStats });
  wishlist = toSignal(this._service.getTotalWishlist(), { initialValue: this.defaultStats });
  chapters = toSignal(this._service.getTotalChapters(), { initialValue: this.defaultStats });

  constructor() { }

  ngOnInit(): void {
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    const role = sessionStorage.getItem('ROLE');
    const user = sessionStorage.getItem('USER');
    
    console.log('🏠 Admindashboard OnInit - Authentication Check:');
    console.log('ROLE:', role);
    console.log('USER:', user);
    console.log('All sessionStorage:', {
      USER: sessionStorage.getItem('USER'),
      ROLE: sessionStorage.getItem('ROLE'),
      TOKEN: sessionStorage.getItem('TOKEN'),
      gender: sessionStorage.getItem('gender')
    });

    if (!role || !user || role !== 'ADMIN') {
      console.error('❌ Admindashboard: Authentication failed or user is not ADMIN');
      this._router.navigate(['/login']);
      return;
    }

    this.name = user;
    this.loggedUser = user;
    this.currRole = role;
    this.gender = sessionStorage.getItem('gender') || '';

    console.log('✅ Admindashboard: Authentication successful');
  }

  navigateTo(route: string): void {
    console.log('🧭 Navigation attempt to:', route);
    console.log('Current auth status:', {
      USER: sessionStorage.getItem('USER'),
      ROLE: sessionStorage.getItem('ROLE')
    });

    const role = sessionStorage.getItem('ROLE');
    const user = sessionStorage.getItem('USER');
    
    if (!role || !user) {
      console.error('❌ Navigation: No authentication data');
      alert('Session expired. Please login again.');
      this._router.navigate(['/login']);
      return;
    }

    if (role !== 'ADMIN') {
      console.error('❌ Navigation: User is not ADMIN. Role:', role);
      alert('Admin access required.');
      this._router.navigate(['/login']);
      return;
    }

    console.log('✅ Navigation: Proceeding to', route);
    this._router.navigate([route]);
  }

  // Helper methods to safely get counts
  getUsersCount(): number {
    return this.users().count;
  }

  getProfessorsCount(): number {
    return this.professors().count;
  }

  getCoursesCount(): number {
    return this.courses().count;
  }

  getEnrollmentsCount(): number {
    return this.enrollments().count;
  }

  getEnrollmentCount(): number {
    return this.enrollmentcount().count;
  }

  getWishlistCount(): number {
    return this.wishlist().count;
  }

  getChaptersCount(): number {
    return this.chapters().count;
  }
}