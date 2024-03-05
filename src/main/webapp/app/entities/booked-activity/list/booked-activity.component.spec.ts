import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { BookedActivityService } from '../service/booked-activity.service';

import { BookedActivityComponent } from './booked-activity.component';

describe('BookedActivity Management Component', () => {
  let comp: BookedActivityComponent;
  let fixture: ComponentFixture<BookedActivityComponent>;
  let service: BookedActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'booked-activity', component: BookedActivityComponent }]), HttpClientTestingModule],
      declarations: [BookedActivityComponent],
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
      .overrideTemplate(BookedActivityComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookedActivityComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(BookedActivityService);

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
    expect(comp.bookedActivities?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to bookedActivityService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getBookedActivityIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getBookedActivityIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
