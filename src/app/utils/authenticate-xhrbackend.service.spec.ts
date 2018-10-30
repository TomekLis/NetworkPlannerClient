import { TestBed } from '@angular/core/testing';

import { AuthenticateXHRBackendService } from './authenticate-xhrbackend.service';

describe('AuthenticateXHRBackendService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthenticateXHRBackendService = TestBed.get(AuthenticateXHRBackendService);
    expect(service).toBeTruthy();
  });
});
