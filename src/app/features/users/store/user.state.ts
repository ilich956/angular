import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { User } from '../models/user.model';
import * as UserActions from './user.actions';
import { AppState } from '../../../core/store/app.state';

/**
 * User Entity State
 * Module 1: NgRx State Management using Entity Adapter
 */
export interface UserState extends EntityState<User> {
  selectedUserId: number | null;
  loading: boolean;
  error: string | null;
  filters: {
    role: string | null;
    search: string | null;
  };
}

export const userAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id,
  sortComparer: (a: User, b: User) => a.name.localeCompare(b.name),
});

export const initialState: UserState = userAdapter.getInitialState({
  selectedUserId: null,
  loading: false,
  error: null,
  filters: {
    role: null,
    search: null,
  },
});

export const userReducer = createReducer(
  initialState,
  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) =>
    userAdapter.setAll(users, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Add User
  on(UserActions.addUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.addUserSuccess, (state, { user }) =>
    userAdapter.addOne(user, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(UserActions.addUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.updateUserSuccess, (state, { user }) =>
    userAdapter.updateOne(
      { id: user.id, changes: user },
      {
        ...state,
        loading: false,
        error: null,
      }
    )
  ),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.deleteUserSuccess, (state, { id }) =>
    userAdapter.removeOne(id, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Select User
  on(UserActions.selectUser, (state, { id }) => ({
    ...state,
    selectedUserId: id,
  })),
  
  // Set Filters
  on(UserActions.setFilters, (state, { filters }) => ({
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
} = userAdapter.getSelectors((state: AppState) => state.users);

export const selectSelectedUserId = (state: AppState) => state.users.selectedUserId;
export const selectUsersLoading = (state: AppState) => state.users.loading;
export const selectUsersError = (state: AppState) => state.users.error;
export const selectUsersFilters = (state: AppState) => state.users.filters;
