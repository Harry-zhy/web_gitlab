import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IQuestionnaire, NewQuestionnaire } from '../questionnaire.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IQuestionnaire for edit and NewQuestionnaireFormGroupInput for create.
 */
type QuestionnaireFormGroupInput = IQuestionnaire | PartialWithRequiredKeyOf<NewQuestionnaire>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IQuestionnaire | NewQuestionnaire> = Omit<T, 'date'> & {
  date?: string | null;
};

type QuestionnaireFormRawValue = FormValueOf<IQuestionnaire>;

type NewQuestionnaireFormRawValue = FormValueOf<NewQuestionnaire>;

type QuestionnaireFormDefaults = Pick<NewQuestionnaire, 'id' | 'date'>;

type QuestionnaireFormGroupContent = {
  id: FormControl<QuestionnaireFormRawValue['id'] | NewQuestionnaire['id']>;
  date: FormControl<QuestionnaireFormRawValue['date']>;
  userName: FormControl<QuestionnaireFormRawValue['userName']>;
  questionnaire: FormControl<QuestionnaireFormRawValue['questionnaire']>;
};

export type QuestionnaireFormGroup = FormGroup<QuestionnaireFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class QuestionnaireFormService {
  createQuestionnaireFormGroup(questionnaire: QuestionnaireFormGroupInput = { id: null }): QuestionnaireFormGroup {
    const questionnaireRawValue = this.convertQuestionnaireToQuestionnaireRawValue({
      ...this.getFormDefaults(),
      ...questionnaire,
    });
    return new FormGroup<QuestionnaireFormGroupContent>({
      id: new FormControl(
        { value: questionnaireRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      date: new FormControl(questionnaireRawValue.date, {
        validators: [Validators.required],
      }),
      userName: new FormControl(questionnaireRawValue.userName, {
        validators: [Validators.required],
      }),
      questionnaire: new FormControl(questionnaireRawValue.questionnaire),
    });
  }

  getQuestionnaire(form: QuestionnaireFormGroup): IQuestionnaire | NewQuestionnaire {
    return this.convertQuestionnaireRawValueToQuestionnaire(form.getRawValue() as QuestionnaireFormRawValue | NewQuestionnaireFormRawValue);
  }

  resetForm(form: QuestionnaireFormGroup, questionnaire: QuestionnaireFormGroupInput): void {
    const questionnaireRawValue = this.convertQuestionnaireToQuestionnaireRawValue({ ...this.getFormDefaults(), ...questionnaire });
    form.reset(
      {
        ...questionnaireRawValue,
        id: { value: questionnaireRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): QuestionnaireFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      date: currentTime,
    };
  }

  private convertQuestionnaireRawValueToQuestionnaire(
    rawQuestionnaire: QuestionnaireFormRawValue | NewQuestionnaireFormRawValue
  ): IQuestionnaire | NewQuestionnaire {
    return {
      ...rawQuestionnaire,
      date: dayjs(rawQuestionnaire.date, DATE_TIME_FORMAT),
    };
  }

  private convertQuestionnaireToQuestionnaireRawValue(
    questionnaire: IQuestionnaire | (Partial<NewQuestionnaire> & QuestionnaireFormDefaults)
  ): QuestionnaireFormRawValue | PartialWithRequiredKeyOf<NewQuestionnaireFormRawValue> {
    return {
      ...questionnaire,
      date: questionnaire.date ? questionnaire.date.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
