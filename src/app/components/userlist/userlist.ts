import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-userlist',
  standalone: true,
  imports: [CommonModule, Header, Footer],
  templateUrl: './userlist.html',
  styleUrls: ['./userlist.css']
})
export class Userlist implements OnInit {
  private userService = inject(UserService);

  users = signal<Observable<User[]> | undefined>(undefined);

  ngOnInit(): void {
    this.users.set(this.userService.getAllUsers());
  }
}