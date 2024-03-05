import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BusinessInformationDetailComponent } from './business-information-detail.component';

describe('BusinessInformation Management Detail Component', () => {
  let comp: BusinessInformationDetailComponent;
  let fixture: ComponentFixture<BusinessInformationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessInformationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ businessInformation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BusinessInformationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BusinessInformationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load businessInformation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.businessInformation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
