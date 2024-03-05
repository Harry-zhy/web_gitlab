import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MockActivityEntityFormService, MockActivityEntityFormGroup } from './mock-activity-entity-form.service';
import { IMockActivityEntity } from '../mock-activity-entity.model';
import { MockActivityEntityService } from '../service/mock-activity-entity.service';

@Component({
  selector: 'jhi-mock-activity-entity-update',
  templateUrl: './mock-activity-entity-update.component.html',
})
export class MockActivityEntityUpdateComponent implements OnInit {
  isSaving = false;
  mockActivityEntity: IMockActivityEntity | null = null;

  editForm: MockActivityEntityFormGroup = this.mockActivityEntityFormService.createMockActivityEntityFormGroup();

  constructor(
    protected mockActivityEntityService: MockActivityEntityService,
    protected mockActivityEntityFormService: MockActivityEntityFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mockActivityEntity }) => {
      this.mockActivityEntity = mockActivityEntity;
      if (mockActivityEntity) {
        this.updateForm(mockActivityEntity);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mockActivityEntity = this.mockActivityEntityFormService.getMockActivityEntity(this.editForm);
    if (mockActivityEntity.id !== null) {
      this.subscribeToSaveResponse(this.mockActivityEntityService.update(mockActivityEntity));
    } else {
      this.subscribeToSaveResponse(this.mockActivityEntityService.create(mockActivityEntity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMockActivityEntity>>): void {
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

  protected updateForm(mockActivityEntity: IMockActivityEntity): void {
    this.mockActivityEntity = mockActivityEntity;
    this.mockActivityEntityFormService.resetForm(this.editForm, mockActivityEntity);
  }
}
