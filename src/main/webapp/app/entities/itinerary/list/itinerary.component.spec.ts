import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItineraryService } from '../service/itinerary.service';

import { ItineraryComponent } from './itinerary.component';

describe('Itinerary Management Component', () => {
  let comp: ItineraryComponent;
  let fixture: ComponentFixture<ItineraryComponent>;
  let service: ItineraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'itinerary', component: ItineraryComponent }]), HttpClientTestingModule],
      declarations: [ItineraryComponent],
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
      .overrideTemplate(ItineraryComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItineraryService);

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
    expect(comp.itineraries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itineraryService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItineraryIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItineraryIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
