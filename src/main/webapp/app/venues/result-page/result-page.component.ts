import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.scss'],
})
export class ResultPageComponent implements OnInit {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/venues']);
  }

  ngOnInit(): void {}
}
