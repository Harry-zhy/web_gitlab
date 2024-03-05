import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DecoBudgetService } from '../service/deco-budget.service';

import { DecoBudgetComponent } from './deco-budget.component';

describe('DecoBudget Management Component', () => {
  let comp: DecoBudgetComponent;
  let fixture: ComponentFixture<DecoBudgetComponent>;
  let service: DecoBudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'deco-budget', component: DecoBudgetComponent }]), HttpClientTestingModule],
      declarations: [DecoBudgetComponent],
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
      .overrideTemplate(DecoBudgetComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoBudgetComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DecoBudgetService);

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
    expect(comp.decoBudgets?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to decoBudgetService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDecoBudgetIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDecoBudgetIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
