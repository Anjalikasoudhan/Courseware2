import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Chapter } from '../../models/chapter';
import { UserService } from '../../services/user.service';
import { Course } from '../../models/course';
import { QaService } from '../../services/qa.service';
import { Question, Answer } from '../../models/qa';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-fullcourse',
  standalone:true,
  imports:[FormsModule,CommonModule,Header,Footer,YouTubePlayerModule,CarouselModule],
  templateUrl: './fullcourse.html',
  styleUrls: ['./fullcourse.css']
})
export class Fullcourse implements OnInit, OnDestroy {
  video: string = '';
  courseName: string = '';
  chapterlist?: Observable<Chapter[]>;
  courselist?: Observable<Course[]>;
  chapter = new Chapter();

  // UI state management
  activeTab: string = 'overview';
  showQuestionInput: boolean = false;
  showNotesInput: boolean = false;
  selectedChapterIndex: number = 0;

  // Q&A Properties
  questions$!: Observable<Question[]>;
  newQuestionText: string = '';
  searchTerm: string = '';
  private qaSubscription?: Subscription;
  currentUser: string = '';

  constructor(
    private router: Router,
    private service: UserService,
    private route: ActivatedRoute,
    private qaService: QaService
  ) {}

  ngOnInit(): void {
    // Get course name from route
    this.courseName = this.route.snapshot.params['coursename'];
    this.currentUser = sessionStorage.getItem('username') || 'Anonymous';

    // Load YouTube API if not already present
    this.loadYouTubeAPI();

    // Fetch data from backend
    this.chapterlist = this.service.getChapterListByCourseName(this.courseName);
    this.courselist = this.service.getCourseListByName(this.courseName);

    // Load Q&A data
    this.questions$ = this.qaService.getQuestions(this.courseName);

    // Set first available chapter as default video
    this.setDefaultVideo();
  }

  ngOnDestroy(): void {
    if (this.qaSubscription) {
      this.qaSubscription.unsubscribe();
    }
  }

  // Q&A Methods
  postQuestion(): void {
    if (this.newQuestionText.trim()) {
      this.qaService.addQuestion(this.courseName, this.newQuestionText.trim(), this.currentUser);
      this.newQuestionText = '';
      this.showQuestionInput = false;
    }
  }

  postAnswer(questionId: string, answerText: string): void {
    if (answerText.trim()) {
      const isInstructor = sessionStorage.getItem('role') === 'instructor';
      this.qaService.addAnswer(questionId, answerText.trim(), this.currentUser, isInstructor);
    }
  }

  onQuestionKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.postQuestion();
    }
  }

  onAnswerKeyPress(event: KeyboardEvent, questionId: string, answerInput: HTMLTextAreaElement): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.postAnswer(questionId, answerInput.value);
      answerInput.value = '';
    }
  }

  upvoteAnswer(questionId: string, answerId: string): void {
    this.qaService.upvoteAnswer(questionId, answerId);
  }

  acceptAnswer(questionId: string, answerId: string): void {
    this.qaService.acceptAnswer(questionId, answerId);
  }

  markAsResolved(questionId: string): void {
    this.qaService.markAsResolved(questionId);
  }

  searchQuestions(): void {
    if (this.searchTerm.trim()) {
      this.questions$ = this.qaService.searchQuestions(this.courseName, this.searchTerm.trim());
    } else {
      this.questions$ = this.qaService.getQuestions(this.courseName);
    }
  }

  isInstructor(): boolean {
    return sessionStorage.getItem('role') === 'instructor';
  }

  isQuestionOwner(question: Question): boolean {
    return question.askedBy === this.currentUser;
  }

  // Existing methods remain the same...
  private loadYouTubeAPI(): void {
    const youtubeApi = 'https://www.youtube.com/iframe_api';
    if (!this.isScriptLoaded(youtubeApi)) {
      const tag = document.createElement('script');
      tag.src = youtubeApi;
      document.body.appendChild(tag);
    }
  }

  openChapter(videoUrl: string, index: number): void {
    console.log('Original video URL:', videoUrl);
    
    if (videoUrl) {
      this.video = this.extractYouTubeId(videoUrl);
      this.selectedChapterIndex = index;
      console.log('Extracted video ID:', this.video);
    } else {
      this.video = '';
    }
  }

  private extractYouTubeId(url: string): string {
    if (!url) return '';
    
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /youtube\.com\/watch\?v=([^"&?\/\s]{11})/,
      /youtu\.be\/([^"&?\/\s]{11})/,
      /youtube\.com\/embed\/([^"&?\/\s]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return url;
  }

  private setDefaultVideo(): void {
    this.chapterlist?.subscribe(chapters => {
      if (chapters && chapters.length > 0) {
        const firstChapter = chapters[0];
        
        for (let i = 1; i <= 8; i++) {
          const chapterName = this.getChapterProperty(firstChapter, `chapter${i}name`);
          const chapterId = this.getChapterProperty(firstChapter, `chapter${i}id`);
          if (chapterName && chapterName.trim() !== '' && chapterId && chapterId.trim() !== '') {
            this.openChapter(chapterId, i);
            break;
          }
        }
      }
    });
  }

  onPlayerReady(event: any): void {
    console.log('YouTube player ready', event);
  }

  onPlayerError(event: any): void {
    console.error('YouTube player error', event);
  }

  openTab(tabName: string): void {
    this.activeTab = tabName;
  }

  openOverview(): void { this.openTab('overview'); }
  openQandA(): void { this.openTab('qa'); }
  openNotes(): void { this.openTab('notes'); }
  openAnnouncements(): void { this.openTab('announcements'); }
  openDownloads(): void { this.openTab('downloads'); }

  toggleQuestion(): void { 
    this.showQuestionInput = !this.showQuestionInput; 
  }

  toggleNotes(): void { 
    this.showNotesInput = !this.showNotesInput; 
  }

  setChapter(index: number): void {
    this.selectedChapterIndex = index;
  }

  isChapterSelected(index: number): boolean {
    return this.selectedChapterIndex === index;
  }

  getChapterProperty(chapter: Chapter, property: string): any {
    return (chapter as any)[property];
  }

  isScriptLoaded(src: string): boolean {
    return !!document.querySelector(`script[src="${src}"]`);
  }

  downloadPdf(): void {
    const pdfUrl = './assets/react.pdf';
    const pdfName = 'Introduction to React';
    
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfName;
    link.click();
  }

  openDoc(): void {
    const pdfUrl = './assets/react.pdf';
    window.open(`${pdfUrl}#page=1`, '_blank');
  }

  hasChapterContent(chapter: Chapter, index: number): boolean {
    const chapterName = this.getChapterProperty(chapter, `chapter${index}name`);
    return chapterName && chapterName.trim() !== '';
  }

  getFirstAvailableChapter(chapter: Chapter): number {
    for (let i = 1; i <= 8; i++) {
      if (this.hasChapterContent(chapter, i)) {
        return i;
      }
    }
    return 0;
  }
}