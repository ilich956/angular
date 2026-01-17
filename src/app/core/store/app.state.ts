import { routerReducer, RouterState } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { projectReducer } from '../../features/projects/store/project.state';

// Root state interface
export interface AppState {
  router: RouterState;
  projects: ReturnType<typeof projectReducer>;
}

// Root reducers
export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  projects: projectReducer,
};

// Meta reducers for logging in development
export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? []
  : [];
