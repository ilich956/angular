import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Project, ProjectStatus, ProjectPriority } from '../../models/project.model';
import * as ProjectActions from '../../store/project.actions';
import { take } from 'rxjs/operators';

/**
 * Create Project Modal Component
 */
@Component({
  selector: 'app-create-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project-modal.component.html',
  styleUrl: './create-project-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  close = output<void>();
  projectCreated = output<void>();

  projectForm: FormGroup;
  isSubmitting = signal(false);

  statuses = Object.values(ProjectStatus);
  priorities = Object.values(ProjectPriority);

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      status: [ProjectStatus.PLANNING, Validators.required],
      priority: [ProjectPriority.MEDIUM, Validators.required],
      startDate: [new Date().toISOString().split('T')[0], Validators.required],
      endDate: [''],
      budget: [0, [Validators.min(0)]],
      tags: [''],
    });
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isSubmitting.set(true);
      
      const formValue = this.projectForm.value;
      const tags = formValue.tags
        ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : [];

      const project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formValue.name,
        description: formValue.description,
        status: formValue.status,
        priority: formValue.priority,
        startDate: formValue.startDate,
        endDate: formValue.endDate || undefined,
        budget: formValue.budget || undefined,
        spent: 0,
        progress: 0,
        ownerId: '1',
        ownerName: 'Current User',
        teamMembers: [],
        tags,
      };

      this.store.dispatch(ProjectActions.createProject({ project }));

      // Project will be added to store by effect, wait a bit for effect to complete
      setTimeout(() => {
        this.isSubmitting.set(false);
        this.projectCreated.emit();
        this.projectForm.reset();
      }, 500);
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
