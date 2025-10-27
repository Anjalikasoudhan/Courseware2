import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Enrollment } from '../../models/enrollment';
import { UserService } from '../../services/user.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mycourses',
  standalone: true,
  imports: [Header, Footer, CommonModule, FormsModule, CarouselModule],
  templateUrl: './mycourses.html',
  styleUrls: ['./mycourses.css']
})
export class Mycourses implements OnInit, OnDestroy {
  myenrollments$: Observable<Enrollment[]> = of([]);
  enrollments: Enrollment[] = []; // Add this to store the data directly
  isLoading = true;
  errorMessage = '';
  private subscription: Subscription = new Subscription();
  loggedUser = '';
  currRole = '';

  // Simplified Owl Carousel Options
  owlOptions: OwlOptions = {
    loop: false, // Changed to false to avoid duplication
    mouseDrag: true,
    touchDrag: true,
    margin: 20,
    stagePadding: 10,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: false, // Disable autoplay for debugging
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 2 },
      992: { items: 3 },
      1200: { items: 3 }
    },
    nav: true
  };

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    console.log('🎯 Mycourses Component Initialized');
    this.initializeUserData();
    this.loadEnrollments();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeUserData(): void {
    this.loggedUser = sessionStorage.getItem('loggedUser')?.replace(/"/g, '') || 
                     sessionStorage.getItem('USER')?.replace(/"/g, '') || '';
    this.currRole = sessionStorage.getItem('ROLE')?.replace(/"/g, '') || '';
    
    console.log('👤 User Data:', {
      loggedUser: this.loggedUser,
      currRole: this.currRole
    });
  }

  loadEnrollments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('📚 Loading enrollments...');

    if (this.isValidUser(this.loggedUser) && this.isValidUser(this.currRole)) {
      console.log('🌐 Making API call to get enrollments...');
      
      this.subscription.add(
        this.userService.getEnrollmentByEmail(this.loggedUser, this.currRole).subscribe({
          next: (enrollments) => {
            this.isLoading = false;
            this.enrollments = enrollments; // Store directly for template access
            console.log('✅ Enrollments loaded successfully:', enrollments);
            console.log('📊 Number of enrollments:', enrollments?.length);
            
            if (enrollments && enrollments.length > 0) {
              console.log('🎉 Courses found! They should display now.');
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = 'Failed to load your courses. Please try again.';
            console.error('❌ Error loading enrollments:', error);
          }
        })
      );
    } else {
      this.isLoading = false;
      this.errorMessage = 'User not properly logged in. Please log in again.';
      console.error('❌ Invalid user data');
    }
  }

  private isValidUser(value: string): boolean {
    return !!value && value !== '{}' && value !== 'undefined' && value !== 'null';
  }

  visitCourse(courseName: string): void {
    if (courseName?.trim()) {
      console.log('🚀 Visiting course:', courseName);
      this.router.navigate(['/fullcourse', courseName.trim()]);
    }
  }

  getCourseImage(courseType: string): string {
    const images = {
      'Youtube': 'assets/img/livebg.png',
      'Website': 'assets/img/websitebg.png'
    };
    return images[courseType as keyof typeof images] || 'assets/img/default-course.png';
  }

  hasEnrollments(): boolean {
    return this.enrollments && this.enrollments.length > 0;
  }
}