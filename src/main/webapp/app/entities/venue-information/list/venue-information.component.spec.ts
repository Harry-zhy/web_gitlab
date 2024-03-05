import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { VenueInformationService } from '../service/venue-information.service';

import { VenueInformationComponent } from './venue-information.component';

describe('VenueInformation Management Component', () => {
  let comp: VenueInformationComponent;
  let fixture: ComponentFixture<VenueInformationComponent>;
  let service: VenueInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'venue-information', component: VenueInformationComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [VenueInformationComponent],
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
      .overrideTemplate(VenueInformationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VenueInformationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VenueInformationService);

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
    expect(comp.venueInformations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to venueInformationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getVenueInformationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getVenueInformationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
