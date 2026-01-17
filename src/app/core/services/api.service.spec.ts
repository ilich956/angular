import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

/**
 * API Service Unit Tests
 * Module 4: Unit Testing
 */
describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make GET request', (done) => {
    const mockData = { data: { id: 1, name: 'Test' }, status: 200 };
    
    service.get<any>('test').subscribe((data) => {
      expect(data).toEqual(mockData.data);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should make POST request', (done) => {
    const mockPayload = { name: 'Test' };
    const mockResponse = { data: { id: 1, ...mockPayload }, status: 201 };
    
    service.post<any>('test', mockPayload).subscribe((data) => {
      expect(data).toEqual(mockResponse.data);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });
});
