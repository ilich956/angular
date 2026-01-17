import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from './services/team.service';
import { TeamMember, TeamRole, MemberStatus } from './models/team-member.model';
import { InviteMemberModalComponent } from './components/invite-member-modal/invite-member-modal.component';
import { Subject, takeUntil } from 'rxjs';

/**
 * Team Page Component
 */
@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [CommonModule, InviteMemberModalComponent],
  templateUrl: './team-page.component.html',
  styleUrl: './team-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamPageComponent implements OnInit, OnDestroy {
  private readonly teamService = inject(TeamService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  
  members = signal<TeamMember[]>([]);
  showInviteModal = signal(false);

  ngOnInit(): void {
    this.loadMembers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMembers(): void {
    this.teamService.getMembers().pipe(takeUntil(this.destroy$)).subscribe(members => {
      this.members.set(members);
      this.cdr.markForCheck();
    });
  }

  onMemberInvited(): void {
    this.showInviteModal.set(false);
    this.loadMembers();
  }

  onMemberRemoved(id: string): void {
    if (confirm('Are you sure you want to remove this team member?')) {
      this.teamService.removeMember(id).pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.loadMembers();
      });
    }
  }

  getRoleIcon(role: TeamRole): string {
    const roleIcons: Record<TeamRole, string> = {
      [TeamRole.ADMIN]: '👑',
      [TeamRole.MANAGER]: '💼',
      [TeamRole.DEVELOPER]: '💻',
      [TeamRole.DESIGNER]: '🎨',
      [TeamRole.QA]: '🔍',
    };
    return roleIcons[role] || '👤';
  }

  getStatusClass(status: MemberStatus): string {
    const statusMap: Record<MemberStatus, string> = {
      [MemberStatus.ACTIVE]: 'status-active',
      [MemberStatus.INACTIVE]: 'status-inactive',
      [MemberStatus.ON_LEAVE]: 'status-on-leave',
    };
    return statusMap[status] || '';
  }
}
