import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CuisineService } from '../service/cuisine.service';

import { CuisineComponent } from './cuisine.component';

describe('Cuisine Management Component', () => {
  let comp: CuisineComponent;
  let fixture: ComponentFixture<CuisineComponent>;
  let service: CuisineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'cuisine', component: CuisineComponent }]), HttpClientTestingModule],
      declarations: [CuisineComponent],
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
      .overrideTemplate(CuisineComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CuisineComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CuisineService);

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
    expect(comp.cuisines?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to cuisineService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCuisineIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCuisineIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
