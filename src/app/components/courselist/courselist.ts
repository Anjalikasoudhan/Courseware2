import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Course } from '../../models/course';
import { Enrollment } from '../../models/enrollment';
import { Wishlist } from '../../models/wishlist';
import { ProfessorService } from '../../services/professor.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-courselist',
  standalone: true,
  imports: [CommonModule, Header, Footer, FormsModule, YouTubePlayerModule],
  templateUrl: './courselist.html',
  styleUrls: ['./courselist.css']
})
export class Courselist implements OnInit {
  
  youtubecourselist: Course[] = [];
  websitecourselist: Course[] = [];
  courselist: Course[] = [];
  enrollment = new Enrollment();
  wishlist = new Wishlist();

  loggedUser = '';
  currRole = '';
  enrolledID = '';
  enrolledURL = '';
  enrolledName = '';
  enrolledInstructorName = '';
  isEnrolled: boolean = false;
  isLiked: boolean = false;
  currentCourseName: string = '';

  // Track enrollment status for all courses using course name as key
  enrollmentStatusMap: Map<string, boolean> = new Map();

  // Using signals for better reactivity
  showYoutubeCard = signal(true);
  showWebsiteCard = signal(true);
  showCourseDetails = signal(false);
  showEnrollSuccess = signal(false);
  showLikedBtn = signal(false);

  isLoading = signal(true);
  hasError = signal(false);
  errorMessage = signal('');

  @ViewChild('alertOne') alertOne!: ElementRef;
  @ViewChild('wishlistSuccessModal') wishlistSuccessModal!: ElementRef;
  @ViewChild('enrollSuccessModal') enrollSuccessModal!: ElementRef;
  
  constructor(
    private _service: ProfessorService, 
    private userService: UserService, 
    private _router: Router
  ) { }

