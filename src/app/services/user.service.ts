import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { Course } from '../models/course';
import { Enrollment } from '../models/enrollment';
import { Wishlist } from '../models/wishlist';
import { User } from '../models/user';

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);

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
        // If response is an array, return the first element
        if (Array.isArray(response) && response.length > 0) {
          return response[0];
        }
        // If it's already a single object, return it
        return response;
      })
    );
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${NAV_URL}/updateuser`, user);
  }
}
