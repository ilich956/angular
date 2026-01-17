import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskStatus, TaskPriority } from '../../models/task.model';
import { Store } from '@ngrx/store';
import { selectAll } from '../../../projects/store/project.state';
import { take } from 'rxjs/operators';

/**
 * Create Task Modal Component
 */
@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-task-modal.component.html',
  styleUrl: '../../../projects/components/create-project-modal/create-project-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly store = inject(Store);

  close = output<void>();
  taskCreated = output<void>();

  taskForm: FormGroup;
  isSubmitting = signal(false);
  projects$ = this.store.select(selectAll);

  statuses = Object.values(TaskStatus);
  priorities = Object.values(TaskPriority);

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [TaskStatus.TODO, Validators.required],
      priority: [TaskPriority.MEDIUM, Validators.required],
      projectId: [''],
      assigneeName: [''],
      dueDate: [''],
      tags: [''],
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.isSubmitting.set(true);
      
      const formValue = this.taskForm.value;
      const tags = formValue.tags
        ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : [];

      const task: Omit<any, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formValue.title,
        description: formValue.description || '',
        status: formValue.status,
        priority: formValue.priority,
        projectId: formValue.projectId || undefined,
        projectName: undefined, // Will be resolved from projectId
        assigneeName: formValue.assigneeName || undefined,
        dueDate: formValue.dueDate || undefined,
        tags,
      };

      // Resolve project name if projectId is provided
      if (formValue.projectId) {
        this.projects$.pipe(take(1)).subscribe(projects => {
          const project = projects.find(p => p.id === formValue.projectId);
          if (project) {
            task['projectName'] = project.name;
          }
          
          this.taskService.createTask(task).subscribe(() => {
            this.isSubmitting.set(false);
            this.taskCreated.emit();
            this.taskForm.reset();
          });
        });
      } else {
        this.taskService.createTask(task).subscribe(() => {
          this.isSubmitting.set(false);
          this.taskCreated.emit();
          this.taskForm.reset();
        });
      }
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
