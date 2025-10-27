import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Question, Answer } from '../models/qa';

@Injectable({
  providedIn: 'root'
})
export class QaService {
  private questions: Question[] = [];
  private questionsSubject = new BehaviorSubject<Question[]>([]);

  constructor() {
    this.loadSampleData();
  }

  getQuestions(courseName: string): Observable<Question[]> {
    const courseQuestions = this.questions.filter(q => q.courseName === courseName);
    this.questionsSubject.next(courseQuestions);
    return this.questionsSubject.asObservable();
  }

  addQuestion(courseName: string, questionText: string, askedBy: string): void {
    const newQuestion: Question = {
      id: this.generateId(),
      courseName,
      question: questionText,
      askedBy,
      askedDate: new Date(),
      answers: [],
      isResolved: false
    };

    this.questions.unshift(newQuestion);
    this.notifySubscribers(courseName);
  }

  addAnswer(questionId: string, answerText: string, answeredBy: string, isInstructor: boolean = false): void {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      const newAnswer: Answer = {
        id: this.generateId(),
        questionId,
        answer: answerText,
        answeredBy,
        answeredDate: new Date(),
        isInstructor,
        upvotes: 0
      };

      question.answers.unshift(newAnswer);
      this.notifySubscribers(question.courseName);
    }
  }

  upvoteAnswer(questionId: string, answerId: string): void {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      const answer = question.answers.find(a => a.id === answerId);
      if (answer) {
        answer.upvotes++;
        this.notifySubscribers(question.courseName);
      }
    }
  }

  markAsResolved(questionId: string): void {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.isResolved = true;
      this.notifySubscribers(question.courseName);
    }
  }

  acceptAnswer(questionId: string, answerId: string): void {
    const question = this.questions.find(q => q.id === questionId);
    if (question) {
      question.answers.forEach(answer => {
        answer.isAccepted = false;
      });
      
      const answer = question.answers.find(a => a.id === answerId);
      if (answer) {
        answer.isAccepted = true;
        question.isResolved = true;
        this.notifySubscribers(question.courseName);
      }
    }
  }

  searchQuestions(courseName: string, searchTerm: string): Observable<Question[]> {
    const filteredQuestions = this.questions.filter(q => 
      q.courseName === courseName && 
      (q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
       q.askedBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    this.questionsSubject.next(filteredQuestions);
    return this.questionsSubject.asObservable();
  }

  private notifySubscribers(courseName: string): void {
    const courseQuestions = this.questions.filter(q => q.courseName === courseName);
    this.questionsSubject.next(courseQuestions);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private loadSampleData(): void {
    this.questions = [
      {
        id: '1',
        courseName: 'angular-fundamentals',
        question: 'How do I create a component in Angular?',
        askedBy: 'student1',
        askedDate: new Date('2024-01-15'),
        answers: [
          {
            id: 'a1',
            questionId: '1',
            answer: 'You can create a component using the Angular CLI command: ng generate component component-name',
            answeredBy: 'instructor1',
            answeredDate: new Date('2024-01-15'),
            isInstructor: true,
            upvotes: 5,
            isAccepted: true
          }
        ],
        isResolved: true
      },
      {
        id: '2',
        courseName: 'angular-fundamentals',
        question: 'What is the difference between ngOnInit and constructor?',
        askedBy: 'student2',
        askedDate: new Date('2024-01-16'),
        answers: [],
        isResolved: false
      }
    ];
  }
}