import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { FavouritesListService } from '../service/favourites-list.service';

import { FavouritesListComponent } from './favourites-list.component';

describe('FavouritesList Management Component', () => {
  let comp: FavouritesListComponent;
  let fixture: ComponentFixture<FavouritesListComponent>;
  let service: FavouritesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'favourites-list', component: FavouritesListComponent }]), HttpClientTestingModule],
      declarations: [FavouritesListComponent],
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
      .overrideTemplate(FavouritesListComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FavouritesListComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FavouritesListService);

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
    expect(comp.favouritesLists?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to favouritesListService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getFavouritesListIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getFavouritesListIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
