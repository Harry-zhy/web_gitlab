import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FavouritesListDetailComponent } from './favourites-list-detail.component';

describe('FavouritesList Management Detail Component', () => {
  let comp: FavouritesListDetailComponent;
  let fixture: ComponentFixture<FavouritesListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavouritesListDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ favouritesList: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FavouritesListDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FavouritesListDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load favouritesList on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.favouritesList).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
