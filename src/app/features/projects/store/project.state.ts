import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Project } from '../models/project.model';
import * as ProjectActions from './project.actions';
import { AppState } from '../../../core/store/app.state';

/**
 * Project Entity State
 */
export interface ProjectState extends EntityState<Project> {
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    priority: string | null;
    search: string | null;
  };
}

export const projectAdapter: EntityAdapter<Project> = createEntityAdapter<Project>({
  selectId: (project: Project) => project.id,
  sortComparer: (a: Project, b: Project) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
});

export const initialState: ProjectState = projectAdapter.getInitialState({
  selectedProjectId: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    priority: null,
    search: null,
  },
});

export const projectReducer = createReducer(
  initialState,
  on(ProjectActions.loadProjects, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectActions.loadProjectsSuccess, (state, { projects }) =>
    projectAdapter.setAll(projects, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(ProjectActions.loadProjectsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  on(ProjectActions.createProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectActions.createProjectSuccess, (state, { project }) =>
    projectAdapter.addOne(project, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(ProjectActions.createProjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  on(ProjectActions.updateProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectActions.updateProjectSuccess, (state, { project }) =>
    projectAdapter.updateOne(
      { id: project.id, changes: project },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(ProjectActions.updateProjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  on(ProjectActions.deleteProject, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProjectActions.deleteProjectSuccess, (state, { id }) =>
    projectAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(ProjectActions.deleteProjectFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  on(ProjectActions.selectProject, (state, { id }) => ({
    ...state,
    selectedProjectId: id,
  })),
  
  on(ProjectActions.setFilters, (state, { filters }) => ({
    ...state,
    filters: {
      ...state.filters,
      ...filters,
    },
  }))
);

// Selectors
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = projectAdapter.getSelectors((state: AppState) => state.projects);

export const selectSelectedProjectId = (state: AppState) => state.projects.selectedProjectId;
export const selectProjectsLoading = (state: AppState) => state.projects.loading;
export const selectProjectsError = (state: AppState) => state.projects.error;
export const selectProjectsFilters = (state: AppState) => state.projects.filters;
