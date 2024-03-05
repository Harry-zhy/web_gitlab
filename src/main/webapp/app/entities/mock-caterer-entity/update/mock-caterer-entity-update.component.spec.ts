import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MockCatererEntityFormService } from './mock-caterer-entity-form.service';
import { MockCatererEntityService } from '../service/mock-caterer-entity.service';
import { IMockCatererEntity } from '../mock-caterer-entity.model';

import { MockCatererEntityUpdateComponent } from './mock-caterer-entity-update.component';

describe('MockCatererEntity Management Update Component', () => {
  let comp: MockCatererEntityUpdateComponent;
  let fixture: ComponentFixture<MockCatererEntityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mockCatererEntityFormService: MockCatererEntityFormService;
  let mockCatererEntityService: MockCatererEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MockCatererEntityUpdateComponent],
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
      .overrideTemplate(MockCatererEntityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MockCatererEntityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mockCatererEntityFormService = TestBed.inject(MockCatererEntityFormService);
    mockCatererEntityService = TestBed.inject(MockCatererEntityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mockCatererEntity: IMockCatererEntity = { id: 456 };

      activatedRoute.data = of({ mockCatererEntity });
      comp.ngOnInit();

      expect(comp.mockCatererEntity).toEqual(mockCatererEntity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockCatererEntity>>();
      const mockCatererEntity = { id: 123 };
      jest.spyOn(mockCatererEntityFormService, 'getMockCatererEntity').mockReturnValue(mockCatererEntity);
      jest.spyOn(mockCatererEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockCatererEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mockCatererEntity }));
      saveSubject.complete();

      // THEN
      expect(mockCatererEntityFormService.getMockCatererEntity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mockCatererEntityService.update).toHaveBeenCalledWith(expect.objectContaining(mockCatererEntity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockCatererEntity>>();
      const mockCatererEntity = { id: 123 };
      jest.spyOn(mockCatererEntityFormService, 'getMockCatererEntity').mockReturnValue({ id: null });
      jest.spyOn(mockCatererEntityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockCatererEntity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mockCatererEntity }));
      saveSubject.complete();

      // THEN
      expect(mockCatererEntityFormService.getMockCatererEntity).toHaveBeenCalled();
      expect(mockCatererEntityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockCatererEntity>>();
      const mockCatererEntity = { id: 123 };
      jest.spyOn(mockCatererEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockCatererEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mockCatererEntityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
