import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActivityContactDetailsDetailComponent } from './activity-contact-details-detail.component';

describe('ActivityContactDetails Management Detail Component', () => {
  let comp: ActivityContactDetailsDetailComponent;
  let fixture: ComponentFixture<ActivityContactDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityContactDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ activityContactDetails: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActivityContactDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActivityContactDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load activityContactDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.activityContactDetails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
