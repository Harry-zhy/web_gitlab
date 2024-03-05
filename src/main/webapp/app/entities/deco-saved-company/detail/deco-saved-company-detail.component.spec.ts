import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DecoSavedCompanyDetailComponent } from './deco-saved-company-detail.component';

describe('DecoSavedCompany Management Detail Component', () => {
  let comp: DecoSavedCompanyDetailComponent;
  let fixture: ComponentFixture<DecoSavedCompanyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoSavedCompanyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ decoSavedCompany: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DecoSavedCompanyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DecoSavedCompanyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load decoSavedCompany on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.decoSavedCompany).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
