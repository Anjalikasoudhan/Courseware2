import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core'; // <-- ADDED signal
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { Professor } from '../models/professor';
import { User } from '../models/user';
import { Router } from '@angular/router'; // <-- ADDED Router

const NAV_URL = environment.apiURL;

interface LoginResponse {
  token: string;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly storage = sessionStorage;
  private readonly router = inject(Router); // <-- ADDED

  // --- SIGNALS ---
  // These signals read the initial state from storage, in case of a page refresh
  public loggedUser = signal(this.storage.getItem('USER') || ''); // <-- ADDED
  public currRole = signal(this.storage.getItem('ROLE') || ''); // <-- ADDED
  // ---

  public loginUserFromRemote(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${NAV_URL}/loginuser`, user).pipe(
      tap((data: LoginResponse) => {
        // Set storage
        this.setSessionStorage('USER', user.email);
        this.setSessionStorage('ROLE', 'USER');
        this.setSessionStorage('TOKEN', `Bearer ${data.token}`);

        // Set signals
        this.loggedUser.set(user.email); // <-- ADDED
        this.currRole.set('USER'); // <-- ADDED
      })
    );
  }

  public loginProfessorFromRemote(professor: Professor): Observable<LoginResponse> {
    console.log('Professor login attempt:', professor);
    return this.http.post<LoginResponse>(`${NAV_URL}/loginprofessor`, professor).pipe(
      tap((data: LoginResponse) => {
        // Set storage
        this.setSessionStorage('USER', professor.email);
        this.setSessionStorage('ROLE', 'PROFESSOR');
        this.setSessionStorage('TOKEN', `Bearer ${data.token}`);

        // Set signals
        this.loggedUser.set(professor.email); // <-- ADDED
        this.currRole.set('PROFESSOR'); // <-- ADDED
      })
    );
  }

  public adminLoginFromRemote(email: string, password: string): boolean {
    const isAdmin = email === 'admin@gmail.com' && password === 'admin123';
    
    if (isAdmin) {
      // Set storage
      this.setSessionStorage('USER', email);
      this.setSessionStorage('ROLE', 'ADMIN');
      this.setSessionStorage('TOKEN', 'admin-token');

      // Set signals
      this.loggedUser.set(email); // <-- ADDED
      this.currRole.set('ADMIN'); // <-- ADDED
    }
    
    return isAdmin;
  }

  // ... (isUserLoggedIn, isProfessorLoggedIn, etc. are all perfectly fine) ...
  isUserLoggedIn(): boolean {
    return this.isRoleLoggedIn('USER');
  }

  isProfessorLoggedIn(): boolean {
    return this.isRoleLoggedIn('PROFESSOR');
  }

  isAdminLoggedIn(): boolean {
    return this.isRoleLoggedIn('ADMIN');
  }

  getAuthenticatedToken(): string | null {
    return this.storage.getItem('TOKEN');
  }

  getAuthenticatedUser(): string | null {
    return this.storage.getItem('USER');
  }

  getUserType(): string | null {
    return this.storage.getItem('ROLE');
  }
  // ...

  logout(): void {
    // Clear storage
    this.storage.removeItem('USER');
    this.storage.removeItem('ROLE');
    this.storage.removeItem('TOKEN');

    // Clear signals
    this.loggedUser.set(''); // <-- ADDED
    this.currRole.set(''); // <-- ADDED

    // Navigate to login
    this.router.navigate(['/login']); // <-- ADDED
  }

  private isRoleLoggedIn(role: string): boolean {
    const user = this.storage.getItem('USER');
    const userRole = this.storage.getItem('ROLE');
    
    return !!(user && userRole === role);
  }

  private setSessionStorage(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
}