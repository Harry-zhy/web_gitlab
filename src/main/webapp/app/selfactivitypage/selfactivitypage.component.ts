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
  public selfActivity: any;
  constructor(private router: Router, private service: ActivitiesService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation != null) {
      const state = navigation.extras.state as {
        activity: IActivitySelf;
      };

      this.selfActivity = state.activity;
    }
  }

  public ideaName: String = '';
  public ideasArray: any[] = [];
  public imagesArray: any[] = [];
  public ratingsArray: number[] = [];
  public rating: number = 0;
  public ideaDescription: String = '';

  ngOnInit(): void {
    console.log(this.selfActivity);
    this.showName(this.selfActivity.name);
    this.getIdeaData();
    this.calculateRatings();
    this.showDescription(this.selfActivity.description);
    let i: number = 0;
    while (i < this.ideasArray.length) {
      document.getElementById('destination')!.innerHTML += '<ul class="ideasText">' + this.ideasArray[i] + '</ul>';
      i = i + 1;
    }
  }

  backactivities(): void {
    this.router.navigate(['/activities']);
  }

  saveactivitytoitinerary(): void {}

  showDescription(names: String): void {
    this.ideaDescription = names;
  }

  getIdeaData(): void {
    //     let nameO = this.service.getSelfActivityName(this.selfActivity);
    //     nameO.subscribe(names => {
    //       this.showName(names);
    //     });
    let ideasO = this.service.getSelfActivityIdeas(this.selfActivity);
    ideasO.subscribe(ideas => {
      this.showIdeas(ideas);
    });
    let imagesArrayO = this.service.getSelfActivityImages(this.selfActivity);
    imagesArrayO.subscribe(images => {
      this.showImages(images);
    });
    let ratingsArrayO = this.service.getSelfActivityRating(this.selfActivity);
    ratingsArrayO.subscribe(ratings => {
      this.showRatings(ratings);
    });
  }

  calculateRatings(): void {
    let i: number = 0;
    let total: number = 0;
    while (i < this.ratingsArray.length) {
      total = total + this.ratingsArray[i];
      i = i + 1;
    }
    this.rating = total / this.ratingsArray.length;
  }

  showName(name: String): void {
    this.ideaName = this.selfActivity.name;
  }

  showIdeas(ideas: any[]): void {
    this.ideasArray = ideas;
  }

  showImages(images: any[]): void {
    this.imagesArray = images;
  }

  showRatings(ratings: any[]): void {
    this.ratingsArray = ratings;
  }
}
