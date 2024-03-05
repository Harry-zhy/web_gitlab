import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EventItineraryService } from '../service/event-itinerary.service';

import { EventItineraryComponent } from './event-itinerary.component';

describe('EventItinerary Management Component', () => {
  let comp: EventItineraryComponent;
  let fixture: ComponentFixture<EventItineraryComponent>;
  let service: EventItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'event-itinerary', component: EventItineraryComponent }]), HttpClientTestingModule],
      declarations: [EventItineraryComponent],
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
      .overrideTemplate(EventItineraryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EventItineraryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EventItineraryService);

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
    expect(comp.eventItineraries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to eventItineraryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getEventItineraryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getEventItineraryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
