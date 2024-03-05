import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CuisineFormService } from './cuisine-form.service';
import { CuisineService } from '../service/cuisine.service';
import { ICuisine } from '../cuisine.model';

import { CuisineUpdateComponent } from './cuisine-update.component';

describe('Cuisine Management Update Component', () => {
  let comp: CuisineUpdateComponent;
  let fixture: ComponentFixture<CuisineUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cuisineFormService: CuisineFormService;
  let cuisineService: CuisineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CuisineUpdateComponent],
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
      .overrideTemplate(CuisineUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CuisineUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cuisineFormService = TestBed.inject(CuisineFormService);
    cuisineService = TestBed.inject(CuisineService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const cuisine: ICuisine = { id: 456 };

      activatedRoute.data = of({ cuisine });
      comp.ngOnInit();

      expect(comp.cuisine).toEqual(cuisine);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICuisine>>();
      const cuisine = { id: 123 };
      jest.spyOn(cuisineFormService, 'getCuisine').mockReturnValue(cuisine);
      jest.spyOn(cuisineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cuisine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cuisine }));
      saveSubject.complete();

      // THEN
      expect(cuisineFormService.getCuisine).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cuisineService.update).toHaveBeenCalledWith(expect.objectContaining(cuisine));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICuisine>>();
      const cuisine = { id: 123 };
      jest.spyOn(cuisineFormService, 'getCuisine').mockReturnValue({ id: null });
      jest.spyOn(cuisineService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cuisine: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cuisine }));
      saveSubject.complete();

      // THEN
      expect(cuisineFormService.getCuisine).toHaveBeenCalled();
      expect(cuisineService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICuisine>>();
      const cuisine = { id: 123 };
      jest.spyOn(cuisineService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cuisine });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cuisineService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
