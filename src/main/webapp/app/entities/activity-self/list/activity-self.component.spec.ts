import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActivitySelfService } from '../service/activity-self.service';

import { ActivitySelfComponent } from './activity-self.component';

describe('ActivitySelf Management Component', () => {
  let comp: ActivitySelfComponent;
  let fixture: ComponentFixture<ActivitySelfComponent>;
  let service: ActivitySelfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'activity-self', component: ActivitySelfComponent }]), HttpClientTestingModule],
      declarations: [ActivitySelfComponent],
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
      .overrideTemplate(ActivitySelfComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivitySelfComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActivitySelfService);

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
    expect(comp.activitySelves?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to activitySelfService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActivitySelfIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActivitySelfIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
