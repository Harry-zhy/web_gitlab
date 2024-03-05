import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMockCatererEntity, NewMockCatererEntity } from '../mock-caterer-entity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMockCatererEntity for edit and NewMockCatererEntityFormGroupInput for create.
 */
type MockCatererEntityFormGroupInput = IMockCatererEntity | PartialWithRequiredKeyOf<NewMockCatererEntity>;

type MockCatererEntityFormDefaults = Pick<NewMockCatererEntity, 'id'>;

type MockCatererEntityFormGroupContent = {
  id: FormControl<IMockCatererEntity['id'] | NewMockCatererEntity['id']>;
  name: FormControl<IMockCatererEntity['name']>;
  cuisine: FormControl<IMockCatererEntity['cuisine']>;
  rating: FormControl<IMockCatererEntity['rating']>;
  description: FormControl<IMockCatererEntity['description']>;
  quantity: FormControl<IMockCatererEntity['quantity']>;
  contact: FormControl<IMockCatererEntity['contact']>;
};

export type MockCatererEntityFormGroup = FormGroup<MockCatererEntityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MockCatererEntityFormService {
  createMockCatererEntityFormGroup(mockCatererEntity: MockCatererEntityFormGroupInput = { id: null }): MockCatererEntityFormGroup {
    const mockCatererEntityRawValue = {
      ...this.getFormDefaults(),
      ...mockCatererEntity,
    };
    return new FormGroup<MockCatererEntityFormGroupContent>({
      id: new FormControl(
        { value: mockCatererEntityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(mockCatererEntityRawValue.name),
      cuisine: new FormControl(mockCatererEntityRawValue.cuisine),
      rating: new FormControl(mockCatererEntityRawValue.rating, {
        validators: [Validators.required, Validators.min(0), Validators.max(5)],
      }),
      description: new FormControl(mockCatererEntityRawValue.description),
      quantity: new FormControl(mockCatererEntityRawValue.quantity),
      contact: new FormControl(mockCatererEntityRawValue.contact),
    });
  }

  getMockCatererEntity(form: MockCatererEntityFormGroup): IMockCatererEntity | NewMockCatererEntity {
    return form.getRawValue() as IMockCatererEntity | NewMockCatererEntity;
  }

  resetForm(form: MockCatererEntityFormGroup, mockCatererEntity: MockCatererEntityFormGroupInput): void {
    const mockCatererEntityRawValue = { ...this.getFormDefaults(), ...mockCatererEntity };
    form.reset(
      {
        ...mockCatererEntityRawValue,
        id: { value: mockCatererEntityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MockCatererEntityFormDefaults {
    return {
      id: null,
    };
  }
}
