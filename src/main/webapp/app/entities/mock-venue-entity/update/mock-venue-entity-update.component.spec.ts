import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MockVenueEntityFormService } from './mock-venue-entity-form.service';
import { MockVenueEntityService } from '../service/mock-venue-entity.service';
import { IMockVenueEntity } from '../mock-venue-entity.model';

import { MockVenueEntityUpdateComponent } from './mock-venue-entity-update.component';

describe('MockVenueEntity Management Update Component', () => {
  let comp: MockVenueEntityUpdateComponent;
  let fixture: ComponentFixture<MockVenueEntityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mockVenueEntityFormService: MockVenueEntityFormService;
  let mockVenueEntityService: MockVenueEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MockVenueEntityUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(MockVenueEntityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MockVenueEntityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mockVenueEntityFormService = TestBed.inject(MockVenueEntityFormService);
    mockVenueEntityService = TestBed.inject(MockVenueEntityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mockVenueEntity: IMockVenueEntity = { id: 456 };

      activatedRoute.data = of({ mockVenueEntity });
      comp.ngOnInit();

      expect(comp.mockVenueEntity).toEqual(mockVenueEntity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockVenueEntity>>();
      const mockVenueEntity = { id: 123 };
      jest.spyOn(mockVenueEntityFormService, 'getMockVenueEntity').mockReturnValue(mockVenueEntity);
      jest.spyOn(mockVenueEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockVenueEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mockVenueEntity }));
      saveSubject.complete();

      // THEN
      expect(mockVenueEntityFormService.getMockVenueEntity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mockVenueEntityService.update).toHaveBeenCalledWith(expect.objectContaining(mockVenueEntity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockVenueEntity>>();
      const mockVenueEntity = { id: 123 };
      jest.spyOn(mockVenueEntityFormService, 'getMockVenueEntity').mockReturnValue({ id: null });
      jest.spyOn(mockVenueEntityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockVenueEntity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mockVenueEntity }));
      saveSubject.complete();

      // THEN
      expect(mockVenueEntityFormService.getMockVenueEntity).toHaveBeenCalled();
      expect(mockVenueEntityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockVenueEntity>>();
      const mockVenueEntity = { id: 123 };
      jest.spyOn(mockVenueEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockVenueEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mockVenueEntityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
