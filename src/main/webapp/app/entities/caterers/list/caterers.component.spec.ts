import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CaterersService } from '../service/caterers.service';

import { CaterersComponent } from './caterers.component';

describe('Caterers Management Component', () => {
  let comp: CaterersComponent;
  let fixture: ComponentFixture<CaterersComponent>;
  let service: CaterersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'caterers', component: CaterersComponent }]), HttpClientTestingModule],
      declarations: [CaterersComponent],
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
      .overrideTemplate(CaterersComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CaterersComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CaterersService);

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
    expect(comp.caterers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to caterersService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCaterersIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCaterersIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
