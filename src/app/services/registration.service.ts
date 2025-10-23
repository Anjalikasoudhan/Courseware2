import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 
import { Professor } from '../models/professor';
import { User } from '../models/user';

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private readonly http = inject(HttpClient);
  
  

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${NAV_URL}/registeruser`, user);
  }

  registerProfessor(professor: Professor): Observable<Professor> {
    return this.http.post<Professor>(`${NAV_URL}/registerprofessor`, professor);
  }
}
