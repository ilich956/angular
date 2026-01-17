import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAll } from '../projects/store/project.state';
import { Project, ProjectStatus } from '../projects/models/project.model';
import { TaskService } from '../tasks/services/task.service';
import { TaskStatus, Task } from '../tasks/models/task.model';
import { Subject, takeUntil } from 'rxjs';

/**
 * Analytics Page Component
 */
@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics-page.component.html',
  styleUrl: './analytics-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsPageComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly taskService = inject(TaskService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  projects$ = this.store.select(selectAll);
  tasks = signal<Task[]>([]);

  stats = signal({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalBudget: 0,
    spentBudget: 0,
  });

  ngOnInit(): void {
    // Load tasks
    this.taskService.getTasks().pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.tasks.set(tasks);
      this.calculateStats();
    });

    // Calculate stats from projects
    this.projects$.pipe(takeUntil(this.destroy$)).subscribe(projects => {
      this.calculateStats(projects);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  calculateStats(projects: Project[] = []): void {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
    const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const spentBudget = projects.reduce((sum, p) => sum + (p.spent || 0), 0);

    const tasks = this.tasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;

    this.stats.set({
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      totalBudget,
      spentBudget,
    });
    
    this.cdr.markForCheck();
  }

  get completionRate(): number {
    const stats = this.stats();
    if (stats.totalProjects === 0) return 0;
    return Math.round((stats.completedProjects / stats.totalProjects) * 100);
  }

  get taskCompletionRate(): number {
    const stats = this.stats();
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  }

  get budgetUsage(): number {
    const stats = this.stats();
    if (stats.totalBudget === 0) return 0;
    return Math.round((stats.spentBudget / stats.totalBudget) * 100);
  }
}
