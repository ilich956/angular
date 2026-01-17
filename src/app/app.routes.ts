import { Routes } from '@angular/router';

/**
 * Application Routes
 * All feature modules are lazy-loaded for optimal performance
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/components/project-list/project-list.component').then(
        (m) => m.ProjectListComponent
      ),
  },
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./features/projects/components/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent
      ),
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/tasks-page.component').then(
        (m) => m.TasksPageComponent
      ),
  },
  {
    path: 'team',
    loadComponent: () =>
      import('./features/team/team-page.component').then(
        (m) => m.TeamPageComponent
      ),
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./features/analytics/analytics-page.component').then(
        (m) => m.AnalyticsPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
