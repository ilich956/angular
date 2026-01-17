import { Component, Input, ChangeDetectionStrategy, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Project, ProjectStatus, ProjectPriority } from '../../models/project.model';

/**
 * Project Card Component
 */
@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent implements OnChanges {
  @Input({ required: true }) project!: Project;
  private readonly router = inject(Router);

  ngOnChanges(changes: SimpleChanges): void {
    // Component will re-render when project input changes
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

  onCardClick(): void {
    this.router.navigate(['/projects', this.project.id]);
  }
}
