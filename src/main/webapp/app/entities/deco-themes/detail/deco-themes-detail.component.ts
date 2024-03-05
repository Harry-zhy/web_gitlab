import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDecoThemes } from '../deco-themes.model';

@Component({
  selector: 'jhi-deco-themes-detail',
  templateUrl: './deco-themes-detail.component.html',
})
export class DecoThemesDetailComponent implements OnInit {
  decoThemes: IDecoThemes | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoThemes }) => {
      this.decoThemes = decoThemes;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
