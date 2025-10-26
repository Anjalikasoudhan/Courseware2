
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const multiRoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const loginService = inject(LoginService);

    console.log('🛡️ MultiRole Guard checking for roles:', allowedRoles);
    
    const currentRole = sessionStorage.getItem('ROLE');
    const currentUser = sessionStorage.getItem('USER');

    console.log('Current user:', currentUser, 'Role:', currentRole);

    if (!currentUser || !currentRole) {
      console.log('❌ No user logged in');
      router.navigate(['/login']);
      return false;
    }

    // Admin has access to everything
    if (currentRole === 'ADMIN') {
      console.log('✅ Admin access granted');
      return true;
    }

    // Check if current role is in allowed roles
    if (allowedRoles.includes(currentRole)) {
      console.log(`✅ ${currentRole} access granted`);
      return true;
    }

    console.log(`❌ Access denied. ${currentRole} not in allowed roles:`, allowedRoles);
    router.navigate(['/login']);
    return false;
  };
};