import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { selectAll, selectUsersLoading, selectUsersError } from '../../store/user.state';
import * as UserActions from '../../store/user.actions';
import { UserListItemComponent } from '../user-list-item/user-list-item.component';

/**
 * User List Component
 * Module 2: OnPush Change Detection Strategy
 * Module 1: Standalone Component
 * 
 * Demonstrates:
 * - OnPush change detection for performance
 * - NgRx state management
 * - Standalone component architecture
 */
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserListItemComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private readonly store = inject(Store);

  users$: Observable<User[]> = this.store.select(selectAll);
  loading$: Observable<boolean> = this.store.select(selectUsersLoading);
  error$: Observable<string | null> = this.store.select(selectUsersError);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.store.dispatch(UserActions.loadUsers());
  }

  onRefresh(): void {
    this.loadUsers();
  }
}
