import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OneFeedbackDetailComponent } from './one-feedback-detail.component';

describe('OneFeedback Management Detail Component', () => {
  let comp: OneFeedbackDetailComponent;
  let fixture: ComponentFixture<OneFeedbackDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OneFeedbackDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ oneFeedback: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OneFeedbackDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OneFeedbackDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load oneFeedback on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.oneFeedback).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
