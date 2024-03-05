import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DietaryRequirementsFormService } from './dietary-requirements-form.service';
import { DietaryRequirementsService } from '../service/dietary-requirements.service';
import { IDietaryRequirements } from '../dietary-requirements.model';

import { DietaryRequirementsUpdateComponent } from './dietary-requirements-update.component';

describe('DietaryRequirements Management Update Component', () => {
  let comp: DietaryRequirementsUpdateComponent;
  let fixture: ComponentFixture<DietaryRequirementsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let dietaryRequirementsFormService: DietaryRequirementsFormService;
  let dietaryRequirementsService: DietaryRequirementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DietaryRequirementsUpdateComponent],
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
      .overrideTemplate(DietaryRequirementsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DietaryRequirementsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    dietaryRequirementsFormService = TestBed.inject(DietaryRequirementsFormService);
    dietaryRequirementsService = TestBed.inject(DietaryRequirementsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const dietaryRequirements: IDietaryRequirements = { id: 456 };

      activatedRoute.data = of({ dietaryRequirements });
      comp.ngOnInit();

      expect(comp.dietaryRequirements).toEqual(dietaryRequirements);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDietaryRequirements>>();
      const dietaryRequirements = { id: 123 };
      jest.spyOn(dietaryRequirementsFormService, 'getDietaryRequirements').mockReturnValue(dietaryRequirements);
      jest.spyOn(dietaryRequirementsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dietaryRequirements });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dietaryRequirements }));
      saveSubject.complete();

      // THEN
      expect(dietaryRequirementsFormService.getDietaryRequirements).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(dietaryRequirementsService.update).toHaveBeenCalledWith(expect.objectContaining(dietaryRequirements));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDietaryRequirements>>();
      const dietaryRequirements = { id: 123 };
      jest.spyOn(dietaryRequirementsFormService, 'getDietaryRequirements').mockReturnValue({ id: null });
      jest.spyOn(dietaryRequirementsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dietaryRequirements: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dietaryRequirements }));
      saveSubject.complete();

      // THEN
      expect(dietaryRequirementsFormService.getDietaryRequirements).toHaveBeenCalled();
      expect(dietaryRequirementsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDietaryRequirements>>();
      const dietaryRequirements = { id: 123 };
      jest.spyOn(dietaryRequirementsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dietaryRequirements });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(dietaryRequirementsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
