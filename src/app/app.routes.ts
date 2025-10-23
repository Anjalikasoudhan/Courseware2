import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';
import { professorGuard } from './guards/professor-guard';
import { userGuard } from './guards/user-guard';

export const routes: Routes = [
  // Public routes
  { 
    path: '', 
    loadComponent: () => import('./components/welcomepage/welcomepage').then(c => c.Welcomepage) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login').then(c => c.Login) 
  },
  { 
    path: 'registration', 
    loadComponent: () => import('./components/registration/registration').then(c => c.Registration) 
  },
  { 
    path: 'registrationsuccess', 
    loadComponent: () => import('./components/registrationsuccess/registrationsuccess').then(c => c.Registrationsuccess) 
  },
  
  // Admin routes
  { 
    path: 'admindashboard', 
    loadComponent: () => import('./components/admindashboard/admindashboard').then(c => c.Admindashboard), 
    canActivate: [adminGuard] 
  },
  { 
    path: 'addProfessor', 
    loadComponent: () => import('./components/addprofessor/addprofessor').then(c => c.Addprofessor), 
    canActivate: [adminGuard] 
  },
  { 
    path: 'userlist', 
    loadComponent: () => import('./components/userlist/userlist').then(c => c.Userlist), 
    canActivate: [adminGuard] 
  },
  { 
    path: 'professorlist', 
    loadComponent: () => import('./components/professorlist/professorlist').then(c => c.Professorlist), 
    canActivate: [adminGuard] 
  },
  { 
    path: 'approveprofessor', 
    loadComponent: () => import('./components/approvalstatus/approvalstatus').then(c => c.Approvalstatus), 
    canActivate: [adminGuard] 
  },
  
  // User routes
  { 
    path: 'userdashboard', 
    loadComponent: () => import('./components/userdashboard/userdashboard').then(c => c.Userdashboard), 
    canActivate: [userGuard] 
  },
  { 
    path: 'edituserprofile', 
    loadComponent: () => import('./components/userprofile/userprofile').then(c => c.Userprofile), 
    canActivate: [userGuard] 
  },
  { 
    path: 'mycourses', 
    loadComponent: () => import('./components/mycourses/mycourses').then(c => c.Mycourses), 
    canActivate: [userGuard] 
  },
  { 
    path: 'mywishlist', 
    loadComponent: () => import('./components/mywishlist/mywishlist').then(c => c.Mywishlist), 
    canActivate: [userGuard] 
  },
  { 
    path: 'courselist', 
    loadComponent: () => import('./components/courselist/courselist').then(c => c.Courselist), 
    canActivate: [userGuard] 
  },
  { 
    path: 'fullcourse/:coursename', 
    loadComponent: () => import('./components/fullcourse/fullcourse').then(c => c.Fullcourse), 
    canActivate: [userGuard] 
  },
  
  // Professor routes
  { 
    path: 'professordashboard', 
    loadComponent: () => import('./components/professordashboard/professordashboard').then(c => c.Professordashboard), 
    canActivate: [professorGuard] 
  },
  { 
    path: 'editprofessorprofile', 
    loadComponent: () => import('./components/professorprofile/professorprofile').then(c => c.Professorprofile), 
    canActivate: [professorGuard] 
  },
  { 
    path: 'addcourse', 
    loadComponent: () => import('./components/addcourse/addcourse').then(c => c.Addcourse), 
    canActivate: [professorGuard] 
  },
  { 
    path: 'addchapter', 
    loadComponent: () => import('./components/addchapter/addchapter').then(c => c.Addchapter), 
    canActivate: [professorGuard] 
  },
  { 
    path: 'courselist', 
    loadComponent: () => import('./components/courselist/courselist').then(c => c.Courselist), 
    canActivate: [professorGuard] 
  },
  
  // Routes that require any authentication (authGuard)
  { 
    path: 'fullcourse/:coursename', 
    loadComponent: () => import('./components/fullcourse/fullcourse').then(c => c.Fullcourse), 
    canActivate: [authGuard] 
  },
  
  // Wildcard route
  { path: '**', redirectTo: '' }
];