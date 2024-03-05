import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DecoCompanyDetailComponent } from './deco-company-detail.component';

describe('DecoCompany Management Detail Component', () => {
  let comp: DecoCompanyDetailComponent;
  let fixture: ComponentFixture<DecoCompanyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoCompanyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ decoCompany: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DecoCompanyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DecoCompanyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load decoCompany on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.decoCompany).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
