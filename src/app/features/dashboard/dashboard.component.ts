import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectAll } from '../projects/store/project.state';
import { Project, ProjectStatus } from '../projects/models/project.model';
import { TaskService } from '../tasks/services/task.service';
import { TeamService } from '../team/services/team.service';

/**
 * Dashboard Component
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly taskService = inject(TaskService);
  private readonly teamService = inject(TeamService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  projects$: Observable<Project[]> = this.store.select(selectAll);

  stats = signal({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    teamMembers: 0,
    budget: 0,
  });

  tasks = signal<any[]>([]);

  recentActivities = signal<Array<{ type: string; action: string; name: string; time: string; user: string }>>([]);

  ngOnInit(): void {
    // Load tasks and team data
    this.taskService.getTasks().pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.tasks.set(tasks);
      this.updateStats();
    });

    this.teamService.getMembers().pipe(takeUntil(this.destroy$)).subscribe(members => {
      this.updateStats(members.length);
    });

    // Calculate stats from projects in store
    this.projects$.pipe(takeUntil(this.destroy$)).subscribe(projects => {
      this.updateStats(undefined, projects);
    });
  }

  private updateStats(teamMembersCount?: number, projects?: Project[]): void {
    // Get current data from services and store
    let currentProjects: Project[] = [];
    let currentTasks = this.tasks();
    let currentTeamMembers = teamMembersCount || 0;

    // Subscribe to get current projects synchronously
    let subscription = this.projects$.subscribe(p => currentProjects = p);
    subscription.unsubscribe();

    if (projects) {
      currentProjects = projects;
    }

    const totalProjects = currentProjects.length;
    const activeProjects = currentProjects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
    const completedProjects = currentProjects.filter(p => p.status === ProjectStatus.COMPLETED).length;
    const budget = currentProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

    // Update stats
    this.stats.update(currentStats => ({
      ...currentStats,
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks: currentTasks.length,
      teamMembers: currentTeamMembers,
      budget,
    }));

    // Generate recent activities from projects
    const activities = currentProjects
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 4)
      .map(project => ({
        type: 'project',
        action: project.status === ProjectStatus.COMPLETED ? 'completed' :
                project.status === ProjectStatus.PLANNING ? 'created' : 'updated',
        name: project.name,
        time: this.getTimeAgo(project.updatedAt),
        user: project.ownerName,
      }));

    this.recentActivities.set(activities);
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getTimeAgo(date: string): string {
    const now = new Date();
    const updated = new Date(date);
    const diffInMs = now.getTime() - updated.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return updated.toLocaleDateString();
  }

  onNewProject(): void {
    // Navigation will be handled by router link
  }
}