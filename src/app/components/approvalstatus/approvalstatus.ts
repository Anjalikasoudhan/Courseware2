import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Professor } from '../../models/professor';
import { ProfessorService } from '../../services/professor.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-approvalstatus',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './approvalstatus.html',
  styleUrls: ['./approvalstatus.css']
})
export class Approvalstatus implements OnInit {
  private professorService = inject(ProfessorService);

  currRole = signal('');
  loggedUser = signal('');
  approval = signal<Observable<Professor[]> | undefined>(undefined);
  professorlist = signal<Observable<Professor[]> | undefined>(undefined);

  // Signals for UI control
  showAdminApproval = signal(false);
  showProfessorApproval = signal(false);

  ngOnInit(): void {
    // ✅ Match LoginService key names
    const user = sessionStorage.getItem('USER') || 'null';
    const role = sessionStorage.getItem('ROLE') || 'null';

    this.loggedUser.set(user.replace(/"/g, ''));
    this.currRole.set(role.replace(/"/g, ''));

    // --- Debug Logs ---
    console.log('--- DEBUGGING APPROVAL STATUS ---');
    console.log('Raw USER from session:', sessionStorage.getItem('USER'));
    console.log('Cleaned loggedUser signal:', this.loggedUser());
    console.log('Raw ROLE from session:', sessionStorage.getItem('ROLE'));
    console.log('Cleaned currRole signal:', this.currRole());
    // ------------------

    // Load data
    this.professorlist.set(this.professorService.getProfessorList());
    this.approval.set(this.professorService.getProfessorListByEmail(this.loggedUser()));

    // Set which view to show
    if (
      (this.currRole() === 'admin' || this.currRole() === 'ADMIN') &&
      this.loggedUser() === 'admin@gmail.com'
    ) {
      console.log('✅ Setting view for: ADMIN');
      this.showAdminApproval.set(true);
      this.showProfessorApproval.set(false);
    } else if (this.currRole() === 'professor' || this.currRole() === 'PROFESSOR') {
      console.log('✅ Setting view for: PROFESSOR');
      this.showProfessorApproval.set(true);
      this.showAdminApproval.set(false);
    } else {
      console.error('❌ FAILED TO SET VIEW: No role or user match.');
      console.log('Role check failed:', this.currRole());
      console.log('User check failed:', this.loggedUser());
    }
  }

  // ✅ Admin actions
  acceptRequest(curremail: string) {
    this.professorService.acceptRequestForProfessorApproval(curremail).subscribe({
      next: (response) => {
        console.log('Accept request successful:', response);
        this.professorlist.set(this.professorService.getProfessorList());
      },
      error: (err) => {
        console.error('Accept request failed:', err);
      }
    });
  }

  rejectRequest(curremail: string) {
    this.professorService.rejectRequestForProfessorApproval(curremail).subscribe({
      next: (response) => {
        console.log('Reject request successful:', response);
        this.professorlist.set(this.professorService.getProfessorList());
      },
      error: (err) => {
        console.error('Reject request failed:', err);
      }
    });
  }
}
