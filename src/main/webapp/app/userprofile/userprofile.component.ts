import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';

@Component({
  selector: 'jhi-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent implements OnInit {
  constructor(private router: Router) {}

  progress: number = 0;

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

  isDateTime(event: Event) {
    //console.log("in function");
    const dateTimeisChecked = event.target as HTMLInputElement;
    if (dateTimeisChecked.checked) {
      this.progress += 25;
      //console.log("checked");
      console.log(this.progress);
    } else {
      if (this.progress > 0) {
        this.progress -= 25;
        //console.log(this.progress);
      }
    }
  }

  isDecorations(event: Event) {
    //console.log("in function");
    const decorationisChecked = event.target as HTMLInputElement;
    if (decorationisChecked.checked) {
      this.progress += 25;
      //console.log(this.progress);
    } else {
      if (this.progress > 0) {
        this.progress -= 25;
        //console.log(this.progress);
      }
    }
  }

  isVendors(event: Event) {
    //console.log("in function");
    const vendorsisChecked = event.target as HTMLInputElement;
    if (vendorsisChecked.checked) {
      this.progress += 25;
      //console.log(this.progress);
    } else {
      if (this.progress > 0) {
        this.progress -= 25;
        //console.log(this.progress);
      }
    }
  }

  isVenue(event: Event) {
    //console.log("in function");
    const venueisChecked = event.target as HTMLInputElement;
    if (venueisChecked.checked) {
      this.progress += 25;
      //console.log(this.progress);
    } else {
      if (this.progress > 0) {
        this.progress -= 25;
        //console.log(this.progress);
      }
    }
  }
}
