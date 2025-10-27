import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
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

  // Dashboard methods
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
    return this.http.get<string[]>(
      `${NAV_URL}/getenrollmentstatus/${coursename}/${loggedUser}/${currRole}`
    ).pipe(
      map(response => response.includes('enrolled'))
    );
  }

  // ⬇️⬇️ FIXED METHOD WITH BETTER ERROR HANDLING ⬇️⬇️

getEnrollmentByEmail(loggedUser: string, currRole: string): Observable<Enrollment[]> {
  console.log('📧 Frontend: getEnrollmentByEmail called with:', { loggedUser, currRole });
  
  if (!loggedUser || loggedUser === '{}' || !currRole || currRole === '{}') {
    console.error('❌ Frontend: Invalid parameters for getEnrollmentByEmail');
    return of([]);
  }
  
  const url = `${NAV_URL}/getenrollmentbyemail/${loggedUser}/${currRole}`;
  console.log('🌐 Frontend: Making API call to:', url);
  
  return this.http.get<Enrollment[]>(url).pipe(
    tap(enrollments => {
      console.log('✅ Frontend: Enrollments received from API:', enrollments);
      console.log('📊 Frontend: Number of enrollments:', enrollments?.length);
      
      if (enrollments && enrollments.length > 0) {
        enrollments.forEach((enrollment, index) => {
          console.log(`📝 Frontend: Enrollment ${index + 1}:`, {
            course: enrollment.coursename,
            username: enrollment.enrolledusername,
            date: enrollment.enrolleddate
          });
        });
      } else {
        console.log('ℹ️ Frontend: No enrollments found for user');
      }
    }),
    catchError(error => {
      console.error('❌ Frontend: Error fetching enrollments:', error);
      console.error('🔧 Frontend: Error details:', {
        status: error.status,
        message: error.message,
        url: error.url,
        error: error.error
      });
      return of([]);
    })
  );
}

removeFromWishlist(email: string, courseId: string): Observable<any> {
  console.log('Frontend: Removing from wishlist:', { email, courseId });
  return this.http.delete(`${NAV_URL}/removefromwishlist`, {
    body: {
      useremail: email,
      courseid: courseId
    }
  }).pipe(
    tap(response => console.log('Frontend: Remove wishlist response:', response)),
    catchError(error => {
      console.error('Frontend: Error removing from wishlist:', error);
      throw error;
    })
  );
}
  getWishlistStatus(coursename: string, loggedUser: string): Observable<boolean> {
    return this.http.get<string[]>(
      `${NAV_URL}/getwishliststatus/${coursename}/${loggedUser}`
    ).pipe(
      map(response => response.includes('liked'))
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