import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActivityContactDetailsService } from '../service/activity-contact-details.service';

import { ActivityContactDetailsComponent } from './activity-contact-details.component';

describe('ActivityContactDetails Management Component', () => {
  let comp: ActivityContactDetailsComponent;
  let fixture: ComponentFixture<ActivityContactDetailsComponent>;
  let service: ActivityContactDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'activity-contact-details', component: ActivityContactDetailsComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [ActivityContactDetailsComponent],
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
      .overrideTemplate(ActivityContactDetailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityContactDetailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActivityContactDetailsService);

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
    expect(comp.activityContactDetails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to activityContactDetailsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActivityContactDetailsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActivityContactDetailsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
