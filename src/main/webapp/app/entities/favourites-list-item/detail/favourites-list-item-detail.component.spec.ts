import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FavouritesListItemDetailComponent } from './favourites-list-item-detail.component';

describe('FavouritesListItem Management Detail Component', () => {
  let comp: FavouritesListItemDetailComponent;
  let fixture: ComponentFixture<FavouritesListItemDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavouritesListItemDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ favouritesListItem: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FavouritesListItemDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FavouritesListItemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load favouritesListItem on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.favouritesListItem).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
