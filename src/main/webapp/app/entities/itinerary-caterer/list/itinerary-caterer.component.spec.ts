import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItineraryCatererService } from '../service/itinerary-caterer.service';

import { ItineraryCatererComponent } from './itinerary-caterer.component';

describe('ItineraryCaterer Management Component', () => {
  let comp: ItineraryCatererComponent;
  let fixture: ComponentFixture<ItineraryCatererComponent>;
  let service: ItineraryCatererService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'itinerary-caterer', component: ItineraryCatererComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ItineraryCatererComponent],
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
      .overrideTemplate(ItineraryCatererComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItineraryCatererComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItineraryCatererService);

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
    expect(comp.itineraryCaterers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to itineraryCatererService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getItineraryCatererIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getItineraryCatererIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
