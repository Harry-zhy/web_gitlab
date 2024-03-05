import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MockCatererEntityDetailComponent } from './mock-caterer-entity-detail.component';

describe('MockCatererEntity Management Detail Component', () => {
  let comp: MockCatererEntityDetailComponent;
  let fixture: ComponentFixture<MockCatererEntityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockCatererEntityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mockCatererEntity: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MockCatererEntityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MockCatererEntityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mockCatererEntity on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mockCatererEntity).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
