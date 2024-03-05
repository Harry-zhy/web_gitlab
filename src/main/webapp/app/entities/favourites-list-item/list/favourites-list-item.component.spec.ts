import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FavouritesListItemService } from '../service/favourites-list-item.service';

import { FavouritesListItemComponent } from './favourites-list-item.component';

describe('FavouritesListItem Management Component', () => {
  let comp: FavouritesListItemComponent;
  let fixture: ComponentFixture<FavouritesListItemComponent>;
  let service: FavouritesListItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'favourites-list-item', component: FavouritesListItemComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [FavouritesListItemComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(FavouritesListItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FavouritesListItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FavouritesListItemService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.favouritesListItems?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to favouritesListItemService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFavouritesListItemIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFavouritesListItemIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
