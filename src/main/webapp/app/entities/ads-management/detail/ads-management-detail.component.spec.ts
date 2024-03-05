import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AdsManagementDetailComponent } from './ads-management-detail.component';

describe('AdsManagement Management Detail Component', () => {
  let comp: AdsManagementDetailComponent;
  let fixture: ComponentFixture<AdsManagementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdsManagementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ adsManagement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AdsManagementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AdsManagementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load adsManagement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.adsManagement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
