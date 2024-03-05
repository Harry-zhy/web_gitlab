import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecoThemesFormService } from './deco-themes-form.service';
import { DecoThemesService } from '../service/deco-themes.service';
import { IDecoThemes } from '../deco-themes.model';
import { IDecoSavedTheme } from 'app/entities/deco-saved-theme/deco-saved-theme.model';
import { DecoSavedThemeService } from 'app/entities/deco-saved-theme/service/deco-saved-theme.service';

import { DecoThemesUpdateComponent } from './deco-themes-update.component';

describe('DecoThemes Management Update Component', () => {
  let comp: DecoThemesUpdateComponent;
  let fixture: ComponentFixture<DecoThemesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decoThemesFormService: DecoThemesFormService;
  let decoThemesService: DecoThemesService;
  let decoSavedThemeService: DecoSavedThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecoThemesUpdateComponent],
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
      .overrideTemplate(DecoThemesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoThemesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decoThemesFormService = TestBed.inject(DecoThemesFormService);
    decoThemesService = TestBed.inject(DecoThemesService);
    decoSavedThemeService = TestBed.inject(DecoSavedThemeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DecoSavedTheme query and add missing value', () => {
      const decoThemes: IDecoThemes = { id: 456 };
      const decoSavedThemes: IDecoSavedTheme[] = [{ id: 61484 }];
      decoThemes.decoSavedThemes = decoSavedThemes;

      const decoSavedThemeCollection: IDecoSavedTheme[] = [{ id: 72903 }];
      jest.spyOn(decoSavedThemeService, 'query').mockReturnValue(of(new HttpResponse({ body: decoSavedThemeCollection })));
      const additionalDecoSavedThemes = [...decoSavedThemes];
      const expectedCollection: IDecoSavedTheme[] = [...additionalDecoSavedThemes, ...decoSavedThemeCollection];
      jest.spyOn(decoSavedThemeService, 'addDecoSavedThemeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decoThemes });
      comp.ngOnInit();

      expect(decoSavedThemeService.query).toHaveBeenCalled();
      expect(decoSavedThemeService.addDecoSavedThemeToCollectionIfMissing).toHaveBeenCalledWith(
        decoSavedThemeCollection,
        ...additionalDecoSavedThemes.map(expect.objectContaining)
      );
      expect(comp.decoSavedThemesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const decoThemes: IDecoThemes = { id: 456 };
      const decoSavedTheme: IDecoSavedTheme = { id: 54809 };
      decoThemes.decoSavedThemes = [decoSavedTheme];

      activatedRoute.data = of({ decoThemes });
      comp.ngOnInit();

      expect(comp.decoSavedThemesSharedCollection).toContain(decoSavedTheme);
      expect(comp.decoThemes).toEqual(decoThemes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoThemes>>();
      const decoThemes = { id: 123 };
      jest.spyOn(decoThemesFormService, 'getDecoThemes').mockReturnValue(decoThemes);
      jest.spyOn(decoThemesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoThemes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoThemes }));
      saveSubject.complete();

      // THEN
      expect(decoThemesFormService.getDecoThemes).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decoThemesService.update).toHaveBeenCalledWith(expect.objectContaining(decoThemes));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoThemes>>();
      const decoThemes = { id: 123 };
      jest.spyOn(decoThemesFormService, 'getDecoThemes').mockReturnValue({ id: null });
      jest.spyOn(decoThemesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoThemes: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoThemes }));
      saveSubject.complete();

      // THEN
      expect(decoThemesFormService.getDecoThemes).toHaveBeenCalled();
      expect(decoThemesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoThemes>>();
      const decoThemes = { id: 123 };
      jest.spyOn(decoThemesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoThemes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decoThemesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDecoSavedTheme', () => {
      it('Should forward to decoSavedThemeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(decoSavedThemeService, 'compareDecoSavedTheme');
        comp.compareDecoSavedTheme(entity, entity2);
        expect(decoSavedThemeService.compareDecoSavedTheme).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
