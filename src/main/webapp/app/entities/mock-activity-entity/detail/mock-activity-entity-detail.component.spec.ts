import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MockActivityEntityDetailComponent } from './mock-activity-entity-detail.component';

describe('MockActivityEntity Management Detail Component', () => {
  let comp: MockActivityEntityDetailComponent;
  let fixture: ComponentFixture<MockActivityEntityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockActivityEntityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mockActivityEntity: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MockActivityEntityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MockActivityEntityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mockActivityEntity on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mockActivityEntity).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
