import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MockCatererEntityFormService, MockCatererEntityFormGroup } from './mock-caterer-entity-form.service';
import { IMockCatererEntity } from '../mock-caterer-entity.model';
import { MockCatererEntityService } from '../service/mock-caterer-entity.service';

@Component({
  selector: 'jhi-mock-caterer-entity-update',
  templateUrl: './mock-caterer-entity-update.component.html',
})
export class MockCatererEntityUpdateComponent implements OnInit {
  isSaving = false;
  mockCatererEntity: IMockCatererEntity | null = null;

  editForm: MockCatererEntityFormGroup = this.mockCatererEntityFormService.createMockCatererEntityFormGroup();

  constructor(
    protected mockCatererEntityService: MockCatererEntityService,
    protected mockCatererEntityFormService: MockCatererEntityFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mockCatererEntity }) => {
      this.mockCatererEntity = mockCatererEntity;
      if (mockCatererEntity) {
        this.updateForm(mockCatererEntity);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mockCatererEntity = this.mockCatererEntityFormService.getMockCatererEntity(this.editForm);
    if (mockCatererEntity.id !== null) {
      this.subscribeToSaveResponse(this.mockCatererEntityService.update(mockCatererEntity));
    } else {
      this.subscribeToSaveResponse(this.mockCatererEntityService.create(mockCatererEntity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMockCatererEntity>>): void {
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

  protected updateForm(mockCatererEntity: IMockCatererEntity): void {
    this.mockCatererEntity = mockCatererEntity;
    this.mockCatererEntityFormService.resetForm(this.editForm, mockCatererEntity);
  }
}
