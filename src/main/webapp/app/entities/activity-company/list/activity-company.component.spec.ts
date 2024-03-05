import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActivityCompanyService } from '../service/activity-company.service';

import { ActivityCompanyComponent } from './activity-company.component';

describe('ActivityCompany Management Component', () => {
  let comp: ActivityCompanyComponent;
  let fixture: ComponentFixture<ActivityCompanyComponent>;
  let service: ActivityCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'activity-company', component: ActivityCompanyComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ActivityCompanyComponent],
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
      .overrideTemplate(ActivityCompanyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityCompanyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActivityCompanyService);

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
    expect(comp.activityCompanies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to activityCompanyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActivityCompanyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActivityCompanyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
