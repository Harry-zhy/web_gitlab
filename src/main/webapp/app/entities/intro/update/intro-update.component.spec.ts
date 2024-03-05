import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IntroFormService } from './intro-form.service';
import { IntroService } from '../service/intro.service';
import { IIntro } from '../intro.model';

import { IntroUpdateComponent } from './intro-update.component';

describe('Intro Management Update Component', () => {
  let comp: IntroUpdateComponent;
  let fixture: ComponentFixture<IntroUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let introFormService: IntroFormService;
  let introService: IntroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IntroUpdateComponent],
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
      .overrideTemplate(IntroUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IntroUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    introFormService = TestBed.inject(IntroFormService);
    introService = TestBed.inject(IntroService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const intro: IIntro = { id: 456 };

      activatedRoute.data = of({ intro });
      comp.ngOnInit();

      expect(comp.intro).toEqual(intro);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntro>>();
      const intro = { id: 123 };
      jest.spyOn(introFormService, 'getIntro').mockReturnValue(intro);
      jest.spyOn(introService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: intro }));
      saveSubject.complete();

      // THEN
      expect(introFormService.getIntro).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(introService.update).toHaveBeenCalledWith(expect.objectContaining(intro));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntro>>();
      const intro = { id: 123 };
      jest.spyOn(introFormService, 'getIntro').mockReturnValue({ id: null });
      jest.spyOn(introService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intro: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: intro }));
      saveSubject.complete();

      // THEN
      expect(introFormService.getIntro).toHaveBeenCalled();
      expect(introService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IIntro>>();
      const intro = { id: 123 };
      jest.spyOn(introService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ intro });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(introService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
