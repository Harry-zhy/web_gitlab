import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AdsManagementService } from '../service/ads-management.service';

import { AdsManagementComponent } from './ads-management.component';

describe('AdsManagement Management Component', () => {
  let comp: AdsManagementComponent;
  let fixture: ComponentFixture<AdsManagementComponent>;
  let service: AdsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'ads-management', component: AdsManagementComponent }]), HttpClientTestingModule],
      declarations: [AdsManagementComponent],
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
      .overrideTemplate(AdsManagementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AdsManagementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AdsManagementService);

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
    expect(comp.adsManagements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to adsManagementService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAdsManagementIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAdsManagementIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
