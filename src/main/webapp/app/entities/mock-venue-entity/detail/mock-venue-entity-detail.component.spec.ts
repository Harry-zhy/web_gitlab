import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MockVenueEntityDetailComponent } from './mock-venue-entity-detail.component';

describe('MockVenueEntity Management Detail Component', () => {
  let comp: MockVenueEntityDetailComponent;
  let fixture: ComponentFixture<MockVenueEntityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockVenueEntityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mockVenueEntity: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MockVenueEntityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MockVenueEntityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mockVenueEntity on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mockVenueEntity).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
