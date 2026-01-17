import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, map } from 'rxjs';
import { Project, ProjectStatus, ProjectPriority } from '../../models/project.model';
import { selectEntities, selectProjectsLoading } from '../../store/project.state';
import * as ProjectActions from '../../store/project.actions';

/**
 * Project Detail Component
 */
@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  project$!: Observable<Project | undefined>;
  projectId!: string;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';

    if (this.projectId) {
      // Check if project exists in store, if not, load from service
      this.store.select(selectEntities).pipe(
        takeUntil(this.destroy$)
      ).subscribe(entities => {
        const project = entities[this.projectId];
        if (!project) {
          this.store.dispatch(ProjectActions.loadProjects());
        }
      });

      this.store.dispatch(ProjectActions.selectProject({ id: this.projectId }));

      // Create observable for template
      this.project$ = this.store.select(selectEntities).pipe(
        map(entities => entities[this.projectId]),
        takeUntil(this.destroy$)
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStatusClass(status: ProjectStatus): string {
    const statusMap: Record<ProjectStatus, string> = {
      [ProjectStatus.PLANNING]: 'status-planning',
      [ProjectStatus.IN_PROGRESS]: 'status-in-progress',
      [ProjectStatus.ON_HOLD]: 'status-on-hold',
      [ProjectStatus.COMPLETED]: 'status-completed',
      [ProjectStatus.CANCELLED]: 'status-cancelled',
    };
    return statusMap[status] || '';
  }

  getPriorityClass(priority: ProjectPriority): string {
    const priorityMap: Record<ProjectPriority, string> = {
      [ProjectPriority.LOW]: 'priority-low',
      [ProjectPriority.MEDIUM]: 'priority-medium',
      [ProjectPriority.HIGH]: 'priority-high',
      [ProjectPriority.CRITICAL]: 'priority-critical',
    };
    return priorityMap[priority] || '';
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.store.dispatch(ProjectActions.deleteProject({ id: this.projectId }));
      this.router.navigate(['/projects']);
    }
  }

  onEdit(): void {
    this.router.navigate(['/projects', this.projectId, 'edit']);
  }
}
