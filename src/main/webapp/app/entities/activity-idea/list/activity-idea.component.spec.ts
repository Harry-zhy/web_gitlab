import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ActivityIdeaService } from '../service/activity-idea.service';

import { ActivityIdeaComponent } from './activity-idea.component';

describe('ActivityIdea Management Component', () => {
  let comp: ActivityIdeaComponent;
  let fixture: ComponentFixture<ActivityIdeaComponent>;
  let service: ActivityIdeaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'activity-idea', component: ActivityIdeaComponent }]), HttpClientTestingModule],
      declarations: [ActivityIdeaComponent],
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
      .overrideTemplate(ActivityIdeaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityIdeaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ActivityIdeaService);

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
    expect(comp.activityIdeas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to activityIdeaService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getActivityIdeaIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getActivityIdeaIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
