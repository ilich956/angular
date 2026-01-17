import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TaskService } from '../../tasks/services/task.service';
import { TeamMember, TeamRole, MemberStatus } from '../models/team-member.model';

/**
 * Team Service
 */
@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly taskService = inject(TaskService);
  private members: TeamMember[] = [];

  getMembers(): Observable<TeamMember[]> {
    // Return stored members or default demo data if empty
    if (this.members.length === 0) {
      const demoMembers: TeamMember[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@projectflow.io',
          role: TeamRole.ADMIN,
          department: 'Engineering',
          projectsCount: 3,
          tasksCount: 15,
          joinedAt: '2023-01-15',
          status: MemberStatus.ACTIVE,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@projectflow.io',
          role: TeamRole.MANAGER,
          department: 'Product',
          projectsCount: 2,
          tasksCount: 8,
          joinedAt: '2023-03-20',
          status: MemberStatus.ACTIVE,
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@projectflow.io',
          role: TeamRole.DEVELOPER,
          department: 'Engineering',
          projectsCount: 4,
          tasksCount: 22,
          joinedAt: '2023-06-10',
          status: MemberStatus.ACTIVE,
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@projectflow.io',
          role: TeamRole.DESIGNER,
          department: 'Design',
          projectsCount: 2,
          tasksCount: 12,
          joinedAt: '2023-09-05',
          status: MemberStatus.ACTIVE,
        },
      ];
      this.members = demoMembers;
    }

    // Update task counts from current tasks
    return this.taskService.getTasks().pipe(
      map(tasks => {
        const updatedMembers = this.members.map(member => {
          const memberTasks = tasks.filter(task => task.assigneeName === member.name);
          return {
            ...member,
            tasksCount: memberTasks.length,
          };
        });
        return [...updatedMembers];
      }),
      delay(300)
    );
  }

  addMember(member: Omit<TeamMember, 'id' | 'projectsCount' | 'tasksCount' | 'joinedAt'>): Observable<TeamMember> {
    const newMember: TeamMember = {
      ...member,
      id: Date.now().toString(),
      projectsCount: 0,
      tasksCount: 0,
      joinedAt: new Date().toISOString(),
    };
    this.members.push(newMember);
    return of(newMember).pipe(delay(300));
  }

  getMemberStats(): Observable<{ totalMembers: number; activeMembers: number; totalTasks: number; totalProjects: number }> {
    return this.getMembers().pipe(
      map(members => {
        const totalMembers = members.length;
        const activeMembers = members.filter(m => m.status === MemberStatus.ACTIVE).length;
        const totalTasks = members.reduce((sum, m) => sum + m.tasksCount, 0);
        const totalProjects = members.reduce((sum, m) => sum + m.projectsCount, 0);

        return {
          totalMembers,
          activeMembers,
          totalTasks,
          totalProjects,
        };
      })
    );
  }

  updateMember(member: TeamMember): Observable<TeamMember> {
    const index = this.members.findIndex(m => m.id === member.id);
    if (index !== -1) {
      this.members[index] = member;
    }
    return of(this.members[index]).pipe(delay(300));
  }

  removeMember(id: string): Observable<void> {
    this.members = this.members.filter(m => m.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
