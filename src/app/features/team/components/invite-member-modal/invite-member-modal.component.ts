import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { TeamRole, MemberStatus, TeamMember } from '../../models/team-member.model';
import { take } from 'rxjs/operators';

/**
 * Invite Member Modal Component
 */
@Component({
  selector: 'app-invite-member-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invite-member-modal.component.html',
  styleUrl: '../../../projects/components/create-project-modal/create-project-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InviteMemberModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly teamService = inject(TeamService);

  close = output<void>();
  memberInvited = output<void>();

  memberForm: FormGroup;
  isSubmitting = signal(false);

  roles = Object.values(TeamRole);
  statuses = Object.values(MemberStatus);

  constructor() {
    this.memberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: [TeamRole.DEVELOPER, Validators.required],
      status: [MemberStatus.ACTIVE, Validators.required],
      department: [''],
    });
  }

  onSubmit(): void {
    if (this.memberForm.valid) {
      this.isSubmitting.set(true);
      
      const formValue = this.memberForm.value;

      const member: Omit<TeamMember, 'id' | 'projectsCount' | 'tasksCount' | 'joinedAt'> = {
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
        status: formValue.status,
        department: formValue.department || undefined,
      };

      this.teamService.addMember(member).pipe(take(1)).subscribe(() => {
        this.isSubmitting.set(false);
        this.memberInvited.emit();
        this.memberForm.reset();
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onCancel();
    }
  }
}
