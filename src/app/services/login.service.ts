import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment'; 
import { Professor } from '../models/professor';
import { User } from '../models/user';
import { Router } from '@angular/router';

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
  private readonly router = inject(Router);

  public loggedUser = signal(this.storage.getItem('USER') || '');
  public currRole = signal(this.storage.getItem('ROLE') || '');

  public loginUserFromRemote(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${NAV_URL}/loginuser`, user).pipe(
      tap((data: LoginResponse) => {
        this.setSessionStorage('USER', user.email);
        this.setSessionStorage('ROLE', 'USER');
        this.setSessionStorage('TOKEN', `Bearer ${data.token}`);

        this.loggedUser.set(user.email);
        this.currRole.set('USER');
        
        console.log('✅ User logged in:', user.email);
      })
    );
  }

  public loginProfessorFromRemote(professor: Professor): Observable<LoginResponse> {
    console.log('Professor login attempt:', professor);
    return this.http.post<LoginResponse>(`${NAV_URL}/loginprofessor`, professor).pipe(
      tap((data: LoginResponse) => {
        this.setSessionStorage('USER', professor.email);
        this.setSessionStorage('ROLE', 'PROFESSOR');
        this.setSessionStorage('TOKEN', `Bearer ${data.token}`);

        this.loggedUser.set(professor.email);
        this.currRole.set('PROFESSOR');
        
        console.log('✅ Professor logged in:', professor.email);
      })
    );
  }

  public adminLoginFromRemote(email: string, password: string): boolean {
    const isAdmin = email === 'admin@gmail.com' && password === 'admin123';
    
    console.log('🔐 Admin login attempt:', { email, password, isAdmin });
    
    if (isAdmin) {
      this.setSessionStorage('USER', email);
      this.setSessionStorage('ROLE', 'ADMIN');
      this.setSessionStorage('TOKEN', 'admin-token');
      this.setSessionStorage('gender', 'Male'); // Add this line

      this.loggedUser.set(email);
      this.currRole.set('ADMIN');
      
      console.log('✅ Admin logged in successfully');
      console.log('Session Storage after admin login:', {
        USER: sessionStorage.getItem('USER'),
        ROLE: sessionStorage.getItem('ROLE'),
        TOKEN: sessionStorage.getItem('TOKEN'),
        gender: sessionStorage.getItem('gender')
      });
    } else {
      console.log('❌ Admin login failed');
    }
    
    return isAdmin;
  }

  // ADD DEBUG LOGGING TO THESE METHODS:
  isUserLoggedIn(): boolean {
    const result = this.isRoleLoggedIn('USER');
    console.log('🔍 isUserLoggedIn check:', result);
    return result;
  }

  isProfessorLoggedIn(): boolean {
    const result = this.isRoleLoggedIn('PROFESSOR');
    console.log('🔍 isProfessorLoggedIn check:', result);
    return result;
  }

  isAdminLoggedIn(): boolean {
    const result = this.isRoleLoggedIn('ADMIN');
    console.log('🔍 isAdminLoggedIn check:', result, {
      user: this.storage.getItem('USER'),
      role: this.storage.getItem('ROLE')
    });
    return result;
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

  logout(): void {
    console.log('🚪 Logging out user...');
    this.storage.removeItem('USER');
    this.storage.removeItem('ROLE');
    this.storage.removeItem('TOKEN');
    this.storage.removeItem('gender');

    this.loggedUser.set('');
    this.currRole.set('');

    this.router.navigate(['/login']);
  }

  private isRoleLoggedIn(role: string): boolean {
    const user = this.storage.getItem('USER');
    const userRole = this.storage.getItem('ROLE');
    
    const isLoggedIn = !!(user && userRole === role);
    
    console.log(`🔐 Role check for ${role}:`, {
      user,
      userRole,
      expectedRole: role,
      isLoggedIn
    });
    
    return isLoggedIn;
  }

  private setSessionStorage(key: string, value: string): void {
    console.log(`💾 Setting sessionStorage: ${key} = ${value}`);
    this.storage.setItem(key, value);
  }
}