import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActivityIdeaFormService } from './activity-idea-form.service';
import { ActivityIdeaService } from '../service/activity-idea.service';
import { IActivityIdea } from '../activity-idea.model';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { ActivitySelfService } from 'app/entities/activity-self/service/activity-self.service';

import { ActivityIdeaUpdateComponent } from './activity-idea-update.component';

describe('ActivityIdea Management Update Component', () => {
  let comp: ActivityIdeaUpdateComponent;
  let fixture: ComponentFixture<ActivityIdeaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let activityIdeaFormService: ActivityIdeaFormService;
  let activityIdeaService: ActivityIdeaService;
  let activitySelfService: ActivitySelfService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActivityIdeaUpdateComponent],
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
      .overrideTemplate(ActivityIdeaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActivityIdeaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    activityIdeaFormService = TestBed.inject(ActivityIdeaFormService);
    activityIdeaService = TestBed.inject(ActivityIdeaService);
    activitySelfService = TestBed.inject(ActivitySelfService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ActivitySelf query and add missing value', () => {
      const activityIdea: IActivityIdea = { id: 456 };
      const activitySelf: IActivitySelf = { id: 53127 };
      activityIdea.activitySelf = activitySelf;

      const activitySelfCollection: IActivitySelf[] = [{ id: 12165 }];
      jest.spyOn(activitySelfService, 'query').mockReturnValue(of(new HttpResponse({ body: activitySelfCollection })));
      const additionalActivitySelves = [activitySelf];
      const expectedCollection: IActivitySelf[] = [...additionalActivitySelves, ...activitySelfCollection];
      jest.spyOn(activitySelfService, 'addActivitySelfToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ activityIdea });
      comp.ngOnInit();

      expect(activitySelfService.query).toHaveBeenCalled();
      expect(activitySelfService.addActivitySelfToCollectionIfMissing).toHaveBeenCalledWith(
        activitySelfCollection,
        ...additionalActivitySelves.map(expect.objectContaining)
      );
      expect(comp.activitySelvesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const activityIdea: IActivityIdea = { id: 456 };
      const activitySelf: IActivitySelf = { id: 64157 };
      activityIdea.activitySelf = activitySelf;

      activatedRoute.data = of({ activityIdea });
      comp.ngOnInit();

      expect(comp.activitySelvesSharedCollection).toContain(activitySelf);
      expect(comp.activityIdea).toEqual(activityIdea);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityIdea>>();
      const activityIdea = { id: 123 };
      jest.spyOn(activityIdeaFormService, 'getActivityIdea').mockReturnValue(activityIdea);
      jest.spyOn(activityIdeaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityIdea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityIdea }));
      saveSubject.complete();

      // THEN
      expect(activityIdeaFormService.getActivityIdea).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(activityIdeaService.update).toHaveBeenCalledWith(expect.objectContaining(activityIdea));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityIdea>>();
      const activityIdea = { id: 123 };
      jest.spyOn(activityIdeaFormService, 'getActivityIdea').mockReturnValue({ id: null });
      jest.spyOn(activityIdeaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityIdea: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: activityIdea }));
      saveSubject.complete();

      // THEN
      expect(activityIdeaFormService.getActivityIdea).toHaveBeenCalled();
      expect(activityIdeaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IActivityIdea>>();
      const activityIdea = { id: 123 };
      jest.spyOn(activityIdeaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ activityIdea });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(activityIdeaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
