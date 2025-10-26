import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { Professor } from '../models/professor';

const NAV_URL = environment.apiURL;

interface StatsResponse {
  count: number;
  success?: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);

  public addProfessor(professor: Professor): Observable<Professor> {
    return this.http.post<Professor>(`${NAV_URL}/addProfessor`, professor);
  }

  // Updated to use the new dashboard endpoints
  getTotalProfessors(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/api/dashboard/totalprofessors`).pipe(
      catchError(error => {
        console.error('Error fetching professors:', error);
        return of({ count: 0, success: false });
      })
    );
  }

  getTotalUsers(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/api/dashboard/totalusers`).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return of({ count: 0, success: false });
      })
    );
  }

  getTotalCourses(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/api/dashboard/totalcourses`).pipe(
      catchError(error => {
        console.error('Error fetching courses:', error);
        return of({ count: 0, success: false });
      })
    );
  }

  getTotalWishlist(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/api/dashboard/totalwishlist`).pipe(
      catchError(error => {
        console.error('Error fetching wishlist:', error);
        return of({ count: 0, success: false });
      })
    );
  }

  getTotalEnrollments(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/api/dashboard/totalenrollments`).pipe(
      catchError(error => {
        console.error('Error fetching enrollments:', error);
        return of({ count: 0, success: false });
      })
    );
  }

  getTotalEnrollmentCount(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/api/dashboard/totalenrollmentcount`).pipe(
      catchError(error => {
        console.error('Error fetching enrollment count:', error);
        return of({ count: 0, success: false });
      })
    );
  }

  getTotalChapters(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/api/dashboard/totalchapters`).pipe(
      catchError(error => {
        console.error('Error fetching chapters:', error);
        return of({ count: 0, success: false });
      })
    );
  }
}