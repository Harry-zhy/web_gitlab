import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DecoSavedThemeService } from '../service/deco-saved-theme.service';

import { DecoSavedThemeComponent } from './deco-saved-theme.component';

describe('DecoSavedTheme Management Component', () => {
  let comp: DecoSavedThemeComponent;
  let fixture: ComponentFixture<DecoSavedThemeComponent>;
  let service: DecoSavedThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'deco-saved-theme', component: DecoSavedThemeComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [DecoSavedThemeComponent],
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
      .overrideTemplate(DecoSavedThemeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoSavedThemeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DecoSavedThemeService);

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
    expect(comp.decoSavedThemes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to decoSavedThemeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDecoSavedThemeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDecoSavedThemeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
