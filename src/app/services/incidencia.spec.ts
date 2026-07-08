import { TestBed } from '@angular/core/testing';

import { IncidenciaService } from './incidencia';

describe('Incidencia', () => {
  let service: IncidenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
