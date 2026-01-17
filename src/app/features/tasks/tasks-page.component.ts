import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, inject, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from './services/task.service';
import { Task, TaskStatus, TaskPriority } from './models/task.model';
import { CreateTaskModalComponent } from './components/create-task-modal/create-task-modal.component';
import { Subject, takeUntil } from 'rxjs';

/**
 * Tasks Page Component
 */
@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, CreateTaskModalComponent],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPageComponent implements OnInit, OnDestroy {
  private readonly taskService = inject(TaskService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  
  tasks = signal<Task[]>([]);
  showCreateModal = signal(false);
  filterStatus = signal<TaskStatus | 'all'>('all');
  
  // Expose TaskStatus enum to template
  TaskStatus = TaskStatus;

  ngOnInit(): void {
    this.loadTasks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTasks(): void {
    this.taskService.getTasks().pipe(takeUntil(this.destroy$)).subscribe(tasks => {
      this.tasks.set(tasks);
      this.cdr.markForCheck();
    });
  }

  get filteredTasks(): Task[] {
    const status = this.filterStatus();
    const tasks = this.tasks();
    if (status === 'all') {
      return tasks;
    }
    return tasks.filter(t => t.status === status as TaskStatus);
  }

  getStatusCount(status: TaskStatus): number {
    return this.tasks().filter(t => t.status === status).length;
  }

  onTaskCreated(): void {
    this.showCreateModal.set(false);
    this.loadTasks();
  }

  onTaskDeleted(id: string): void {
    this.taskService.deleteTask(id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadTasks();
    });
  }

  onStatusChange(task: Task, newStatus: TaskStatus): void {
    const updatedTask = { ...task, status: newStatus };
    this.taskService.updateTask(updatedTask).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadTasks();
    });
  }

  getStatusClass(status: TaskStatus): string {
    const statusMap: Record<TaskStatus, string> = {
      [TaskStatus.TODO]: 'status-todo',
      [TaskStatus.IN_PROGRESS]: 'status-in-progress',
      [TaskStatus.BLOCKED]: 'status-blocked',
      [TaskStatus.COMPLETED]: 'status-completed',
    };
    return statusMap[status] || '';
  }

  getPriorityClass(priority: TaskPriority): string {
    const priorityMap: Record<TaskPriority, string> = {
      [TaskPriority.LOW]: 'priority-low',
      [TaskPriority.MEDIUM]: 'priority-medium',
      [TaskPriority.HIGH]: 'priority-high',
      [TaskPriority.CRITICAL]: 'priority-critical',
    };
    return priorityMap[priority] || '';
  }
}
