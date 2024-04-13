import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivitiesService } from 'app/activities/activities.service';
import { Observable } from 'rxjs';
import { IActivitySelf } from 'app/entities/activity-self/activity-self.model';
import { NewActivitySelf } from 'app/entities/activity-self/activity-self.model';

@Component({
  selector: 'jhi-selfactivitypage',
  templateUrl: './selfactivitypage.component.html',
  styleUrls: ['./selfactivitypage.component.scss'],
})
export class SelfactivitypageComponent implements OnInit {
  constructor(private router: Router, private service: ActivitiesService) {}

  //selfA: IActivitySelf;

  //name: Observable<any>= new Observable<any>;
  //description: Observable<any>;
  //ideas: Observable<any>;

  ngOnInit(): void {}
  backactivities(): void {
    this.router.navigate(['/activities']);
  }

  saveactivitytoitinerary(): void {}

  getSelfName(): void {
    //this.name = this.service.getSelfActivityName(this.selfA);
  }

  getIdeas(): void {
    //this.ideas = this.service.getSelfActivityIdeas(this.selfA);
  }

  getImages(): void {}

  getRating(): void {}
}
