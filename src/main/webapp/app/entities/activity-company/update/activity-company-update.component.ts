import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActivityCompanyFormService, ActivityCompanyFormGroup } from './activity-company-form.service';
import { IActivityCompany } from '../activity-company.model';
import { ActivityCompanyService } from '../service/activity-company.service';
import { ISupplier } from 'app/entities/supplier/supplier.model';
import { SupplierService } from 'app/entities/supplier/service/supplier.service';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';
import { BookedActivityService } from 'app/entities/booked-activity/service/booked-activity.service';

@Component({
  selector: 'jhi-activity-company-update',
  templateUrl: './activity-company-update.component.html',
})
export class ActivityCompanyUpdateComponent implements OnInit {
  isSaving = false;
  activityCompany: IActivityCompany | null = null;

  suppliersCollection: ISupplier[] = [];
  bookedActivitiesSharedCollection: IBookedActivity[] = [];

  editForm: ActivityCompanyFormGroup = this.activityCompanyFormService.createActivityCompanyFormGroup();

  constructor(
    protected activityCompanyService: ActivityCompanyService,
    protected activityCompanyFormService: ActivityCompanyFormService,
    protected supplierService: SupplierService,
    protected bookedActivityService: BookedActivityService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSupplier = (o1: ISupplier | null, o2: ISupplier | null): boolean => this.supplierService.compareSupplier(o1, o2);

  compareBookedActivity = (o1: IBookedActivity | null, o2: IBookedActivity | null): boolean =>
    this.bookedActivityService.compareBookedActivity(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityCompany }) => {
      this.activityCompany = activityCompany;
      if (activityCompany) {
        this.updateForm(activityCompany);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activityCompany = this.activityCompanyFormService.getActivityCompany(this.editForm);
    if (activityCompany.id !== null) {
      this.subscribeToSaveResponse(this.activityCompanyService.update(activityCompany));
    } else {
      this.subscribeToSaveResponse(this.activityCompanyService.create(activityCompany));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivityCompany>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(activityCompany: IActivityCompany): void {
    this.activityCompany = activityCompany;
    this.activityCompanyFormService.resetForm(this.editForm, activityCompany);

    this.suppliersCollection = this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(
      this.suppliersCollection,
      activityCompany.supplier
    );
    this.bookedActivitiesSharedCollection = this.bookedActivityService.addBookedActivityToCollectionIfMissing<IBookedActivity>(
      this.bookedActivitiesSharedCollection,
      activityCompany.bookedActivity
    );
  }

  protected loadRelationshipsOptions(): void {
    this.supplierService
      .query({ filter: 'activitycompany-is-null' })
      .pipe(map((res: HttpResponse<ISupplier[]>) => res.body ?? []))
      .pipe(
        map((suppliers: ISupplier[]) =>
          this.supplierService.addSupplierToCollectionIfMissing<ISupplier>(suppliers, this.activityCompany?.supplier)
        )
      )
      .subscribe((suppliers: ISupplier[]) => (this.suppliersCollection = suppliers));

    this.bookedActivityService
      .query()
      .pipe(map((res: HttpResponse<IBookedActivity[]>) => res.body ?? []))
      .pipe(
        map((bookedActivities: IBookedActivity[]) =>
          this.bookedActivityService.addBookedActivityToCollectionIfMissing<IBookedActivity>(
            bookedActivities,
            this.activityCompany?.bookedActivity
          )
        )
      )
      .subscribe((bookedActivities: IBookedActivity[]) => (this.bookedActivitiesSharedCollection = bookedActivities));
  }
}
