import { TestBed, inject } from '@angular/core/testing';

import { WpAngularService } from './wp-angular.service';

describe('WpAngularService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WpAngularService]
    });
  });

  it('should be created', inject([WpAngularService], (service: WpAngularService) => {
    expect(service).toBeTruthy();
  }));
});
