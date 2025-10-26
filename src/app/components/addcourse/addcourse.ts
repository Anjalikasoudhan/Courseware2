import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../models/course';
import { ProfessorService } from '../../services/professor.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-addcourse',
  standalone:true,
  templateUrl: './addcourse.html',
  styleUrls: ['./addcourse.css'],
  imports: [FormsModule, CommonModule,Header,Footer]
})
export class Addcourse implements OnInit {
  private _professorService = inject(ProfessorService);
  private _router = inject(Router);

  course = new Course();
  msg = ' ';
  showWebsiteLink = false;
  showYoutubeLink = false;

  ngOnInit(): void {
    console.log('AddCourse Component Initialized');
  }

  onCourseTypeChange(event: any): void {
    const selectedValue = event.target.value;
    this.showWebsiteLink = selectedValue === 'Website';
    this.showYoutubeLink = selectedValue === 'Youtube';
  }

  addCourse() {
    console.log('Add Course button clicked');
    console.log('Course data before processing:', this.course);

    // Validate required fields
    if (!this.course.coursename || !this.course.instructorname || !this.course.enrolleddate) {
      this.msg = "Please fill all required fields!";
      return;
    }

    // Set enrolled count to default
    this.course.enrolledcount = '0';

    // Generate a simple course ID
    this.course.courseid = this.generateCourseId();

    console.log('Course data after processing:', this.course);

    this._professorService.addCourse(this.course).subscribe({
      next: (data) => {
        console.log("Course added Successfully !!!", data);
        this.msg = "Course added successfully!";
        this._router.navigate(['/addchapter']);
      },
      error: (error) => {
        console.log("Process Failed");
        console.log("Error details:", error);
        
        if (error.error) {
          this.msg = error.error.message || "Course with " + this.course.coursename + " already exists!";
        } else {
          this.msg = "An error occurred while adding the course";
        }
      }
    });
  }

  private generateCourseId(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return 'COURSE_' + timestamp + '_' + random;
  }
}