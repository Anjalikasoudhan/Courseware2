import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { Course } from '../models/course';
import { Enrollment } from '../models/enrollment';
import { Wishlist } from '../models/wishlist';
import { User } from '../models/user';
import { of } from 'rxjs';

const NAV_URL = environment.apiURL;

interface StatsResponse {
  count: number;
  success?: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

  // Dashboard statistics methods - updated endpoints
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

  // Your existing methods remain the same
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${NAV_URL}/userlist`);
  }

  getYoutubeCourseList(): Observable<Course[]> {
    return this.http.get<Course[]>(`${NAV_URL}/youtubecourselist`);
  }

  getWebsiteCourseList(): Observable<Course[]> {
    return this.http.get<Course[]>(`${NAV_URL}/websitecourselist`);
  }

  getCourseListByName(coursename: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${NAV_URL}/courselistbyname/${coursename}`);
  }

  enrollNewCourse(enrollment: Enrollment, loggedUser: string, currRole: string): Observable<Enrollment> {
    return this.http.post<Enrollment>(
      `${NAV_URL}/enrollnewcourse/${loggedUser}/${currRole}`,
      enrollment
    );
  }

  addToWishlist(wishlist: Wishlist): Observable<Wishlist> {
    return this.http.post<Wishlist>(`${NAV_URL}/addtowishlist`, wishlist);
  }

  getEnrollmentStatus(coursename: string, loggedUser: string, currRole: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${NAV_URL}/getenrollmentstatus/${coursename}/${loggedUser}/${currRole}`
    );
  }

  getEnrollmentByEmail(loggedUser: string, currRole: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(
      `${NAV_URL}/getenrollmentbyemail/${loggedUser}/${currRole}`
    );
  }

  getWishlistStatus(coursename: string, loggedUser: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${NAV_URL}/getwishliststatus/${coursename}/${loggedUser}`
    );
  }

  getWishlistByEmail(loggedUser: string): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${NAV_URL}/getwishlistbyemail/${loggedUser}`);
  }

  getAllWishlist(): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${NAV_URL}/getallwishlist`);
  }

  getChapterListByCourseName(coursename: string): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/getchapterlistbycoursename/${coursename}`);
  }

  getProfileDetails(loggedUser: string): Observable<User> {
    return this.http.get<any>(`${NAV_URL}/userprofileDetails/${loggedUser}`).pipe(
      map((response: any) => {
        if (Array.isArray(response) && response.length > 0) {
          return response[0];
        }
        return response;
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${NAV_URL}/updateuser`, user);
  }
}