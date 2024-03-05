import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActivitySavedService } from '../service/activity-saved.service';

import { ActivitySavedComponent } from './activity-saved.component';

describe('ActivitySaved Management Component', () => {
  let comp: ActivitySavedComponent;
  let fixture: ComponentFixture<ActivitySavedComponent>;
  let service: ActivitySavedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'activity-saved', component: ActivitySavedComponent }]), HttpClientTestingModule],
      declarations: [ActivitySavedComponent],
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
      .overrideTemplate(ActivitySavedComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivitySavedComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActivitySavedService);

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
    expect(comp.activitySaveds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to activitySavedService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActivitySavedIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActivitySavedIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
