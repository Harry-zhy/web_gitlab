import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DecoContactDetailsService } from '../service/deco-contact-details.service';

import { DecoContactDetailsComponent } from './deco-contact-details.component';

describe('DecoContactDetails Management Component', () => {
  let comp: DecoContactDetailsComponent;
  let fixture: ComponentFixture<DecoContactDetailsComponent>;
  let service: DecoContactDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'deco-contact-details', component: DecoContactDetailsComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [DecoContactDetailsComponent],
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
      .overrideTemplate(DecoContactDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoContactDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DecoContactDetailsService);

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
    expect(comp.decoContactDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to decoContactDetailsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDecoContactDetailsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDecoContactDetailsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
