import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Chapter } from '../../models/chapter';
import { ProfessorService } from '../../services/professor.service';
import { Course } from '../../models/course';
import { FormsModule } from '@angular/forms';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-addchapter',
  templateUrl: './addchapter.html',
  styleUrls: ['./addchapter.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, AsyncPipe,Header,Footer]
})
export class Addchapter implements OnInit {
  private _router = inject(Router);
  private _service = inject(ProfessorService);

  chapter = new Chapter();
 coursenames: Observable<string[]> | undefined;
  msg = '';
  currRole = '';
  loggedUser = '';
   agreementChecked:boolean=false;
  // Use signals for chapter visibility state
  showChapter1 = signal(true);
  showChapter2 = signal(false);
  showChapter3 = signal(false);
  showChapter4 = signal(false);
  showChapter5 = signal(false);
  showChapter6 = signal(false);
  showChapter7 = signal(false);
  showChapter8 = signal(false);

  ngOnInit() {
    // Get current user role from session storage
    this.loggedUser = sessionStorage.getItem('loggedUser') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';

    console.log('Current User:', this.loggedUser);
    console.log('Current Role:', this.currRole);

    this.coursenames = this._service.getCourseListNames();
  }

  // Chapter navigation methods
  addChapter2() {
    this.showChapter2.set(true);
  }

  addChapter3() {
    this.showChapter3.set(true);
  }

  addChapter4() {
    this.showChapter4.set(true);
  }

  addChapter5() {
    this.showChapter5.set(true);
  }

  addChapter6() {
    this.showChapter6.set(true);
  }

  addChapter7() {
    this.showChapter7.set(true);
  }

  addChapter8() {
    this.showChapter8.set(true);
  }

  removeChapter2() {
    this.showChapter2.set(false);
    this.chapter.chapter2name = '';
    this.chapter.chapter2id = '';
  }

  removeChapter3() {
    this.showChapter3.set(false);
    this.chapter.chapter3name = '';
    this.chapter.chapter3id = '';
  }

  removeChapter4() {
    this.showChapter4.set(false);
    this.chapter.chapter4name = '';
    this.chapter.chapter4id = '';
  }

  removeChapter5() {
    this.showChapter5.set(false);
    this.chapter.chapter5name = '';
    this.chapter.chapter5id = '';
  }

  removeChapter6() {
    this.showChapter6.set(false);
    this.chapter.chapter6name = '';
    this.chapter.chapter6id = '';
  }

  removeChapter7() {
    this.showChapter7.set(false);
    this.chapter.chapter7name = '';
    this.chapter.chapter7id = '';
  }

  removeChapter8() {
    this.showChapter8.set(false);
    this.chapter.chapter8name = '';
    this.chapter.chapter8id = '';
  }

  addChapters() {
    this._service.addNewChapters(this.chapter).subscribe({
      next: (data) => {
        console.log("chapter added Successfully !!!");
        this.msg = "Chapter Added Successfully!";
        setTimeout(() => {
        // Redirect based on user role
       if (this.currRole.toLowerCase() === 'admin') {
          this._router.navigate(['/admindashboard']);
        } else {
          this._router.navigate(['/professordashboard']);
        }},2000);
      },
      error: (error) => {
        console.log("chapter adding Failed !!!");
        console.log(error.error);
        this.msg = "Chapter adding failed! Please try again.";
      }
    });
  }
}