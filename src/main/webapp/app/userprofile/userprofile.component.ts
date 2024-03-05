import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  catererspage(): void {
    this.router.navigate(['/caterers']);
  }
  venuespage(): void {
    this.router.navigate(['/venues']);
  }

  activitiespage(): void {
    this.router.navigate(['/activities']);
  }

  feedbackpage(): void {
    this.router.navigate(['/feedback']);
  }

  decorationspage(): void {
    this.router.navigate(['/decorations']);
  }
}
