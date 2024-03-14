import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-selfactivitypage',
  templateUrl: './selfactivitypage.component.html',
  styleUrls: ['./selfactivitypage.component.scss'],
})
export class SelfactivitypageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  backactivities(): void {
    this.router.navigate(['/activities']);
  }

  saveactivitytoitinerary(): void {}
}
