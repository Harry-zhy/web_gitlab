import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActivitySavedDetailComponent } from './activity-saved-detail.component';

describe('ActivitySaved Management Detail Component', () => {
  let comp: ActivitySavedDetailComponent;
  let fixture: ComponentFixture<ActivitySavedDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivitySavedDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ activitySaved: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActivitySavedDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActivitySavedDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load activitySaved on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.activitySaved).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
