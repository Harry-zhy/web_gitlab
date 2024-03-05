import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActivityImageFormService, ActivityImageFormGroup } from './activity-image-form.service';
import { IActivityImage } from '../activity-image.model';
import { ActivityImageService } from '../service/activity-image.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { ActivityCompanyService } from 'app/entities/activity-company/service/activity-company.service';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { ActivitySelfService } from 'app/entities/activity-self/service/activity-self.service';

@Component({
  selector: 'jhi-activity-image-update',
  templateUrl: './activity-image-update.component.html',
})
export class ActivityImageUpdateComponent implements OnInit {
  isSaving = false;
  activityImage: IActivityImage | null = null;

  activityCompaniesSharedCollection: IActivityCompany[] = [];
  activitySelvesSharedCollection: IActivitySelf[] = [];

  editForm: ActivityImageFormGroup = this.activityImageFormService.createActivityImageFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected activityImageService: ActivityImageService,
    protected activityImageFormService: ActivityImageFormService,
    protected activityCompanyService: ActivityCompanyService,
    protected activitySelfService: ActivitySelfService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareActivityCompany = (o1: IActivityCompany | null, o2: IActivityCompany | null): boolean =>
    this.activityCompanyService.compareActivityCompany(o1, o2);

  compareActivitySelf = (o1: IActivitySelf | null, o2: IActivitySelf | null): boolean =>
    this.activitySelfService.compareActivitySelf(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityImage }) => {
      this.activityImage = activityImage;
      if (activityImage) {
        this.updateForm(activityImage);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activityImage = this.activityImageFormService.getActivityImage(this.editForm);
    if (activityImage.id !== null) {
      this.subscribeToSaveResponse(this.activityImageService.update(activityImage));
    } else {
      this.subscribeToSaveResponse(this.activityImageService.create(activityImage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivityImage>>): void {
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

  protected updateForm(activityImage: IActivityImage): void {
    this.activityImage = activityImage;
    this.activityImageFormService.resetForm(this.editForm, activityImage);

    this.activityCompaniesSharedCollection = this.activityCompanyService.addActivityCompanyToCollectionIfMissing<IActivityCompany>(
      this.activityCompaniesSharedCollection,
      activityImage.activityCompany
    );
    this.activitySelvesSharedCollection = this.activitySelfService.addActivitySelfToCollectionIfMissing<IActivitySelf>(
      this.activitySelvesSharedCollection,
      activityImage.activitySelf
    );
  }

  protected loadRelationshipsOptions(): void {
    this.activityCompanyService
      .query()
      .pipe(map((res: HttpResponse<IActivityCompany[]>) => res.body ?? []))
      .pipe(
        map((activityCompanies: IActivityCompany[]) =>
          this.activityCompanyService.addActivityCompanyToCollectionIfMissing<IActivityCompany>(
            activityCompanies,
            this.activityImage?.activityCompany
          )
        )
      )
      .subscribe((activityCompanies: IActivityCompany[]) => (this.activityCompaniesSharedCollection = activityCompanies));

    this.activitySelfService
      .query()
      .pipe(map((res: HttpResponse<IActivitySelf[]>) => res.body ?? []))
      .pipe(
        map((activitySelves: IActivitySelf[]) =>
          this.activitySelfService.addActivitySelfToCollectionIfMissing<IActivitySelf>(activitySelves, this.activityImage?.activitySelf)
        )
      )
      .subscribe((activitySelves: IActivitySelf[]) => (this.activitySelvesSharedCollection = activitySelves));
  }
}
