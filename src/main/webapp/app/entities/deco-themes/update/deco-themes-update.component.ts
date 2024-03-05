import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DecoThemesFormService, DecoThemesFormGroup } from './deco-themes-form.service';
import { IDecoThemes } from '../deco-themes.model';
import { DecoThemesService } from '../service/deco-themes.service';
import { IDecoSavedTheme } from 'app/entities/deco-saved-theme/deco-saved-theme.model';
import { DecoSavedThemeService } from 'app/entities/deco-saved-theme/service/deco-saved-theme.service';

@Component({
  selector: 'jhi-deco-themes-update',
  templateUrl: './deco-themes-update.component.html',
})
export class DecoThemesUpdateComponent implements OnInit {
  isSaving = false;
  decoThemes: IDecoThemes | null = null;

  decoSavedThemesSharedCollection: IDecoSavedTheme[] = [];

  editForm: DecoThemesFormGroup = this.decoThemesFormService.createDecoThemesFormGroup();

  constructor(
    protected decoThemesService: DecoThemesService,
    protected decoThemesFormService: DecoThemesFormService,
    protected decoSavedThemeService: DecoSavedThemeService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDecoSavedTheme = (o1: IDecoSavedTheme | null, o2: IDecoSavedTheme | null): boolean =>
    this.decoSavedThemeService.compareDecoSavedTheme(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoThemes }) => {
      this.decoThemes = decoThemes;
      if (decoThemes) {
        this.updateForm(decoThemes);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const decoThemes = this.decoThemesFormService.getDecoThemes(this.editForm);
    if (decoThemes.id !== null) {
      this.subscribeToSaveResponse(this.decoThemesService.update(decoThemes));
    } else {
      this.subscribeToSaveResponse(this.decoThemesService.create(decoThemes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecoThemes>>): void {
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

  protected updateForm(decoThemes: IDecoThemes): void {
    this.decoThemes = decoThemes;
    this.decoThemesFormService.resetForm(this.editForm, decoThemes);

    this.decoSavedThemesSharedCollection = this.decoSavedThemeService.addDecoSavedThemeToCollectionIfMissing<IDecoSavedTheme>(
      this.decoSavedThemesSharedCollection,
      ...(decoThemes.decoSavedThemes ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.decoSavedThemeService
      .query()
      .pipe(map((res: HttpResponse<IDecoSavedTheme[]>) => res.body ?? []))
      .pipe(
        map((decoSavedThemes: IDecoSavedTheme[]) =>
          this.decoSavedThemeService.addDecoSavedThemeToCollectionIfMissing<IDecoSavedTheme>(
            decoSavedThemes,
            ...(this.decoThemes?.decoSavedThemes ?? [])
          )
        )
      )
      .subscribe((decoSavedThemes: IDecoSavedTheme[]) => (this.decoSavedThemesSharedCollection = decoSavedThemes));
  }
}
