import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ActivityCompanyDetailComponent } from './activity-company-detail.component';

describe('ActivityCompany Management Detail Component', () => {
  let comp: ActivityCompanyDetailComponent;
  let fixture: ComponentFixture<ActivityCompanyDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityCompanyDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ activityCompany: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ActivityCompanyDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ActivityCompanyDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load activityCompany on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.activityCompany).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
