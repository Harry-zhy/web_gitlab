import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DecoBudgetDetailComponent } from './deco-budget-detail.component';

describe('DecoBudget Management Detail Component', () => {
  let comp: DecoBudgetDetailComponent;
  let fixture: ComponentFixture<DecoBudgetDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoBudgetDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ decoBudget: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DecoBudgetDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DecoBudgetDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load decoBudget on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.decoBudget).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
