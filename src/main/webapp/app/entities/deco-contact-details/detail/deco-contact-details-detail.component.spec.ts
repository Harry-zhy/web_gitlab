import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DecoContactDetailsDetailComponent } from './deco-contact-details-detail.component';

describe('DecoContactDetails Management Detail Component', () => {
  let comp: DecoContactDetailsDetailComponent;
  let fixture: ComponentFixture<DecoContactDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoContactDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ decoContactDetails: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DecoContactDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DecoContactDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load decoContactDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.decoContactDetails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
