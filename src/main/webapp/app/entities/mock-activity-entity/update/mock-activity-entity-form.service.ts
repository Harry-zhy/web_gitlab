import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMockActivityEntity, NewMockActivityEntity } from '../mock-activity-entity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMockActivityEntity for edit and NewMockActivityEntityFormGroupInput for create.
 */
type MockActivityEntityFormGroupInput = IMockActivityEntity | PartialWithRequiredKeyOf<NewMockActivityEntity>;

type MockActivityEntityFormDefaults = Pick<NewMockActivityEntity, 'id'>;

type MockActivityEntityFormGroupContent = {
  id: FormControl<IMockActivityEntity['id'] | NewMockActivityEntity['id']>;
  name: FormControl<IMockActivityEntity['name']>;
  companyName: FormControl<IMockActivityEntity['companyName']>;
  rating: FormControl<IMockActivityEntity['rating']>;
  description: FormControl<IMockActivityEntity['description']>;
  quantity: FormControl<IMockActivityEntity['quantity']>;
  contact: FormControl<IMockActivityEntity['contact']>;
};

export type MockActivityEntityFormGroup = FormGroup<MockActivityEntityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MockActivityEntityFormService {
  createMockActivityEntityFormGroup(mockActivityEntity: MockActivityEntityFormGroupInput = { id: null }): MockActivityEntityFormGroup {
    const mockActivityEntityRawValue = {
      ...this.getFormDefaults(),
      ...mockActivityEntity,
    };
    return new FormGroup<MockActivityEntityFormGroupContent>({
      id: new FormControl(
        { value: mockActivityEntityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(mockActivityEntityRawValue.name),
      companyName: new FormControl(mockActivityEntityRawValue.companyName),
      rating: new FormControl(mockActivityEntityRawValue.rating, {
        validators: [Validators.required, Validators.min(0), Validators.max(5)],
      }),
      description: new FormControl(mockActivityEntityRawValue.description),
      quantity: new FormControl(mockActivityEntityRawValue.quantity),
      contact: new FormControl(mockActivityEntityRawValue.contact),
    });
  }

  getMockActivityEntity(form: MockActivityEntityFormGroup): IMockActivityEntity | NewMockActivityEntity {
    return form.getRawValue() as IMockActivityEntity | NewMockActivityEntity;
  }

  resetForm(form: MockActivityEntityFormGroup, mockActivityEntity: MockActivityEntityFormGroupInput): void {
    const mockActivityEntityRawValue = { ...this.getFormDefaults(), ...mockActivityEntity };
    form.reset(
      {
        ...mockActivityEntityRawValue,
        id: { value: mockActivityEntityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MockActivityEntityFormDefaults {
    return {
      id: null,
    };
  }
}
