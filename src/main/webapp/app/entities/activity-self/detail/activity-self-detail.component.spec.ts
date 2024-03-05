import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActivitySelfDetailComponent } from './activity-self-detail.component';

describe('ActivitySelf Management Detail Component', () => {
  let comp: ActivitySelfDetailComponent;
  let fixture: ComponentFixture<ActivitySelfDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitySelfDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ activitySelf: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActivitySelfDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActivitySelfDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load activitySelf on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.activitySelf).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
