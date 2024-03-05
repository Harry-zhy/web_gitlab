import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActivityIdeaDetailComponent } from './activity-idea-detail.component';

describe('ActivityIdea Management Detail Component', () => {
  let comp: ActivityIdeaDetailComponent;
  let fixture: ComponentFixture<ActivityIdeaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityIdeaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ activityIdea: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActivityIdeaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActivityIdeaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load activityIdea on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.activityIdea).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
