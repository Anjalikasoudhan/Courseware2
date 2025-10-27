import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Wishlist } from '../../models/wishlist';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-mywishlist',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    Header, 
    Footer, 
    FormsModule, 
    YouTubePlayerModule, 
    CarouselModule
  ],
  templateUrl: './mywishlist.html',
  styleUrls: ['./mywishlist.css']
})
export class Mywishlist implements OnInit {
  private _service = inject(UserService);
  private _router = inject(Router);

  wishlist$: Observable<Wishlist[]> | undefined;
  loggedUser = '';
  currRole = '';

  // Separate wishlist items by type
  youtubeWishlist: Wishlist[] = [];
  websiteWishlist: Wishlist[] = [];
  isLoading = true;
  hasError = false;

  // YouTube API state
  isYouTubeApiLoaded = false;
  apiLoadError = false;

  owlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['<', '>'],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 4 }
    },
    nav: true
  };

  ngOnInit(): void {
    // 1. Get items using the CORRECT keys from your LoginService
    const userEmail = sessionStorage.getItem('USER'); // <-- FIX
    const userRole = sessionStorage.getItem('ROLE'); // <-- FIX

    // 2. Check if the user is *actually* logged in
    if (!userEmail || userEmail === 'null' || userEmail === '{}') {
      console.error('MyWishlist Error: Could not find user email in session. (Key: USER)');
      this.isLoading = false;
      this.hasError = true; 
      return; // Stop loading
    }

    // 3. If valid, set the component properties
    this.loggedUser = userEmail.replace(/"/g, '');
    this.currRole = userRole ? userRole.replace(/"/g, '') : '';

    console.log('Frontend: Mywishlist component initialized for user:', this.loggedUser);
    
    // Load YouTube API first, then load wishlist
    this.loadYouTubeApi();
  }

  // Load YouTube IFrame API
  loadYouTubeApi(): void {
    if (this.isYouTubeApiLoaded) return;

    console.log('Frontend: Loading YouTube IFrame API...');
    
    // Check if API is already loaded
    if ((window as any).YT && (window as any).YT.loaded) {
      this.isYouTubeApiLoaded = true;
      console.log('Frontend: YouTube API already loaded');
      this.loadWishlist();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onload = () => {
      console.log('Frontend: YouTube API script loaded successfully');
      this.isYouTubeApiLoaded = true;
      this.loadWishlist();
    };
    tag.onerror = (error) => {
      console.error('Frontend: Failed to load YouTube API:', error);
      this.apiLoadError = true;
      this.loadWishlist(); // Still load wishlist but with fallback
    };
    
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }

  loadWishlist(): void {
    this.isLoading = true;
    this.hasError = false;
    
    console.log('Frontend: Loading wishlist for user:', this.loggedUser);
    
    if (this.currRole === "admin") {
      console.log('Frontend: Loading all wishlist (admin mode)');
      this.wishlist$ = this._service.getAllWishlist();
    } else {
      console.log('Frontend: Loading user wishlist');
      this.wishlist$ = this._service.getWishlistByEmail(this.loggedUser);
    }

    // Process wishlist data to separate by type
    this.wishlist$?.subscribe({
      next: (data) => {
        console.log('Frontend: Wishlist received from API:', data);
        console.log('Frontend: Number of wishlist items:', data.length);
        
        // Filter YouTube courses
        this.youtubeWishlist = data.filter(item => 
          item.coursetype === 'Youtube' || 
          item.coursetype === 'youtube' ||
          (item.youtubeurl && item.youtubeurl !== '')
        );
        
        // Filter Website courses
        this.websiteWishlist = data.filter(item => 
          item.coursetype === 'Website' || 
          item.coursetype === 'website' ||
          (item.websiteurl && item.websiteurl !== '')
        );
        
        console.log('Frontend: YouTube wishlist items:', this.youtubeWishlist.length);
        console.log('Frontend: Website wishlist items:', this.websiteWishlist.length);
        
        // Log YouTube URLs and extracted IDs for debugging
        this.youtubeWishlist.forEach((item, index) => {
          const videoId = this.getYouTubeVideoId(item.youtubeurl);
          console.log(`Frontend: YouTube item ${index + 1}:`, {
            name: item.coursename,
            originalUrl: item.youtubeurl,
            extractedVideoId: videoId,
            thumbnailUrl: this.getYouTubeThumbnail(videoId)
          });
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Frontend: Error loading wishlist:', error);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  visitCourse(coursename: string): void {
    console.log('Frontend: Visiting course:', coursename);
    this._router.navigate(['/fullcourse', coursename]);
  }

  openURL(url: string): void {
    console.log('Frontend: Opening URL:', url);
    window.open(url, "_blank");
  }

  removeFromWishlist(courseId: string): void {
    console.log('Frontend: Remove from wishlist requested for course:', courseId);
    
    if (!this.loggedUser || this.loggedUser === '{}') {
      console.error('Frontend: Cannot remove - no logged user found');
      return;
    }

    // Since your service doesn't have removeFromWishlist method yet,
    // we'll implement a client-side removal for now
    this.removeFromWishlistClientSide(courseId);
    
    // TODO: Uncomment when you add removeFromWishlist to your service
    /*
    this._service.removeFromWishlist(this.loggedUser, courseId).subscribe({
      next: (response) => {
        console.log('Frontend: Removed from wishlist successfully:', response);
        this.loadWishlist(); // Reload wishlist after removal
      },
      error: (error) => {
        console.error('Frontend: Error removing from wishlist:', error);
      }
    });
    */
  }

  private removeFromWishlistClientSide(courseId: string): void {
    // Client-side removal (temporary until backend method is added)
    this.youtubeWishlist = this.youtubeWishlist.filter(item => item.courseid !== courseId);
    this.websiteWishlist = this.websiteWishlist.filter(item => item.courseid !== courseId);
    console.log('Frontend: Removed course from client-side wishlist:', courseId);
  }

  // Improved YouTube video ID extraction
  getYouTubeVideoId(url: string): string {
    if (!url) {
      console.log('Frontend: No YouTube URL provided');
      return '';
    }

    console.log('Frontend: Extracting video ID from:', url);

    // Handle various YouTube URL formats
    let videoId = '';

    // Standard YouTube URLs
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /youtube\.com\/watch\?v=([^"&?\/\s]{11})/i,
      /youtu\.be\/([^"&?\/\s]{11})/i,
      /youtube\.com\/embed\/([^"&?\/\s]{11})/i,
      /youtube\.com\/v\/([^"&?\/\s]{11})/i
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        videoId = match[1];
        break;
      }
    }

    // If no pattern matched, check if it's already a video ID
    if (!videoId && url.length === 11 && !url.includes('/') && !url.includes('?')) {
      videoId = url;
    }

    console.log('Frontend: Extracted video ID:', videoId);
    return videoId;
  }

  // Get YouTube thumbnail URL
  getYouTubeThumbnail(videoId: string): string {
    if (!videoId) return 'assets/img/youtube-placeholder.png';
    
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  // Handle thumbnail loading errors
  onThumbnailError(event: any): void {
    console.error('Frontend: Thumbnail load error, using fallback');
    event.target.src = 'assets/img/youtube-placeholder.png';
  }

  // Handle YouTube player errors
  onYouTubePlayerError(event: any): void {
    console.error('Frontend: YouTube player error:', event);
  }

  owlDragging(event: any): void {
    // Implement dragging logic if needed
  }

  refreshWishlist(): void {
    console.log('Frontend: Refreshing wishlist');
    this.loadWishlist();
  }

  trackByCourseId(index: number, item: Wishlist): string {
    return item.courseid || index.toString();
  }
}