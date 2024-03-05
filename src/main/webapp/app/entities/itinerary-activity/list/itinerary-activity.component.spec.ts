import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItineraryActivityService } from '../service/itinerary-activity.service';

import { ItineraryActivityComponent } from './itinerary-activity.component';

describe('ItineraryActivity Management Component', () => {
  let comp: ItineraryActivityComponent;
  let fixture: ComponentFixture<ItineraryActivityComponent>;
  let service: ItineraryActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'itinerary-activity', component: ItineraryActivityComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ItineraryActivityComponent],
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
      .overrideTemplate(ItineraryActivityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryActivityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItineraryActivityService);

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
    expect(comp.itineraryActivities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itineraryActivityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItineraryActivityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItineraryActivityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
