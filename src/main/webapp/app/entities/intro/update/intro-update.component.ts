import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IntroFormService, IntroFormGroup } from './intro-form.service';
import { IIntro } from '../intro.model';
import { IntroService } from '../service/intro.service';

@Component({
  selector: 'jhi-intro-update',
  templateUrl: './intro-update.component.html',
})
export class IntroUpdateComponent implements OnInit {
  isSaving = false;
  intro: IIntro | null = null;

  editForm: IntroFormGroup = this.introFormService.createIntroFormGroup();

  constructor(
    protected introService: IntroService,
    protected introFormService: IntroFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ intro }) => {
      this.intro = intro;
      if (intro) {
        this.updateForm(intro);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const intro = this.introFormService.getIntro(this.editForm);
    if (intro.id !== null) {
      this.subscribeToSaveResponse(this.introService.update(intro));
    } else {
      this.subscribeToSaveResponse(this.introService.create(intro));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIntro>>): void {
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

  protected updateForm(intro: IIntro): void {
    this.intro = intro;
    this.introFormService.resetForm(this.editForm, intro);
  }
}
