import { createAction, props } from '@ngrx/store';
import { Project, ProjectFilters } from '../models/project.model';

/**
 * Project Actions
 */
export const loadProjects = createAction('[Project] Load Projects');
export const loadProjectsSuccess = createAction(
  '[Project] Load Projects Success',
  props<{ projects: Project[] }>()
);
export const loadProjectsFailure = createAction(
  '[Project] Load Projects Failure',
  props<{ error: string }>()
);

export const createProject = createAction(
  '[Project] Create Project',
  props<{ project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> }>()
);
export const createProjectSuccess = createAction(
  '[Project] Create Project Success',
  props<{ project: Project }>()
);
export const createProjectFailure = createAction(
  '[Project] Create Project Failure',
  props<{ error: string }>()
);

export const updateProject = createAction(
  '[Project] Update Project',
  props<{ project: Project }>()
);
export const updateProjectSuccess = createAction(
  '[Project] Update Project Success',
  props<{ project: Project }>()
);
export const updateProjectFailure = createAction(
  '[Project] Update Project Failure',
  props<{ error: string }>()
);

export const deleteProject = createAction(
  '[Project] Delete Project',
  props<{ id: string }>()
);
export const deleteProjectSuccess = createAction(
  '[Project] Delete Project Success',
  props<{ id: string }>()
);
export const deleteProjectFailure = createAction(
  '[Project] Delete Project Failure',
  props<{ error: string }>()
);

export const selectProject = createAction(
  '[Project] Select Project',
  props<{ id: string }>()
);

export const setFilters = createAction(
  '[Project] Set Filters',
  props<{ filters: Partial<ProjectFilters> }>()
);
