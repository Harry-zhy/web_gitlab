import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MockCatererEntityService } from '../service/mock-caterer-entity.service';

import { MockCatererEntityComponent } from './mock-caterer-entity.component';

describe('MockCatererEntity Management Component', () => {
  let comp: MockCatererEntityComponent;
  let fixture: ComponentFixture<MockCatererEntityComponent>;
  let service: MockCatererEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'mock-caterer-entity', component: MockCatererEntityComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [MockCatererEntityComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MockCatererEntityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MockCatererEntityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MockCatererEntityService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.mockCatererEntities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mockCatererEntityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMockCatererEntityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMockCatererEntityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
