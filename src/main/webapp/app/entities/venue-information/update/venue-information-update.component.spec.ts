import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VenueInformationFormService } from './venue-information-form.service';
import { VenueInformationService } from '../service/venue-information.service';
import { IVenueInformation } from '../venue-information.model';
import { IEventItinerary } from 'app/entities/event-itinerary/event-itinerary.model';
import { EventItineraryService } from 'app/entities/event-itinerary/service/event-itinerary.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';

import { VenueInformationUpdateComponent } from './venue-information-update.component';

describe('VenueInformation Management Update Component', () => {
  let comp: VenueInformationUpdateComponent;
  let fixture: ComponentFixture<VenueInformationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let venueInformationFormService: VenueInformationFormService;
  let venueInformationService: VenueInformationService;
  let eventItineraryService: EventItineraryService;
  let supplierService: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VenueInformationUpdateComponent],
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
      .overrideTemplate(VenueInformationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VenueInformationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    venueInformationFormService = TestBed.inject(VenueInformationFormService);
    venueInformationService = TestBed.inject(VenueInformationService);
    eventItineraryService = TestBed.inject(EventItineraryService);
    supplierService = TestBed.inject(SupplierService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call EventItinerary query and add missing value', () => {
      const venueInformation: IVenueInformation = { id: 456 };
      const eventItinerary: IEventItinerary = { id: 23006 };
      venueInformation.eventItinerary = eventItinerary;

      const eventItineraryCollection: IEventItinerary[] = [{ id: 4300 }];
      jest.spyOn(eventItineraryService, 'query').mockReturnValue(of(new HttpResponse({ body: eventItineraryCollection })));
      const additionalEventItineraries = [eventItinerary];
      const expectedCollection: IEventItinerary[] = [...additionalEventItineraries, ...eventItineraryCollection];
      jest.spyOn(eventItineraryService, 'addEventItineraryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ venueInformation });
      comp.ngOnInit();

      expect(eventItineraryService.query).toHaveBeenCalled();
      expect(eventItineraryService.addEventItineraryToCollectionIfMissing).toHaveBeenCalledWith(
        eventItineraryCollection,
        ...additionalEventItineraries.map(expect.objectContaining)
      );
      expect(comp.eventItinerariesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Supplier query and add missing value', () => {
      const venueInformation: IVenueInformation = { id: 456 };
      const supplier: ISupplier = { id: 31904 };
      venueInformation.supplier = supplier;

      const supplierCollection: ISupplier[] = [{ id: 41663 }];
      jest.spyOn(supplierService, 'query').mockReturnValue(of(new HttpResponse({ body: supplierCollection })));
      const additionalSuppliers = [supplier];
      const expectedCollection: ISupplier[] = [...additionalSuppliers, ...supplierCollection];
      jest.spyOn(supplierService, 'addSupplierToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ venueInformation });
      comp.ngOnInit();

      expect(supplierService.query).toHaveBeenCalled();
      expect(supplierService.addSupplierToCollectionIfMissing).toHaveBeenCalledWith(
        supplierCollection,
        ...additionalSuppliers.map(expect.objectContaining)
      );
      expect(comp.suppliersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const venueInformation: IVenueInformation = { id: 456 };
      const eventItinerary: IEventItinerary = { id: 24370 };
      venueInformation.eventItinerary = eventItinerary;
      const supplier: ISupplier = { id: 82784 };
      venueInformation.supplier = supplier;

      activatedRoute.data = of({ venueInformation });
      comp.ngOnInit();

      expect(comp.eventItinerariesSharedCollection).toContain(eventItinerary);
      expect(comp.suppliersSharedCollection).toContain(supplier);
      expect(comp.venueInformation).toEqual(venueInformation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVenueInformation>>();
      const venueInformation = { id: 123 };
      jest.spyOn(venueInformationFormService, 'getVenueInformation').mockReturnValue(venueInformation);
      jest.spyOn(venueInformationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ venueInformation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: venueInformation }));
      saveSubject.complete();

      // THEN
      expect(venueInformationFormService.getVenueInformation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(venueInformationService.update).toHaveBeenCalledWith(expect.objectContaining(venueInformation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVenueInformation>>();
      const venueInformation = { id: 123 };
      jest.spyOn(venueInformationFormService, 'getVenueInformation').mockReturnValue({ id: null });
      jest.spyOn(venueInformationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ venueInformation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: venueInformation }));
      saveSubject.complete();

      // THEN
      expect(venueInformationFormService.getVenueInformation).toHaveBeenCalled();
      expect(venueInformationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVenueInformation>>();
      const venueInformation = { id: 123 };
      jest.spyOn(venueInformationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ venueInformation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(venueInformationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEventItinerary', () => {
      it('Should forward to eventItineraryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(eventItineraryService, 'compareEventItinerary');
        comp.compareEventItinerary(entity, entity2);
        expect(eventItineraryService.compareEventItinerary).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSupplier', () => {
      it('Should forward to supplierService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(supplierService, 'compareSupplier');
        comp.compareSupplier(entity, entity2);
        expect(supplierService.compareSupplier).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
