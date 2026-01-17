import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Task, TaskStatus } from '../models/task.model';
import { Store } from '@ngrx/store';
import * as ProjectActions from '../../projects/store/project.actions';

/**
 * Task Service
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly store = inject(Store);
  private tasks: Task[] = [];

  getTasks(): Observable<Task[]> {
    return of([...this.tasks]).pipe(delay(300));
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);

    // If task has a projectId, update project progress
    if (newTask.projectId) {
      this.updateProjectProgress(newTask.projectId);
    }

    return of(newTask).pipe(delay(300));
  }

  updateTask(task: Task): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      const oldTask = this.tasks[index];
      this.tasks[index] = { ...task, updatedAt: new Date().toISOString() };

      // If task status changed and it has a projectId, update project progress
      if (oldTask.status !== task.status && task.projectId) {
        this.updateProjectProgress(task.projectId);
      }
    }
    return of(this.tasks[index]).pipe(delay(300));
  }

  deleteTask(id: string): Observable<void> {
    const task = this.tasks.find(t => t.id === id);
    this.tasks = this.tasks.filter(t => t.id !== id);

    // If removed task had a projectId, update project progress
    if (task?.projectId) {
      this.updateProjectProgress(task.projectId);
    }

    return of(undefined).pipe(delay(300));
  }

  private updateProjectProgress(projectId: string): void {
    // Get all tasks for this project
    const projectTasks = this.tasks.filter(t => t.projectId === projectId);
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === TaskStatus.COMPLETED).length;

    // Calculate progress percentage
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Update project progress in the store
    this.store.dispatch(ProjectActions.updateProject({
      project: {
        id: projectId,
        progress: progress,
        updatedAt: new Date().toISOString(),
      } as any
    }));
  }
}
