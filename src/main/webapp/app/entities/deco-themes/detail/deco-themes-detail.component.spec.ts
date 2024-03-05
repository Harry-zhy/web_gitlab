import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DecoThemesDetailComponent } from './deco-themes-detail.component';

describe('DecoThemes Management Detail Component', () => {
  let comp: DecoThemesDetailComponent;
  let fixture: ComponentFixture<DecoThemesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoThemesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ decoThemes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DecoThemesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DecoThemesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load decoThemes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.decoThemes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
