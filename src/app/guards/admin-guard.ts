import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);

  console.log('🛡️ Admin Guard triggered for route:', route.url);
  console.log('Current sessionStorage:', {
    USER: sessionStorage.getItem('USER'),
    ROLE: sessionStorage.getItem('ROLE'),
    TOKEN: sessionStorage.getItem('TOKEN')
  });

  const isAdmin = loginService.isAdminLoggedIn();
  
  if (isAdmin) {
    console.log('✅ Admin Guard: Access granted');
    return true;
  } else {
    console.log('❌ Admin Guard: Access denied - redirecting to login');
    router.navigate(['login']);
    return false;
  }
};