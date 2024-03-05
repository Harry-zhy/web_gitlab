import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IntroService } from '../service/intro.service';

import { IntroComponent } from './intro.component';

describe('Intro Management Component', () => {
  let comp: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;
  let service: IntroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'intro', component: IntroComponent }]), HttpClientTestingModule],
      declarations: [IntroComponent],
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
      .overrideTemplate(IntroComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IntroComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(IntroService);

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
    expect(comp.intros?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to introService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getIntroIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getIntroIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
