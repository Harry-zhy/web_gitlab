import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MockVenueEntityFormService, MockVenueEntityFormGroup } from './mock-venue-entity-form.service';
import { IMockVenueEntity } from '../mock-venue-entity.model';
import { MockVenueEntityService } from '../service/mock-venue-entity.service';

@Component({
  selector: 'jhi-mock-venue-entity-update',
  templateUrl: './mock-venue-entity-update.component.html',
})
export class MockVenueEntityUpdateComponent implements OnInit {
  isSaving = false;
  mockVenueEntity: IMockVenueEntity | null = null;

  editForm: MockVenueEntityFormGroup = this.mockVenueEntityFormService.createMockVenueEntityFormGroup();

  constructor(
    protected mockVenueEntityService: MockVenueEntityService,
    protected mockVenueEntityFormService: MockVenueEntityFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mockVenueEntity }) => {
      this.mockVenueEntity = mockVenueEntity;
      if (mockVenueEntity) {
        this.updateForm(mockVenueEntity);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mockVenueEntity = this.mockVenueEntityFormService.getMockVenueEntity(this.editForm);
    if (mockVenueEntity.id !== null) {
      this.subscribeToSaveResponse(this.mockVenueEntityService.update(mockVenueEntity));
    } else {
      this.subscribeToSaveResponse(this.mockVenueEntityService.create(mockVenueEntity));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMockVenueEntity>>): void {
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

  protected updateForm(mockVenueEntity: IMockVenueEntity): void {
    this.mockVenueEntity = mockVenueEntity;
    this.mockVenueEntityFormService.resetForm(this.editForm, mockVenueEntity);
  }
}
