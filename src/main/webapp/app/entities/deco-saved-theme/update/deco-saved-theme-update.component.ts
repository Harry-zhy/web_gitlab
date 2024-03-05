import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DecoSavedThemeFormService, DecoSavedThemeFormGroup } from './deco-saved-theme-form.service';
import { IDecoSavedTheme } from '../deco-saved-theme.model';
import { DecoSavedThemeService } from '../service/deco-saved-theme.service';

@Component({
  selector: 'jhi-deco-saved-theme-update',
  templateUrl: './deco-saved-theme-update.component.html',
})
export class DecoSavedThemeUpdateComponent implements OnInit {
  isSaving = false;
  decoSavedTheme: IDecoSavedTheme | null = null;

  editForm: DecoSavedThemeFormGroup = this.decoSavedThemeFormService.createDecoSavedThemeFormGroup();

  constructor(
    protected decoSavedThemeService: DecoSavedThemeService,
    protected decoSavedThemeFormService: DecoSavedThemeFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoSavedTheme }) => {
      this.decoSavedTheme = decoSavedTheme;
      if (decoSavedTheme) {
        this.updateForm(decoSavedTheme);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const decoSavedTheme = this.decoSavedThemeFormService.getDecoSavedTheme(this.editForm);
    if (decoSavedTheme.id !== null) {
      this.subscribeToSaveResponse(this.decoSavedThemeService.update(decoSavedTheme));
    } else {
      this.subscribeToSaveResponse(this.decoSavedThemeService.create(decoSavedTheme));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDecoSavedTheme>>): void {
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

  protected updateForm(decoSavedTheme: IDecoSavedTheme): void {
    this.decoSavedTheme = decoSavedTheme;
    this.decoSavedThemeFormService.resetForm(this.editForm, decoSavedTheme);
  }
}
