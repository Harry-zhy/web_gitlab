import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItineraryVenueService } from '../service/itinerary-venue.service';

import { ItineraryVenueComponent } from './itinerary-venue.component';

describe('ItineraryVenue Management Component', () => {
  let comp: ItineraryVenueComponent;
  let fixture: ComponentFixture<ItineraryVenueComponent>;
  let service: ItineraryVenueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'itinerary-venue', component: ItineraryVenueComponent }]), HttpClientTestingModule],
      declarations: [ItineraryVenueComponent],
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
      .overrideTemplate(ItineraryVenueComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryVenueComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItineraryVenueService);

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
    expect(comp.itineraryVenues?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itineraryVenueService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItineraryVenueIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItineraryVenueIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
