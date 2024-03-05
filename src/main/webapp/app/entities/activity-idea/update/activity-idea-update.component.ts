import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ActivityIdeaFormService, ActivityIdeaFormGroup } from './activity-idea-form.service';
import { IActivityIdea } from '../activity-idea.model';
import { ActivityIdeaService } from '../service/activity-idea.service';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { ActivitySelfService } from 'app/entities/activity-self/service/activity-self.service';

@Component({
  selector: 'jhi-activity-idea-update',
  templateUrl: './activity-idea-update.component.html',
})
export class ActivityIdeaUpdateComponent implements OnInit {
  isSaving = false;
  activityIdea: IActivityIdea | null = null;

  activitySelvesSharedCollection: IActivitySelf[] = [];

  editForm: ActivityIdeaFormGroup = this.activityIdeaFormService.createActivityIdeaFormGroup();

  constructor(
    protected activityIdeaService: ActivityIdeaService,
    protected activityIdeaFormService: ActivityIdeaFormService,
    protected activitySelfService: ActivitySelfService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareActivitySelf = (o1: IActivitySelf | null, o2: IActivitySelf | null): boolean =>
    this.activitySelfService.compareActivitySelf(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityIdea }) => {
      this.activityIdea = activityIdea;
      if (activityIdea) {
        this.updateForm(activityIdea);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const activityIdea = this.activityIdeaFormService.getActivityIdea(this.editForm);
    if (activityIdea.id !== null) {
      this.subscribeToSaveResponse(this.activityIdeaService.update(activityIdea));
    } else {
      this.subscribeToSaveResponse(this.activityIdeaService.create(activityIdea));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActivityIdea>>): void {
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

  protected updateForm(activityIdea: IActivityIdea): void {
    this.activityIdea = activityIdea;
    this.activityIdeaFormService.resetForm(this.editForm, activityIdea);

    this.activitySelvesSharedCollection = this.activitySelfService.addActivitySelfToCollectionIfMissing<IActivitySelf>(
      this.activitySelvesSharedCollection,
      activityIdea.activitySelf
    );
  }

  protected loadRelationshipsOptions(): void {
    this.activitySelfService
      .query()
      .pipe(map((res: HttpResponse<IActivitySelf[]>) => res.body ?? []))
      .pipe(
        map((activitySelves: IActivitySelf[]) =>
          this.activitySelfService.addActivitySelfToCollectionIfMissing<IActivitySelf>(activitySelves, this.activityIdea?.activitySelf)
        )
      )
      .subscribe((activitySelves: IActivitySelf[]) => (this.activitySelvesSharedCollection = activitySelves));
  }
}
