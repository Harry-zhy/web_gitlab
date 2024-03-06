import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivitiesService } from 'app/activities/activities.service';

@Component({
  selector: 'jhi-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  constructor(private router: Router, private activitiesService: ActivitiesService) {}

  ngOnInit(): void {}

  bookpage(): void {
    this.router.navigate(['/bookactivitypage']);
  }

  //  getBookedActivityNames(): void{
  //    flag: boolean = false;
  //    this.activitiesService.gettingallbookedactivity({flag})}
}
