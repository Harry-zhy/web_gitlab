import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DecoImagesFormService, DecoImagesFormGroup } from './deco-images-form.service';
import { IDecoImages } from '../deco-images.model';
import { DecoImagesService } from '../service/deco-images.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IDecoThemes } from 'app/entities/deco-themes/deco-themes.model';
import { DecoThemesService } from 'app/entities/deco-themes/service/deco-themes.service';
import { IDecoCompany } from 'app/entities/deco-company/deco-company.model';
import { DecoCompanyService } from 'app/entities/deco-company/service/deco-company.service';

@Component({
  selector: 'jhi-deco-images-update',
  templateUrl: './deco-images-update.component.html',
})
export class DecoImagesUpdateComponent implements OnInit {
  isSaving = false;
  decoImages: IDecoImages | null = null;

  decoThemesSharedCollection: IDecoThemes[] = [];
  decoCompaniesSharedCollection: IDecoCompany[] = [];

  editForm: DecoImagesFormGroup = this.decoImagesFormService.createDecoImagesFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected decoImagesService: DecoImagesService,
    protected decoImagesFormService: DecoImagesFormService,
    protected decoThemesService: DecoThemesService,
    protected decoCompanyService: DecoCompanyService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDecoThemes = (o1: IDecoThemes | null, o2: IDecoThemes | null): boolean => this.decoThemesService.compareDecoThemes(o1, o2);

  compareDecoCompany = (o1: IDecoCompany | null, o2: IDecoCompany | null): boolean => this.decoCompanyService.compareDecoCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoImages }) => {
      this.decoImages = decoImages;
      if (decoImages) {
        this.updateForm(decoImages);
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
    const decoImages = this.decoImagesFormService.getDecoImages(this.editForm);
    if (decoImages.id !== null) {
      this.subscribeToSaveResponse(this.decoImagesService.update(decoImages));
    } else {
      this.subscribeToSaveResponse(this.decoImagesService.create(decoImages));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecoImages>>): void {
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

  protected updateForm(decoImages: IDecoImages): void {
    this.decoImages = decoImages;
    this.decoImagesFormService.resetForm(this.editForm, decoImages);

    this.decoThemesSharedCollection = this.decoThemesService.addDecoThemesToCollectionIfMissing<IDecoThemes>(
      this.decoThemesSharedCollection,
      decoImages.decoThemes
    );
    this.decoCompaniesSharedCollection = this.decoCompanyService.addDecoCompanyToCollectionIfMissing<IDecoCompany>(
      this.decoCompaniesSharedCollection,
      decoImages.decoCompany
    );
  }

  protected loadRelationshipsOptions(): void {
    this.decoThemesService
      .query()
      .pipe(map((res: HttpResponse<IDecoThemes[]>) => res.body ?? []))
      .pipe(
        map((decoThemes: IDecoThemes[]) =>
          this.decoThemesService.addDecoThemesToCollectionIfMissing<IDecoThemes>(decoThemes, this.decoImages?.decoThemes)
        )
      )
      .subscribe((decoThemes: IDecoThemes[]) => (this.decoThemesSharedCollection = decoThemes));

    this.decoCompanyService
      .query()
      .pipe(map((res: HttpResponse<IDecoCompany[]>) => res.body ?? []))
      .pipe(
        map((decoCompanies: IDecoCompany[]) =>
          this.decoCompanyService.addDecoCompanyToCollectionIfMissing<IDecoCompany>(decoCompanies, this.decoImages?.decoCompany)
        )
      )
      .subscribe((decoCompanies: IDecoCompany[]) => (this.decoCompaniesSharedCollection = decoCompanies));
  }
}
