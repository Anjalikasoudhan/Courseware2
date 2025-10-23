import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Chapter } from '../models/chapter';
import { Course } from '../models/course';
import { Professor } from '../models/professor';

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private readonly http = inject(HttpClient);

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

  getProfileDetails(loggedUser: string): Observable<Professor> {
    return this.http.get<Professor>(`${NAV_URL}/professorprofileDetails/${loggedUser}`);
  }

  updateUserProfile(professor: Professor): Observable<Professor> {
    return this.http.put<Professor>(`${NAV_URL}/updateprofessor`, professor);
  }

  getCourseListNames(): Observable<string[]> {
    return this.http.get<string[]>(`${NAV_URL}/getcoursenames/`);
  }
}