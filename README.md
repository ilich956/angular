# ProjectFlow

**ProjectFlow** is an enterprise-grade project management platform built with Angular. It provides comprehensive tools for managing projects, tasks, team collaboration, and analytics.

## Features

-  **Project Management** - Create, track, and manage projects with detailed information
-  **Dashboard** - Real-time overview of projects, tasks, and team activity
-  **Team Collaboration** - Manage team members and assignments
-  **Analytics** - Insights and reporting capabilities
-  **Security** - Built-in XSS and CSRF protection
-  **Performance** - Optimized with OnPush change detection and lazy loading

## Technology Stack

- **Angular 18** - Latest Angular framework with standalone components
- **NgRx** - State management with Entity Adapter
- **RxJS** - Reactive programming patterns
- **TypeScript** - Type-safe development
- **SCSS** - Styled components
- **Playwright** - E2E testing

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 8.x or higher

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200`

### Build

```bash
npm run build
```

### Running Tests

#### Unit Tests
```bash
npm test
```

#### E2E Tests
```bash
npm run e2e
```

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── interceptors/        # HTTP interceptors
│   │   ├── services/            # Core services (API, Error, Security)
│   │   ├── store/               # NgRx root store
│   │   └── providers/           # DI providers
│   ├── features/                # Feature modules
│   │   ├── projects/            # Project management
│   │   ├── dashboard/           # Dashboard
│   │   ├── tasks/               # Task management
│   │   ├── team/                # Team management
│   │   └── analytics/           # Analytics and reports
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
└── environments/
```

## Architecture

The application follows modern Angular best practices:

- **Standalone Components** - All components are standalone for better tree-shaking
- **Lazy Loading** - Routes are lazy-loaded for optimal performance
- **OnPush Strategy** - Change detection optimization
- **NgRx Store** - Centralized state management
- **Type-Safe Services** - Full TypeScript coverage
- **Modular Structure** - Feature-based organization

## Security

- XSS protection with DOMPurify
- CSRF token handling
- HTTP interceptors for security
- Input sanitization

## Performance Optimizations

- OnPush change detection strategy
- Lazy loading routes
- Track-by functions in *ngFor
- Signal-based reactivity
- Observable caching with ShareReplay

## CI/CD

The project includes GitHub Actions workflow for:
- Automated testing
- Build verification
- E2E test execution
- Deployment preparation
