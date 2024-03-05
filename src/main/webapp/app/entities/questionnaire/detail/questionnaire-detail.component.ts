import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuestionnaire } from '../questionnaire.model';

@Component({
  selector: 'jhi-questionnaire-detail',
  templateUrl: './questionnaire-detail.component.html',
})
export class QuestionnaireDetailComponent implements OnInit {
  questionnaire: IQuestionnaire | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ questionnaire }) => {
      this.questionnaire = questionnaire;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
