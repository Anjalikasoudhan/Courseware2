import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Observable, Subscription } from 'rxjs';
import { Enrollment } from '../../models/enrollment';
import { UserService } from '../../services/user.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mycourses',
  standalone:true,
  imports:[Header,Footer,CommonModule,FormsModule,CarouselModule],
  templateUrl: './mycourses.html',
  styleUrls: ['./mycourses.css']
})
export class Mycourses implements OnInit, OnDestroy {
  myenrollments$: Observable<Enrollment[]> | undefined;
  private subscription: Subscription = new Subscription();
  loggedUser = '';
  currRole = '';

  // Enhanced Owl Carousel Options
  owlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    margin: 30,
    stagePadding: 20,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 2 },
      992: { items: 3 },
      1200: { items: 4 }
    },
    nav: true
  };

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.initializeUserData();
    this.loadEnrollments();
    this.loadYouTubeAPI();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initializeUserData(): void {
    this.loggedUser = sessionStorage.getItem('loggedUser')?.replace(/"/g, '') || '';
    this.currRole = sessionStorage.getItem('ROLE')?.replace(/"/g, '') || '';
  }

  private loadEnrollments(): void {
    if (this.loggedUser && this.currRole) {
      this.myenrollments$ = this.userService.getEnrollmentByEmail(this.loggedUser, this.currRole);
    }
  }

  private loadYouTubeAPI(): void {
    const target = 'https://www.youtube.com/iframe_api';
    if (!this.isScriptLoaded(target)) {
      const tag = document.createElement('script');
      tag.src = target;
      document.body.appendChild(tag);
    }
  }

  isScriptLoaded(target: string): boolean {
    return !!document.querySelector(`script[src="${target}"]`);
  }

  visitCourse(courseName: string): void {
    if (courseName?.trim()) {
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

  owlDragging(event: any): void {
    console.log('Carousel dragging:', event);
    // Add any custom drag logic here
  }
}