import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecoSavedThemeFormService } from './deco-saved-theme-form.service';
import { DecoSavedThemeService } from '../service/deco-saved-theme.service';
import { IDecoSavedTheme } from '../deco-saved-theme.model';

import { DecoSavedThemeUpdateComponent } from './deco-saved-theme-update.component';

describe('DecoSavedTheme Management Update Component', () => {
  let comp: DecoSavedThemeUpdateComponent;
  let fixture: ComponentFixture<DecoSavedThemeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decoSavedThemeFormService: DecoSavedThemeFormService;
  let decoSavedThemeService: DecoSavedThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecoSavedThemeUpdateComponent],
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
      .overrideTemplate(DecoSavedThemeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoSavedThemeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decoSavedThemeFormService = TestBed.inject(DecoSavedThemeFormService);
    decoSavedThemeService = TestBed.inject(DecoSavedThemeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const decoSavedTheme: IDecoSavedTheme = { id: 456 };

      activatedRoute.data = of({ decoSavedTheme });
      comp.ngOnInit();

      expect(comp.decoSavedTheme).toEqual(decoSavedTheme);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoSavedTheme>>();
      const decoSavedTheme = { id: 123 };
      jest.spyOn(decoSavedThemeFormService, 'getDecoSavedTheme').mockReturnValue(decoSavedTheme);
      jest.spyOn(decoSavedThemeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoSavedTheme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoSavedTheme }));
      saveSubject.complete();

      // THEN
      expect(decoSavedThemeFormService.getDecoSavedTheme).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decoSavedThemeService.update).toHaveBeenCalledWith(expect.objectContaining(decoSavedTheme));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoSavedTheme>>();
      const decoSavedTheme = { id: 123 };
      jest.spyOn(decoSavedThemeFormService, 'getDecoSavedTheme').mockReturnValue({ id: null });
      jest.spyOn(decoSavedThemeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoSavedTheme: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoSavedTheme }));
      saveSubject.complete();

      // THEN
      expect(decoSavedThemeFormService.getDecoSavedTheme).toHaveBeenCalled();
      expect(decoSavedThemeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoSavedTheme>>();
      const decoSavedTheme = { id: 123 };
      jest.spyOn(decoSavedThemeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoSavedTheme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decoSavedThemeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
