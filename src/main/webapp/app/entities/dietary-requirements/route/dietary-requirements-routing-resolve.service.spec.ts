import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDietaryRequirements } from '../dietary-requirements.model';
import { DietaryRequirementsService } from '../service/dietary-requirements.service';

import { DietaryRequirementsRoutingResolveService } from './dietary-requirements-routing-resolve.service';

describe('DietaryRequirements routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DietaryRequirementsRoutingResolveService;
  let service: DietaryRequirementsService;
  let resultDietaryRequirements: IDietaryRequirements | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(DietaryRequirementsRoutingResolveService);
    service = TestBed.inject(DietaryRequirementsService);
    resultDietaryRequirements = undefined;
  });

  describe('resolve', () => {
    it('should return IDietaryRequirements returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDietaryRequirements = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDietaryRequirements).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDietaryRequirements = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDietaryRequirements).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IDietaryRequirements>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDietaryRequirements = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDietaryRequirements).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
