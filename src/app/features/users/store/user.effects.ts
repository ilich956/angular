import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, delay } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import * as UserActions from './user.actions';

/**
 * User Effects
 * Module 1: NgRx Effects for side effects
 * 
 * Handles async operations like API calls
 */
@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);

  /**
   * Load users effect
   */
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      switchMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UserActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Add user effect
   */
  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      switchMap((action) =>
        this.userService.createUser(action.user).pipe(
          map((user) => UserActions.addUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.addUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Update user effect
   */
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      switchMap((action) =>
        this.userService.updateUser(action.user).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) =>
            of(UserActions.updateUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /**
   * Delete user effect
   */
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      switchMap((action) =>
        this.userService.deleteUser(action.id).pipe(
          map(() => UserActions.deleteUserSuccess({ id: action.id })),
          catchError((error) =>
            of(UserActions.deleteUserFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
