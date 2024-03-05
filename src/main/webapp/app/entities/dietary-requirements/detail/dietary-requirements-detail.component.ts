import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDietaryRequirements } from '../dietary-requirements.model';

@Component({
  selector: 'jhi-dietary-requirements-detail',
  templateUrl: './dietary-requirements-detail.component.html',
})
export class DietaryRequirementsDetailComponent implements OnInit {
  dietaryRequirements: IDietaryRequirements | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dietaryRequirements }) => {
      this.dietaryRequirements = dietaryRequirements;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
