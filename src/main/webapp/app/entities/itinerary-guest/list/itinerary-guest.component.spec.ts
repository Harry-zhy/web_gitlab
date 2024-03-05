import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItineraryGuestService } from '../service/itinerary-guest.service';

import { ItineraryGuestComponent } from './itinerary-guest.component';

describe('ItineraryGuest Management Component', () => {
  let comp: ItineraryGuestComponent;
  let fixture: ComponentFixture<ItineraryGuestComponent>;
  let service: ItineraryGuestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'itinerary-guest', component: ItineraryGuestComponent }]), HttpClientTestingModule],
      declarations: [ItineraryGuestComponent],
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
      .overrideTemplate(ItineraryGuestComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryGuestComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItineraryGuestService);

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
    expect(comp.itineraryGuests?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itineraryGuestService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItineraryGuestIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItineraryGuestIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
