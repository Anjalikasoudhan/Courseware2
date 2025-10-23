import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Professor } from '../models/professor';

const NAV_URL = environment.apiURL;

interface StatsResponse {
  count: number;
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

  getTotalProfessors(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/gettotalprofessors`);
  }

  getTotalUsers(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/gettotalusers`);
  }

  getTotalCourses(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/gettotalcourses`);
  }

  getTotalWishlist(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/gettotalwishlist`);
  }

  getTotalEnrollments(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/gettotalenrollments`);
  }

  getTotalEnrollmentCount(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/gettotalenrollmentcount`);
  }

  getTotalChapters(): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${NAV_URL}/gettotalchapters`);
  }
}