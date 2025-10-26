import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { Chapter } from '../models/chapter';
import { Course } from '../models/course';
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
export class ProfessorService {
  private readonly http = inject(HttpClient);

  // Add dashboard statistics methods
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

  // Your existing methods
  acceptRequestForProfessorApproval(currentEmail: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${NAV_URL}/acceptstatus/${currentEmail}`);
  }

  rejectRequestForProfessorApproval(currentEmail: string): Observable<{ status: string }> {
    return this.http.get<{ status: string }>(`${NAV_URL}/rejectstatus/${currentEmail}`);
  }

  getProfessorList(): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${NAV_URL}/professorlist`);
  }

  getYoutubeCourseList(): Observable<Course[]> {
    return this.http.get<Course[]>(`${NAV_URL}/youtubecourselist`);
  }

  getWebsiteCourseList(): Observable<Course[]> {
    return this.http.get<Course[]>(`${NAV_URL}/websitecourselist`);
  }

  getCourseListByName(courseName: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${NAV_URL}/courselistbyname/${courseName}`);
  }

  addCourse(course: Course): Observable<Course> {
    console.log('Adding course:', course);
    return this.http.post<Course>(`${NAV_URL}/addcourse`, course);
  }

  getProfessorListByEmail(email: string): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${NAV_URL}/professorlistbyemail/${email}`);
  }

  addNewChapters(chapter: Chapter): Observable<Chapter> {
    return this.http.post<Chapter>(`${NAV_URL}/addnewchapter`, chapter);
  }

  getProfileDetails(loggedUser: string): Observable<Professor[]> {
    return this.http.get<Professor[]>(`${NAV_URL}/professorprofileDetails/${loggedUser}`);
  }

  updateUserProfile(professor: Professor): Observable<Professor> {
    return this.http.put<Professor>(`${NAV_URL}/updateprofessor`, professor);
  }

  getCourseListNames(): Observable<string[]> {
    return this.http.get<string[]>(`${NAV_URL}/getcoursenames/`);
  }
}