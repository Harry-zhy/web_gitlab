import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActivityImageService } from '../service/activity-image.service';

import { ActivityImageComponent } from './activity-image.component';

describe('ActivityImage Management Component', () => {
  let comp: ActivityImageComponent;
  let fixture: ComponentFixture<ActivityImageComponent>;
  let service: ActivityImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'activity-image', component: ActivityImageComponent }]), HttpClientTestingModule],
      declarations: [ActivityImageComponent],
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
      .overrideTemplate(ActivityImageComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityImageComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActivityImageService);

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
    expect(comp.activityImages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to activityImageService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActivityImageIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActivityImageIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
