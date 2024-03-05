import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IntroDetailComponent } from './intro-detail.component';

describe('Intro Management Detail Component', () => {
  let comp: IntroDetailComponent;
  let fixture: ComponentFixture<IntroDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntroDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ intro: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IntroDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IntroDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load intro on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.intro).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
