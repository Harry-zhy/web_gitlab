import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DecoCompanyService } from '../service/deco-company.service';

import { DecoCompanyComponent } from './deco-company.component';

describe('DecoCompany Management Component', () => {
  let comp: DecoCompanyComponent;
  let fixture: ComponentFixture<DecoCompanyComponent>;
  let service: DecoCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'deco-company', component: DecoCompanyComponent }]), HttpClientTestingModule],
      declarations: [DecoCompanyComponent],
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
      .overrideTemplate(DecoCompanyComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoCompanyComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DecoCompanyService);

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
    expect(comp.decoCompanies?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to decoCompanyService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDecoCompanyIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDecoCompanyIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
