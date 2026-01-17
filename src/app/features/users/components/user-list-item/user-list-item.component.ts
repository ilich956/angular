import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

/**
 * User List Item Component
 * Module 2: OnPush Change Detection Strategy
 * 
 * Demonstrates OnPush with input properties
 */
@Component({
  selector: 'app-user-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list-item.component.html',
  styleUrl: './user-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListItemComponent {
  @Input({ required: true }) user!: User;
}
