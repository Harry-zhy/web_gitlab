import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MockVenueEntityService } from '../service/mock-venue-entity.service';

import { MockVenueEntityComponent } from './mock-venue-entity.component';

describe('MockVenueEntity Management Component', () => {
  let comp: MockVenueEntityComponent;
  let fixture: ComponentFixture<MockVenueEntityComponent>;
  let service: MockVenueEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'mock-venue-entity', component: MockVenueEntityComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [MockVenueEntityComponent],
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
      .overrideTemplate(MockVenueEntityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MockVenueEntityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MockVenueEntityService);

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
    expect(comp.mockVenueEntities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mockVenueEntityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMockVenueEntityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMockVenueEntityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