  ngOnInit() {
    // Fix session storage parsing - check what's actually stored
    const storedUser = sessionStorage.getItem('loggedUser');
    const storedRole = sessionStorage.getItem('ROLE');
    
    console.log('Raw stored user:', storedUser);
    console.log('Raw stored role:', storedRole);

    // Handle different storage formats
    if (storedUser && storedUser !== '{}') {
      try {
        // Try to parse as JSON first
        const parsedUser = JSON.parse(storedUser);
        this.loggedUser = typeof parsedUser === 'string' ? parsedUser : parsedUser.email || parsedUser.username || '';
      } catch (e) {
        // If not JSON, use as is
        this.loggedUser = storedUser.replace(/"/g, '');
      }
    } else {
      // Try alternative storage keys
      this.loggedUser = sessionStorage.getItem('USER') || 
                       sessionStorage.getItem('email') || 
                       sessionStorage.getItem('username') || '';
    }

    if (storedRole && storedRole !== '{}') {
      try {
        const parsedRole = JSON.parse(storedRole);
        this.currRole = typeof parsedRole === 'string' ? parsedRole : parsedRole.role || '';
      } catch (e) {
        this.currRole = storedRole.replace(/"/g, '');
      }
    } else {
      this.currRole = sessionStorage.getItem('userRole') || 'USER';
    }

    console.log('Processed Logged User:', this.loggedUser);
    console.log('Processed Current Role:', this.currRole);

    if (!this.loggedUser) {
      console.error('User email not found in session storage');
      console.log('All session storage:', sessionStorage);
      this.hasError.set(true);
      this.errorMessage.set('User session not found. Please login again.');
      this.isLoading.set(false);
      return;
    }

    this.loadCourses();
    this.loadUserEnrollments();

    const target = 'https://www.youtube.com/iframe_api';

    if (!this.isScriptLoaded(target)) {
      const tag = document.createElement('script');
      tag.src = target;
      document.body.appendChild(tag);
    }

    // Initialize display states
    this.showYoutubeCard.set(true);
    this.showWebsiteCard.set(true);
    this.showCourseDetails.set(false);
    this.showEnrollSuccess.set(false);
    this.showLikedBtn.set(false);
  }

  loadCourses() {
    this.isLoading.set(true);
    this.hasError.set(false);
    
    let coursesLoaded = 0;
    const totalCoursesToLoad = 2; // YouTube + Website courses

    const checkAllCoursesLoaded = () => {
      coursesLoaded++;
      if (coursesLoaded >= totalCoursesToLoad) {
        this.isLoading.set(false);
        console.log('All courses loaded. YouTube:', this.youtubecourselist.length, 'Website:', this.websitecourselist.length);
      }
    };

    // Load YouTube courses
    this.userService.getYoutubeCourseList().subscribe({
      next: (courses) => {
        this.youtubecourselist = courses || [];
        console.log('YouTube courses loaded:', this.youtubecourselist.length);
        checkAllCoursesLoaded();
      },
      error: (error) => {
        console.error('Error loading YouTube courses:', error);
        this.youtubecourselist = [];
        this.hasError.set(true);
        this.errorMessage.set('Failed to load YouTube courses');
        checkAllCoursesLoaded();
      }
    });

    // Load Website courses
    this.userService.getWebsiteCourseList().subscribe({
      next: (courses) => {
        this.websitecourselist = courses || [];
        console.log('Website courses loaded:', this.websitecourselist.length);
        checkAllCoursesLoaded();
      },
      error: (error) => {
        console.error('Error loading website courses:', error);
        this.websitecourselist = [];
        this.hasError.set(true);
        this.errorMessage.set('Failed to load website courses');
        checkAllCoursesLoaded();
      }
    });
  }

  // Helper method to check if a course is enrolled
  isCourseEnrolled(courseName: string): boolean {
    return this.enrollmentStatusMap.has(courseName);
  }

  isScriptLoaded(target: string): boolean {
    return document.querySelector('script[src="' + target + '"]') ? true : false;
  }

  getcoursedetails(coursename: string) {
    this.showYoutubeCard.set(false);
    this.showWebsiteCard.set(false);
    this.showCourseDetails.set(true);
    this.currentCourseName = coursename;
    
    this.userService.getCourseListByName(coursename).subscribe({
      next: (courses) => {
        this.courselist = courses || [];
        // Check if current user is enrolled in this course
        if (this.courselist.length > 0) {
          this.isEnrolled = this.isCourseEnrolled(coursename);
        }
      },
      error: (error) => {
        console.error('Error loading course details:', error);
        this.courselist = [];
      }
    });
    
    // Only load wishlist status if user is logged in
    if (this.loggedUser) {
      this.userService.getWishlistStatus(coursename, this.loggedUser).subscribe({
        next: (status) => {
          this.isLiked = status;
          this.showLikedBtn.set(status);
          console.log('Wishlist status:', status);
        },
        error: (error) => {
          console.error('Error loading wishlist status:', error);
          this.isLiked = false;
          this.showLikedBtn.set(false);
        }
      });
    }
  }
getYouTubeId(url: string): string {
  if (!url) {
    return '';
  }

  // This will handle formats like 'j09EQ-xlh88?si=...'
  // as well as full 'youtube.com/watch?v=j09EQ-xlh88' links
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  // If it's a full URL, return the ID
  if (match && match[2].length === 11) {
    return match[2];
  } 

  // If it's just 'j09EQ-xlh88?si=...', split at the '?'
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
     return url.split('?')[0];
  }

  // Fallback in case of an unknown format
  return url;
}
  backToCourseList() {
    this.showYoutubeCard.set(true);
    this.showWebsiteCard.set(true);
    this.showCourseDetails.set(false);
    this.showEnrollSuccess.set(false);
  }
// Add this function to your courselist.ts file
loadUserEnrollments() {
  if (!this.loggedUser || !this.currRole) {
    console.log('Cannot load enrollments: user or role not available');
    return;
  }

  this.userService.getEnrollmentByEmail(this.loggedUser, this.currRole).subscribe({
    next: (enrollments) => {
      // This fills the map with the user's existing enrollments
      enrollments.forEach(enrollment => {
        this.enrollmentStatusMap.set(enrollment.coursename, true);
      });
      console.log('User enrollments loaded:', this.enrollmentStatusMap.size, 'courses');
    },
    error: (error) => {
      console.error('Error loading user enrollments:', error);
    }
  });
}
  enrollcourse(course: Course) {
    // Check if user is logged in
    if (!this.loggedUser || !this.currRole) {
      console.error('Cannot enroll: User not logged in');
      alert('Please login to enroll in courses');
      return;
    }

    // Check if already enrolled
    if (this.isCourseEnrolled(course.coursename)) {
      console.log('User already enrolled in this course');
      alert('You are already enrolled in this course');
      return;
    }

    this.enrollment.courseid = course.courseid;
    this.enrollment.coursename = course.coursename;
    this.enrollment.enrolledusertype = this.currRole;
    this.enrollment.instructorname = course.instructorname;
    this.enrollment.instructorinstitution = course.instructorinstitution;
    this.enrollment.enrolledcount = course.enrolledcount;
    this.enrollment.youtubeurl = course.youtubeurl;
    this.enrollment.websiteurl = course.websiteurl;
    this.enrollment.coursetype = course.coursetype;
    this.enrollment.skilllevel = course.skilllevel;
    this.enrollment.language = course.language;
    this.enrollment.description = course.description;
    this.enrollment.enrolleddate = new Date().toISOString().split('T')[0]; // Set current date
    
    this.enrolledID = course.courseid;
    this.enrolledURL = course.youtubeurl;
    this.enrolledName = course.coursename;
    this.enrolledInstructorName = course.instructorname;
    this.isEnrolled = true;

    // Update enrollment status map
    this.enrollmentStatusMap.set(course.coursename, true);

    console.log('Enrolling user:', this.loggedUser, 'with role:', this.currRole);

    this.userService.enrollNewCourse(this.enrollment, this.loggedUser, this.currRole).subscribe({
      next: (data) => {
        console.log("Course enrolled Successfully !!!");
        alert(`Successfully enrolled in ${course.coursename}!`);
      },
      error: (error) => {
        console.log("Enrollment Failed !!!");
        console.log('Error details:', error);
        // Revert changes if enrollment fails
        this.enrollmentStatusMap.delete(course.coursename);
        this.isEnrolled = false;
        alert('Enrollment failed. Please try again.');
      }
    });
  }

  addToWishList(course: Course) {
    // Check if user is logged in
    if (!this.loggedUser || !this.currRole) {
      console.error('Cannot add to wishlist: User not logged in');
      alert('Please login to add courses to wishlist');
      return;
    }

    this.wishlist.courseid = course.courseid;
    this.wishlist.coursename = course.coursename;
    this.wishlist.likeduser = this.loggedUser;
    this.wishlist.likedusertype = this.currRole;
    this.wishlist.instructorname = course.instructorname;
    this.wishlist.instructorinstitution = course.instructorinstitution;
    this.wishlist.enrolledcount = course.enrolledcount;
    this.wishlist.coursetype = course.coursetype;
    this.wishlist.websiteurl = course.websiteurl;
    this.wishlist.skilllevel = course.skilllevel;
    this.wishlist.language = course.language;
    this.wishlist.description = course.description;
    
    this.isLiked = true;
    this.showLikedBtn.set(true);

    this.userService.addToWishlist(this.wishlist).subscribe({
      next: (data) => {
        console.log("Added To Wishlist Successfully !!!");
        alert(`Added ${course.coursename} to your wishlist!`);
      },
      error: (error) => {
        console.log("Adding Process Failed !!!");
        console.log(error.error);
        this.isLiked = false;
        this.showLikedBtn.set(false);
        alert('Failed to add to wishlist. Please try again.');
      }
    });
  }

  visitCourse(coursename: string) {
    if (this.isEnrolled) {
      this._router.navigate(['/fullcourse', coursename]);
    } else {
      alert('Please enroll in the course first to access the content.');
    }
  }

  gotoMyCourses() {
    this._router.navigate(['/mycourses']);
  }

  gotoURL(url: string) {
    window.open(url, "_blank");
  }

  reloadCourses() {
    this.loadCourses();
  }

  loginAgain() {
    this._router.navigate(['/login']);
  }
}