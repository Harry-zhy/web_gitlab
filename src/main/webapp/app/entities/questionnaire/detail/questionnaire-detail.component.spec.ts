import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QuestionnaireDetailComponent } from './questionnaire-detail.component';

describe('Questionnaire Management Detail Component', () => {
  let comp: QuestionnaireDetailComponent;
  let fixture: ComponentFixture<QuestionnaireDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionnaireDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ questionnaire: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(QuestionnaireDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(QuestionnaireDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load questionnaire on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.questionnaire).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
