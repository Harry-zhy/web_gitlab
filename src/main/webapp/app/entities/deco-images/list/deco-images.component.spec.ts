import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DecoImagesService } from '../service/deco-images.service';

import { DecoImagesComponent } from './deco-images.component';

describe('DecoImages Management Component', () => {
  let comp: DecoImagesComponent;
  let fixture: ComponentFixture<DecoImagesComponent>;
  let service: DecoImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'deco-images', component: DecoImagesComponent }]), HttpClientTestingModule],
      declarations: [DecoImagesComponent],
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
      .overrideTemplate(DecoImagesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoImagesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DecoImagesService);

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
    expect(comp.decoImages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to decoImagesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDecoImagesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDecoImagesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
