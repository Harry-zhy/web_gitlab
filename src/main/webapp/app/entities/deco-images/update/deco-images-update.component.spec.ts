import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DecoImagesFormService } from './deco-images-form.service';
import { DecoImagesService } from '../service/deco-images.service';
import { IDecoImages } from '../deco-images.model';
import { IDecoThemes } from 'app/entities/deco-themes/deco-themes.model';
import { DecoThemesService } from 'app/entities/deco-themes/service/deco-themes.service';
import { IDecoCompany } from 'app/entities/deco-company/deco-company.model';
import { DecoCompanyService } from 'app/entities/deco-company/service/deco-company.service';

import { DecoImagesUpdateComponent } from './deco-images-update.component';

describe('DecoImages Management Update Component', () => {
  let comp: DecoImagesUpdateComponent;
  let fixture: ComponentFixture<DecoImagesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let decoImagesFormService: DecoImagesFormService;
  let decoImagesService: DecoImagesService;
  let decoThemesService: DecoThemesService;
  let decoCompanyService: DecoCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DecoImagesUpdateComponent],
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
      .overrideTemplate(DecoImagesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DecoImagesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    decoImagesFormService = TestBed.inject(DecoImagesFormService);
    decoImagesService = TestBed.inject(DecoImagesService);
    decoThemesService = TestBed.inject(DecoThemesService);
    decoCompanyService = TestBed.inject(DecoCompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DecoThemes query and add missing value', () => {
      const decoImages: IDecoImages = { id: 456 };
      const decoThemes: IDecoThemes = { id: 10583 };
      decoImages.decoThemes = decoThemes;

      const decoThemesCollection: IDecoThemes[] = [{ id: 96023 }];
      jest.spyOn(decoThemesService, 'query').mockReturnValue(of(new HttpResponse({ body: decoThemesCollection })));
      const additionalDecoThemes = [decoThemes];
      const expectedCollection: IDecoThemes[] = [...additionalDecoThemes, ...decoThemesCollection];
      jest.spyOn(decoThemesService, 'addDecoThemesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decoImages });
      comp.ngOnInit();

      expect(decoThemesService.query).toHaveBeenCalled();
      expect(decoThemesService.addDecoThemesToCollectionIfMissing).toHaveBeenCalledWith(
        decoThemesCollection,
        ...additionalDecoThemes.map(expect.objectContaining)
      );
      expect(comp.decoThemesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call DecoCompany query and add missing value', () => {
      const decoImages: IDecoImages = { id: 456 };
      const decoCompany: IDecoCompany = { id: 64617 };
      decoImages.decoCompany = decoCompany;

      const decoCompanyCollection: IDecoCompany[] = [{ id: 1512 }];
      jest.spyOn(decoCompanyService, 'query').mockReturnValue(of(new HttpResponse({ body: decoCompanyCollection })));
      const additionalDecoCompanies = [decoCompany];
      const expectedCollection: IDecoCompany[] = [...additionalDecoCompanies, ...decoCompanyCollection];
      jest.spyOn(decoCompanyService, 'addDecoCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ decoImages });
      comp.ngOnInit();

      expect(decoCompanyService.query).toHaveBeenCalled();
      expect(decoCompanyService.addDecoCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        decoCompanyCollection,
        ...additionalDecoCompanies.map(expect.objectContaining)
      );
      expect(comp.decoCompaniesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const decoImages: IDecoImages = { id: 456 };
      const decoThemes: IDecoThemes = { id: 62401 };
      decoImages.decoThemes = decoThemes;
      const decoCompany: IDecoCompany = { id: 50307 };
      decoImages.decoCompany = decoCompany;

      activatedRoute.data = of({ decoImages });
      comp.ngOnInit();

      expect(comp.decoThemesSharedCollection).toContain(decoThemes);
      expect(comp.decoCompaniesSharedCollection).toContain(decoCompany);
      expect(comp.decoImages).toEqual(decoImages);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoImages>>();
      const decoImages = { id: 123 };
      jest.spyOn(decoImagesFormService, 'getDecoImages').mockReturnValue(decoImages);
      jest.spyOn(decoImagesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoImages });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoImages }));
      saveSubject.complete();

      // THEN
      expect(decoImagesFormService.getDecoImages).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(decoImagesService.update).toHaveBeenCalledWith(expect.objectContaining(decoImages));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoImages>>();
      const decoImages = { id: 123 };
      jest.spyOn(decoImagesFormService, 'getDecoImages').mockReturnValue({ id: null });
      jest.spyOn(decoImagesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoImages: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: decoImages }));
      saveSubject.complete();

      // THEN
      expect(decoImagesFormService.getDecoImages).toHaveBeenCalled();
      expect(decoImagesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDecoImages>>();
      const decoImages = { id: 123 };
      jest.spyOn(decoImagesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ decoImages });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(decoImagesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDecoThemes', () => {
      it('Should forward to decoThemesService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(decoThemesService, 'compareDecoThemes');
        comp.compareDecoThemes(entity, entity2);
        expect(decoThemesService.compareDecoThemes).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDecoCompany', () => {
      it('Should forward to decoCompanyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(decoCompanyService, 'compareDecoCompany');
        comp.compareDecoCompany(entity, entity2);
        expect(decoCompanyService.compareDecoCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
