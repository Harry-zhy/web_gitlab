import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivitiesService } from 'app/activities/activities.service';
import { NewActivityCompany } from 'app/entities/activity-company/activity-company.model';

@Component({
  selector: 'jhi-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  constructor(private router: Router, private activitiesService: ActivitiesService) {}

  ngOnInit(): void {}

  allCompaniesNamesArray: any[] = [];

  getbookedcompanyNames(): void {
    this.router.navigate(['/bookactivitypage']);
    let flag: boolean = false;
    let allCompaniesNames = this.activitiesService.getcompanynamesfromthebookedactivity({ flag });
    allCompaniesNames.subscribe(names => {
      this.allCompaniesNamesArray = names;
    });
  }

  selfpage(): void {
    this.router.navigate(['/selfactivitypage']);
  }

  next(): void {}

  previous(): void {}
}
