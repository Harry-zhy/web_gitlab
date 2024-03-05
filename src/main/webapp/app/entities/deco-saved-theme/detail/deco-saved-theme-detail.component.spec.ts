import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DecoSavedThemeDetailComponent } from './deco-saved-theme-detail.component';

describe('DecoSavedTheme Management Detail Component', () => {
  let comp: DecoSavedThemeDetailComponent;
  let fixture: ComponentFixture<DecoSavedThemeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoSavedThemeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ decoSavedTheme: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DecoSavedThemeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DecoSavedThemeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load decoSavedTheme on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.decoSavedTheme).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
