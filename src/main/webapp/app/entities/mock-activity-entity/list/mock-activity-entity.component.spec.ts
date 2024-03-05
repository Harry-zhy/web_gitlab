import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MockActivityEntityService } from '../service/mock-activity-entity.service';

import { MockActivityEntityComponent } from './mock-activity-entity.component';

describe('MockActivityEntity Management Component', () => {
  let comp: MockActivityEntityComponent;
  let fixture: ComponentFixture<MockActivityEntityComponent>;
  let service: MockActivityEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'mock-activity-entity', component: MockActivityEntityComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [MockActivityEntityComponent],
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
      .overrideTemplate(MockActivityEntityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MockActivityEntityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MockActivityEntityService);

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
    expect(comp.mockActivityEntities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mockActivityEntityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMockActivityEntityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMockActivityEntityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
