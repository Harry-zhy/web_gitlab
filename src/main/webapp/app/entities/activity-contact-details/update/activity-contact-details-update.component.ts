import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActivityContactDetailsFormService, ActivityContactDetailsFormGroup } from './activity-contact-details-form.service';
import { IActivityContactDetails } from '../activity-contact-details.model';
import { ActivityContactDetailsService } from '../service/activity-contact-details.service';
import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { ActivityCompanyService } from 'app/entities/activity-company/service/activity-company.service';

@Component({
  selector: 'jhi-activity-contact-details-update',
  templateUrl: './activity-contact-details-update.component.html',
})
export class ActivityContactDetailsUpdateComponent implements OnInit {
  isSaving = false;
  activityContactDetails: IActivityContactDetails | null = null;

  activityCompaniesCollection: IActivityCompany[] = [];

  editForm: ActivityContactDetailsFormGroup = this.activityContactDetailsFormService.createActivityContactDetailsFormGroup();

  constructor(
    protected activityContactDetailsService: ActivityContactDetailsService,
    protected activityContactDetailsFormService: ActivityContactDetailsFormService,
    protected activityCompanyService: ActivityCompanyService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareActivityCompany = (o1: IActivityCompany | null, o2: IActivityCompany | null): boolean =>
    this.activityCompanyService.compareActivityCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityContactDetails }) => {
      this.activityContactDetails = activityContactDetails;
      if (activityContactDetails) {
        this.updateForm(activityContactDetails);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activityContactDetails = this.activityContactDetailsFormService.getActivityContactDetails(this.editForm);
    if (activityContactDetails.id !== null) {
      this.subscribeToSaveResponse(this.activityContactDetailsService.update(activityContactDetails));
    } else {
      this.subscribeToSaveResponse(this.activityContactDetailsService.create(activityContactDetails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivityContactDetails>>): void {
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

  protected updateForm(activityContactDetails: IActivityContactDetails): void {
    this.activityContactDetails = activityContactDetails;
    this.activityContactDetailsFormService.resetForm(this.editForm, activityContactDetails);

    this.activityCompaniesCollection = this.activityCompanyService.addActivityCompanyToCollectionIfMissing<IActivityCompany>(
      this.activityCompaniesCollection,
      activityContactDetails.activityCompany
    );
  }

  protected loadRelationshipsOptions(): void {
    this.activityCompanyService
      .query({ filter: 'activitycontactdetails-is-null' })
      .pipe(map((res: HttpResponse<IActivityCompany[]>) => res.body ?? []))
      .pipe(
        map((activityCompanies: IActivityCompany[]) =>
          this.activityCompanyService.addActivityCompanyToCollectionIfMissing<IActivityCompany>(
            activityCompanies,
            this.activityContactDetails?.activityCompany
          )
        )
      )
      .subscribe((activityCompanies: IActivityCompany[]) => (this.activityCompaniesCollection = activityCompanies));
  }
}
