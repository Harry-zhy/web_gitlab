import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BusinessInformationService } from '../service/business-information.service';

import { BusinessInformationComponent } from './business-information.component';

describe('BusinessInformation Management Component', () => {
  let comp: BusinessInformationComponent;
  let fixture: ComponentFixture<BusinessInformationComponent>;
  let service: BusinessInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'business-information', component: BusinessInformationComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [BusinessInformationComponent],
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
      .overrideTemplate(BusinessInformationComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BusinessInformationComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BusinessInformationService);

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
    expect(comp.businessInformations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to businessInformationService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBusinessInformationIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBusinessInformationIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
