import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MCQOptionService } from '../service/mcq-option.service';

import { MCQOptionComponent } from './mcq-option.component';

describe('MCQOption Management Component', () => {
  let comp: MCQOptionComponent;
  let fixture: ComponentFixture<MCQOptionComponent>;
  let service: MCQOptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mcq-option', component: MCQOptionComponent }]), HttpClientTestingModule],
      declarations: [MCQOptionComponent],
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
      .overrideTemplate(MCQOptionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MCQOptionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MCQOptionService);

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
    expect(comp.mCQOptions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mCQOptionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMCQOptionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMCQOptionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
