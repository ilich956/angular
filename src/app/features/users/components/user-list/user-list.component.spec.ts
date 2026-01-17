import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UserListComponent } from './user-list.component';
import { provideRouter } from '@angular/router';
import { User } from '../../models/user.model';
import * as UserActions from '../../store/user.actions';

/**
 * User List Component Unit Tests
 * Module 4: Unit Testing
 */
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let store: MockStore;
  const initialState = {
    users: {
      ids: [],
      entities: {},
      selectedUserId: null,
      loading: false,
      error: null,
      filters: { role: null, search: null },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        provideMockStore({ initialState }),
        provideRouter([]),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadUsers action on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.loadUsers());
  });

  it('should dispatch loadUsers action on refresh', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.onRefresh();
    expect(dispatchSpy).toHaveBeenCalledWith(UserActions.loadUsers());
  });

  it('should select users from store', (done) => {
    const mockUsers: User[] = [
      { id: 1, name: 'Test User', email: 'test@example.com', role: 'user' as any, createdAt: new Date().toISOString() },
    ];
    
    store.setState({
      users: {
        ids: [1],
        entities: { 1: mockUsers[0] },
        selectedUserId: null,
        loading: false,
        error: null,
        filters: { role: null, search: null },
      },
    });

    component.users$.subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users[0].name).toBe('Test User');
      done();
    });
  });
});
