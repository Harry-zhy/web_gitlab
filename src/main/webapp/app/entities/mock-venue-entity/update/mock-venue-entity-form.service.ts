import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMockVenueEntity, NewMockVenueEntity } from '../mock-venue-entity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMockVenueEntity for edit and NewMockVenueEntityFormGroupInput for create.
 */
type MockVenueEntityFormGroupInput = IMockVenueEntity | PartialWithRequiredKeyOf<NewMockVenueEntity>;

type MockVenueEntityFormDefaults = Pick<NewMockVenueEntity, 'id'>;

type MockVenueEntityFormGroupContent = {
  id: FormControl<IMockVenueEntity['id'] | NewMockVenueEntity['id']>;
  name: FormControl<IMockVenueEntity['name']>;
  companyName: FormControl<IMockVenueEntity['companyName']>;
  location: FormControl<IMockVenueEntity['location']>;
  rating: FormControl<IMockVenueEntity['rating']>;
  description: FormControl<IMockVenueEntity['description']>;
  contact: FormControl<IMockVenueEntity['contact']>;
};

export type MockVenueEntityFormGroup = FormGroup<MockVenueEntityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MockVenueEntityFormService {
  createMockVenueEntityFormGroup(mockVenueEntity: MockVenueEntityFormGroupInput = { id: null }): MockVenueEntityFormGroup {
    const mockVenueEntityRawValue = {
      ...this.getFormDefaults(),
      ...mockVenueEntity,
    };
    return new FormGroup<MockVenueEntityFormGroupContent>({
      id: new FormControl(
        { value: mockVenueEntityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(mockVenueEntityRawValue.name),
      companyName: new FormControl(mockVenueEntityRawValue.companyName),
      location: new FormControl(mockVenueEntityRawValue.location),
      rating: new FormControl(mockVenueEntityRawValue.rating, {
        validators: [Validators.required, Validators.min(0), Validators.max(5)],
      }),
      description: new FormControl(mockVenueEntityRawValue.description),
      contact: new FormControl(mockVenueEntityRawValue.contact),
    });
  }

  getMockVenueEntity(form: MockVenueEntityFormGroup): IMockVenueEntity | NewMockVenueEntity {
    return form.getRawValue() as IMockVenueEntity | NewMockVenueEntity;
  }

  resetForm(form: MockVenueEntityFormGroup, mockVenueEntity: MockVenueEntityFormGroupInput): void {
    const mockVenueEntityRawValue = { ...this.getFormDefaults(), ...mockVenueEntity };
    form.reset(
      {
        ...mockVenueEntityRawValue,
        id: { value: mockVenueEntityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MockVenueEntityFormDefaults {
    return {
      id: null,
    };
  }
}
