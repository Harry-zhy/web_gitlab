import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-bookedactivitypage',
  templateUrl: './bookedactivitypage.component.html',
  styleUrls: ['./bookedactivitypage.component.scss'],
})
export class BookedactivitypageComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  backactivities(): void {
    this.router.navigate(['/activities']);
  }

  saveactivitytoitinerary(): void {}
}
