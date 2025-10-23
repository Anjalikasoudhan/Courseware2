import { Component, OnInit, inject } from '@angular/core'; // 1. Import 'inject'
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service'; // 2. Use correct relative path
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
     Footer
  ],
  templateUrl: './admindashboard.html',
  styleUrls: ['./admindashboard.css']
})
export class Admindashboard implements OnInit {

  // Properties for user info
  name = 'admin';
  gender = '';
  loggedUser = '';
  currRole = '';

  // 4. Use inject() to get the service.
  // This ensures '_service' is available *before* the constructor.
  private _service = inject(AdminService);

  // 5. Define a default initial value that matches 'StatsResponse'
  private defaultStats: StatsResponse = { count: 0 };

  // 6. Use the service and the correct 'initialValue'
  // 'this._service' is now available, and the initialValue type is correct.
  professors = toSignal(this._service.getTotalProfessors(), { initialValue: this.defaultStats });
  users = toSignal(this._service.getTotalUsers(), { initialValue: this.defaultStats });
  courses = toSignal(this._service.getTotalCourses(), { initialValue: this.defaultStats });
  enrollments = toSignal(this._service.getTotalEnrollments(), { initialValue: this.defaultStats });
  enrollmentcount = toSignal(this._service.getTotalEnrollmentCount(), { initialValue: this.defaultStats });
  wishlist = toSignal(this._service.getTotalWishlist(), { initialValue: this.defaultStats });
  chapters = toSignal(this._service.getTotalChapters(), { initialValue: this.defaultStats });

  // 7. Constructor is no longer needed for service injection
  constructor() { }

  ngOnInit(): void {
    // This logic is correct and stays here
    this.name = sessionStorage.getItem('ROLE') || 'admin';
    this.gender = sessionStorage.getItem('gender') || '';
    this.loggedUser = sessionStorage.getItem('loggedUser') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';
  }

}