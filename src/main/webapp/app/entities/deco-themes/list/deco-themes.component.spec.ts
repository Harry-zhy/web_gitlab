import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DecoThemesService } from '../service/deco-themes.service';

import { DecoThemesComponent } from './deco-themes.component';

describe('DecoThemes Management Component', () => {
  let comp: DecoThemesComponent;
  let fixture: ComponentFixture<DecoThemesComponent>;
  let service: DecoThemesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'deco-themes', component: DecoThemesComponent }]), HttpClientTestingModule],
      declarations: [DecoThemesComponent],
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
      .overrideTemplate(DecoThemesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoThemesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DecoThemesService);

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
    expect(comp.decoThemes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to decoThemesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDecoThemesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDecoThemesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
