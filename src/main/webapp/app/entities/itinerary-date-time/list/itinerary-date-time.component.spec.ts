import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItineraryDateTimeService } from '../service/itinerary-date-time.service';

import { ItineraryDateTimeComponent } from './itinerary-date-time.component';

describe('ItineraryDateTime Management Component', () => {
  let comp: ItineraryDateTimeComponent;
  let fixture: ComponentFixture<ItineraryDateTimeComponent>;
  let service: ItineraryDateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'itinerary-date-time', component: ItineraryDateTimeComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ItineraryDateTimeComponent],
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
      .overrideTemplate(ItineraryDateTimeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryDateTimeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItineraryDateTimeService);

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
    expect(comp.itineraryDateTimes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itineraryDateTimeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItineraryDateTimeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItineraryDateTimeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
