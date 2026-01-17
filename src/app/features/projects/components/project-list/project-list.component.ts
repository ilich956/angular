import { Component, OnInit, ChangeDetectionStrategy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Project } from '../../models/project.model';
import { selectAll, selectProjectsLoading, selectProjectsError } from '../../store/project.state';
import * as ProjectActions from '../../store/project.actions';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CreateProjectModalComponent } from '../create-project-modal/create-project-modal.component';

/**
 * Project List Component
 */
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent, CreateProjectModalComponent],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);

  projects$: Observable<Project[]> = this.store.select(selectAll);
  loading$: Observable<boolean> = this.store.select(selectProjectsLoading);
  error$: Observable<string | null> = this.store.select(selectProjectsError);
  
  showCreateModal = signal(false);

  ngOnInit(): void {
    this.loadProjects();

    // Subscribe to projects changes to force re-rendering
    this.projects$.subscribe(projects => {
      this.cdr.markForCheck(); // Force change detection
    });
  }

  loadProjects(): void {
    this.store.dispatch(ProjectActions.loadProjects());
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  onProjectCreated(): void {
    this.closeCreateModal();
    console.log('Project created event received');
    // No need to reload - project should be added to store by effect
    // this.loadProjects();
  }
}
