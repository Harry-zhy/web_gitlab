import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MCQOptionDetailComponent } from './mcq-option-detail.component';

describe('MCQOption Management Detail Component', () => {
  let comp: MCQOptionDetailComponent;
  let fixture: ComponentFixture<MCQOptionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MCQOptionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mCQOption: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MCQOptionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MCQOptionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mCQOption on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mCQOption).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
