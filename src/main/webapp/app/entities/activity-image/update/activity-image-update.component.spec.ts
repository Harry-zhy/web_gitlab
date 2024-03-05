import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActivityImageFormService } from './activity-image-form.service';
import { ActivityImageService } from '../service/activity-image.service';
import { IActivityImage } from '../activity-image.model';
import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { ActivityCompanyService } from 'app/entities/activity-company/service/activity-company.service';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { ActivitySelfService } from 'app/entities/activity-self/service/activity-self.service';

import { ActivityImageUpdateComponent } from './activity-image-update.component';

describe('ActivityImage Management Update Component', () => {
  let comp: ActivityImageUpdateComponent;
  let fixture: ComponentFixture<ActivityImageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let activityImageFormService: ActivityImageFormService;
  let activityImageService: ActivityImageService;
  let activityCompanyService: ActivityCompanyService;
  let activitySelfService: ActivitySelfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActivityImageUpdateComponent],
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
      .overrideTemplate(ActivityImageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityImageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activityImageFormService = TestBed.inject(ActivityImageFormService);
    activityImageService = TestBed.inject(ActivityImageService);
    activityCompanyService = TestBed.inject(ActivityCompanyService);
    activitySelfService = TestBed.inject(ActivitySelfService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ActivityCompany query and add missing value', () => {
      const activityImage: IActivityImage = { id: 456 };
      const activityCompany: IActivityCompany = { id: 33374 };
      activityImage.activityCompany = activityCompany;

      const activityCompanyCollection: IActivityCompany[] = [{ id: 92417 }];
      jest.spyOn(activityCompanyService, 'query').mockReturnValue(of(new HttpResponse({ body: activityCompanyCollection })));
      const additionalActivityCompanies = [activityCompany];
      const expectedCollection: IActivityCompany[] = [...additionalActivityCompanies, ...activityCompanyCollection];
      jest.spyOn(activityCompanyService, 'addActivityCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activityImage });
      comp.ngOnInit();

      expect(activityCompanyService.query).toHaveBeenCalled();
      expect(activityCompanyService.addActivityCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        activityCompanyCollection,
        ...additionalActivityCompanies.map(expect.objectContaining)
      );
      expect(comp.activityCompaniesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ActivitySelf query and add missing value', () => {
      const activityImage: IActivityImage = { id: 456 };
      const activitySelf: IActivitySelf = { id: 86454 };
      activityImage.activitySelf = activitySelf;

      const activitySelfCollection: IActivitySelf[] = [{ id: 3199 }];
      jest.spyOn(activitySelfService, 'query').mockReturnValue(of(new HttpResponse({ body: activitySelfCollection })));
      const additionalActivitySelves = [activitySelf];
      const expectedCollection: IActivitySelf[] = [...additionalActivitySelves, ...activitySelfCollection];
      jest.spyOn(activitySelfService, 'addActivitySelfToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activityImage });
      comp.ngOnInit();

      expect(activitySelfService.query).toHaveBeenCalled();
      expect(activitySelfService.addActivitySelfToCollectionIfMissing).toHaveBeenCalledWith(
        activitySelfCollection,
        ...additionalActivitySelves.map(expect.objectContaining)
      );
      expect(comp.activitySelvesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const activityImage: IActivityImage = { id: 456 };
      const activityCompany: IActivityCompany = { id: 24745 };
      activityImage.activityCompany = activityCompany;
      const activitySelf: IActivitySelf = { id: 57352 };
      activityImage.activitySelf = activitySelf;

      activatedRoute.data = of({ activityImage });
      comp.ngOnInit();

      expect(comp.activityCompaniesSharedCollection).toContain(activityCompany);
      expect(comp.activitySelvesSharedCollection).toContain(activitySelf);
      expect(comp.activityImage).toEqual(activityImage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityImage>>();
      const activityImage = { id: 123 };
      jest.spyOn(activityImageFormService, 'getActivityImage').mockReturnValue(activityImage);
      jest.spyOn(activityImageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityImage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityImage }));
      saveSubject.complete();

      // THEN
      expect(activityImageFormService.getActivityImage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(activityImageService.update).toHaveBeenCalledWith(expect.objectContaining(activityImage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityImage>>();
      const activityImage = { id: 123 };
      jest.spyOn(activityImageFormService, 'getActivityImage').mockReturnValue({ id: null });
      jest.spyOn(activityImageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityImage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityImage }));
      saveSubject.complete();

      // THEN
      expect(activityImageFormService.getActivityImage).toHaveBeenCalled();
      expect(activityImageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityImage>>();
      const activityImage = { id: 123 };
      jest.spyOn(activityImageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityImage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(activityImageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareActivityCompany', () => {
      it('Should forward to activityCompanyService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activityCompanyService, 'compareActivityCompany');
        comp.compareActivityCompany(entity, entity2);
        expect(activityCompanyService.compareActivityCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareActivitySelf', () => {
      it('Should forward to activitySelfService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(activitySelfService, 'compareActivitySelf');
        comp.compareActivitySelf(entity, entity2);
        expect(activitySelfService.compareActivitySelf).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
