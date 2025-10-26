import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Professor } from '../../models/professor';
import { ProfessorService } from '../../services/professor.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-professorlist',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './professorlist.html',
  styleUrls: ['./professorlist.css']
})
export class Professorlist implements OnInit {
  private professorService = inject(ProfessorService);

  loggedUser = signal('');
  currRole = signal('');
  professorlist = signal<Observable<Professor[]> | undefined>(undefined);

  ngOnInit(): void {
    const user = sessionStorage.getItem('loggedUser') || '{}';
    this.loggedUser.set(user.replace(/"/g, ''));

    const role = sessionStorage.getItem('ROLE') || '{}';
    this.currRole.set(role.replace(/"/g, ''));

    this.professorlist.set(this.professorService.getProfessorList());
  }
}