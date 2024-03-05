import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MockActivityEntityFormService } from './mock-activity-entity-form.service';
import { MockActivityEntityService } from '../service/mock-activity-entity.service';
import { IMockActivityEntity } from '../mock-activity-entity.model';

import { MockActivityEntityUpdateComponent } from './mock-activity-entity-update.component';

describe('MockActivityEntity Management Update Component', () => {
  let comp: MockActivityEntityUpdateComponent;
  let fixture: ComponentFixture<MockActivityEntityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mockActivityEntityFormService: MockActivityEntityFormService;
  let mockActivityEntityService: MockActivityEntityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MockActivityEntityUpdateComponent],
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
      .overrideTemplate(MockActivityEntityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MockActivityEntityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mockActivityEntityFormService = TestBed.inject(MockActivityEntityFormService);
    mockActivityEntityService = TestBed.inject(MockActivityEntityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mockActivityEntity: IMockActivityEntity = { id: 456 };

      activatedRoute.data = of({ mockActivityEntity });
      comp.ngOnInit();

      expect(comp.mockActivityEntity).toEqual(mockActivityEntity);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockActivityEntity>>();
      const mockActivityEntity = { id: 123 };
      jest.spyOn(mockActivityEntityFormService, 'getMockActivityEntity').mockReturnValue(mockActivityEntity);
      jest.spyOn(mockActivityEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockActivityEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mockActivityEntity }));
      saveSubject.complete();

      // THEN
      expect(mockActivityEntityFormService.getMockActivityEntity).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(mockActivityEntityService.update).toHaveBeenCalledWith(expect.objectContaining(mockActivityEntity));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockActivityEntity>>();
      const mockActivityEntity = { id: 123 };
      jest.spyOn(mockActivityEntityFormService, 'getMockActivityEntity').mockReturnValue({ id: null });
      jest.spyOn(mockActivityEntityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockActivityEntity: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mockActivityEntity }));
      saveSubject.complete();

      // THEN
      expect(mockActivityEntityFormService.getMockActivityEntity).toHaveBeenCalled();
      expect(mockActivityEntityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMockActivityEntity>>();
      const mockActivityEntity = { id: 123 };
      jest.spyOn(mockActivityEntityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mockActivityEntity });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mockActivityEntityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
