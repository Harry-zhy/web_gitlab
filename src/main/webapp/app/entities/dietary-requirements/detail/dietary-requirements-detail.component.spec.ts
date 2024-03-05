import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DietaryRequirementsDetailComponent } from './dietary-requirements-detail.component';

describe('DietaryRequirements Management Detail Component', () => {
  let comp: DietaryRequirementsDetailComponent;
  let fixture: ComponentFixture<DietaryRequirementsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DietaryRequirementsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ dietaryRequirements: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DietaryRequirementsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DietaryRequirementsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load dietaryRequirements on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.dietaryRequirements).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
