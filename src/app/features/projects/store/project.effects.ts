import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { ProjectService } from '../services/project.service';
import * as ProjectActions from './project.actions';

/**
 * Project Effects
 */
@Injectable()
export class ProjectEffects {
  private readonly actions$ = inject(Actions);
  private readonly projectService = inject(ProjectService);

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProjects),
      switchMap(() =>
        this.projectService.getProjects().pipe(
          map((projects) => ProjectActions.loadProjectsSuccess({ projects })),
          catchError((error) =>
            of(ProjectActions.loadProjectsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.createProject),
      mergeMap((action) =>
        this.projectService.createProject(action.project).pipe(
          map((project) => ProjectActions.createProjectSuccess({ project })),
          catchError((error) =>
            of(ProjectActions.createProjectFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.updateProject),
      mergeMap((action) =>
        this.projectService.updateProject(action.project).pipe(
          map((project) => ProjectActions.updateProjectSuccess({ project })),
          catchError((error) =>
            of(ProjectActions.updateProjectFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.deleteProject),
      mergeMap((action) =>
        this.projectService.deleteProject(action.id).pipe(
          map(() => ProjectActions.deleteProjectSuccess({ id: action.id })),
          catchError((error) =>
            of(ProjectActions.deleteProjectFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
