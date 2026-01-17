import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Project } from '../models/project.model';

/**
 * Project Service
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly apiService = inject(ApiService);
  private projects: Project[] = [];

  getProjects(): Observable<Project[]> {
    // Return stored projects or empty array
    return of([...this.projects]).pipe(delay(300));
  }

  getProjectById(id: string): Observable<Project> {
    const project = this.projects.find(p => p.id === id);
    if (project) {
      return of(project).pipe(delay(300));
    }
    return of({} as Project).pipe(delay(300)); // Should handle error properly
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Observable<Project> {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Store locally for persistence across navigation
    this.projects.push(newProject);
    return of(newProject).pipe(delay(500));
  }

  updateProject(project: Partial<Project> & { id: string }): Observable<Project> {
    console.log('ProjectService: updating project', project);
    const index = this.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...project, updatedAt: new Date().toISOString() };
      console.log('ProjectService: updated project', this.projects[index]);
      return of(this.projects[index]).pipe(delay(300));
    }
    console.log('ProjectService: project not found with id', project.id);
    return of({} as Project).pipe(delay(300)); // Should handle error properly
  }

  deleteProject(id: string): Observable<void> {
    this.projects = this.projects.filter(p => p.id !== id);
    return of(undefined).pipe(delay(300));
  }
}
