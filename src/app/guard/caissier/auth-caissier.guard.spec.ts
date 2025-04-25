import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authCaissierGuard } from './auth-caissier.guard';

describe('authCaissierGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authCaissierGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
