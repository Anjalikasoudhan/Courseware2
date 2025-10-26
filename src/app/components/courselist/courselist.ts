import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Observable } from 'rxjs';
import { Course } from '../../models/course';
import { Enrollment } from '../../models/enrollment';
import { Wishlist } from '../../models/wishlist';
import { ProfessorService } from '../../services/professor.service';
import { UserService } from '../../services/user.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-courselist',
  standalone:true,
  imports:[Header,Footer,FormsModule,CommonModule,CarouselModule,YouTubePlayerModule],
  templateUrl: './courselist.html',
  styleUrls: ['./courselist.css']
})
export class Courselist implements OnInit {
  youtubecourselist!: Observable<Course[]>;
  websitecourselist!: Observable<Course[]>;
  courselist!: Observable<Course[]>;

  // No longer needed, as we subscribe directly in getcoursedetails
  // enrollmentstatus!: Observable<any[]>;
  // wishliststatus!: Observable<any[]>;

  enrollment = new Enrollment();
  wishlist = new Wishlist();

  loggedUser = '';
  currRole = '';

  enrolledID = '';
  enrolledURL = '';
  enrolledName = '';
  enrolledInstructorName = '';

  // 👇 Replacing jQuery visibility toggles with signals
  showYoutubeCard = signal(true);
  showWebsiteCard = signal(true);
  showCourseDetails = signal(false);
  showEnrollSuccess = signal(false);

  enrolledStatus = signal<'enrolled' | 'notenrolled'>('notenrolled');
  likedStatus = signal<'liked' | 'notliked'>('notliked');

  constructor(private profService: ProfessorService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loggedUser = sessionStorage.getItem('loggedUser') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';

    this.youtubecourselist = this.userService.getYoutubeCourseList();
    this.websitecourselist = this.userService.getWebsiteCourseList();
  }

 getcoursedetails(coursename: string) {
    this.showYoutubeCard.set(false);
    this.showWebsiteCard.set(false);
    this.showCourseDetails.set(true);

    this.courselist = this.userService.getCourseListByName(coursename);

    // --- CORRECTED FIX ---
    // Check enrollment status (as a boolean)
    this.userService.getEnrollmentStatus(coursename, this.loggedUser, this.currRole)
      .subscribe((isEnrolled: boolean) => { // The status is just true or false
        if (isEnrolled) { // <--- REMOVED .length check
          this.enrolledStatus.set('enrolled');
        } else {
          this.enrolledStatus.set('notenrolled');
        }
      });

    // Check wishlist status (as a boolean)
    this.userService.getWishlistStatus(coursename, this.loggedUser)
      .subscribe((isLiked: boolean) => { // The status is just true or false
        if (isLiked) { // <--- REMOVED .length check
          this.likedStatus.set('liked');
        } else {
          this.likedStatus.set('notliked');
        }
      });
  }

  backToCourseList() {
    this.showYoutubeCard.set(true);
    this.showWebsiteCard.set(true);
    this.showCourseDetails.set(false);
  }

  enrollcourse(course: Course) {
    // --- CORRECTED ---
    // Get the user's ID from session storage
    const userId = sessionStorage.getItem('userId') || ''; // Adjust 'userId' if your key is different

    // Manually build the complete enrollment object
    this.enrollment = {
        // Course details
        coursename: course.coursename,
        courseid: course.courseid,
        instructorname: course.instructorname,
        instructorinstitution: course.instructorinstitution,
        enrolledcount: course.enrolledcount,
        youtubeurl: course.youtubeurl,
        websiteurl: course.websiteurl,
        coursetype: course.coursetype,
        skilllevel: course.skilllevel,
        language: course.language,
        description: course.description,
        
        // User and enrollment details
        enrolleddate: new Date().toISOString(), // Add current date
        enrolledusername: this.loggedUser,     // Add username
        enrolleduserid: userId,                // Add user ID
        enrolledusertype: this.currRole        // Add user type
    };

    // --- Rest of your function ---
    this.enrolledID = course.courseid;
    this.enrolledURL = course.youtubeurl;
    this.enrolledName = course.coursename;
    this.enrolledInstructorName = course.instructorname;

    this.enrolledStatus.set('enrolled');
    this.showCourseDetails.set(false);

    setTimeout(() => {
      this.showEnrollSuccess.set(true);
    }, 1000);

    this.userService.enrollNewCourse(this.enrollment, this.loggedUser, this.currRole).subscribe();
  }
  owlDragging(event: any) {
    console.log('Dragging event:', event);
  }

  addToWishList(course: Course) {
    // This assumes your Wishlist model can be built this way.
    // If it also needs a userid, you'll need to add it like in enrollcourse.
    this.wishlist = { ...course, likeduser: this.loggedUser, likedusertype: this.currRole };
    this.likedStatus.set('liked');
    this.userService.addToWishlist(this.wishlist).subscribe();
  }

  visitCourse(coursename: string) {
    // This logic is correct, but the check in getcoursedetails ensures 
    // the button state is right *before* this is called.
    if (this.enrolledStatus() === 'enrolled') {
      this.router.navigate(['/fullcourse', coursename]);
    } else {
      alert('You are not enrolled in this course yet!');
    }
  }

  isNotEnrolled() {
    return this.enrolledStatus() === 'notenrolled';
  }

  isNotLiked() {
    return this.likedStatus() === 'notliked';
  }
  trackByCourseId(index: number, course: Course): any {
  return course.courseid || index;
}

getThumbnail(url: string): string {
  const videoId = url?.includes('v=') ? url.split('v=')[1]?.split('&')[0] : '';
  return videoId ? `https://i.ytimg.com/vi/${videoId}/sddefault.jpg` : 'assets/img/default-thumbnail.png';
}

onImgError(event: any) {
  event.target.src = 'assets/img/default-thumbnail.png';
}


  owlOptions = {
  loop: true,
  margin: 15,
  dots: true,
  nav: true,
  autoplay: true,
  responsive: {
    0: { items: 1 },
    600: { items: 2 },
    1000: { items: 3 } // ✅ Don’t set this to 4 unless you have ≥ 4 slides
  }
};

}