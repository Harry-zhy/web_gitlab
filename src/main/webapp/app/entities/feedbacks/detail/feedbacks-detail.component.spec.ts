import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FeedbacksDetailComponent } from './feedbacks-detail.component';

describe('Feedbacks Management Detail Component', () => {
  let comp: FeedbacksDetailComponent;
  let fixture: ComponentFixture<FeedbacksDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbacksDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ feedbacks: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FeedbacksDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FeedbacksDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load feedbacks on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.feedbacks).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
