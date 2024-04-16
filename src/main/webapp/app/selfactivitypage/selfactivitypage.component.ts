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

  public ideaName: String = '';
  public ideasArray: any[] = [];
  public imagesArray: any[] = [];
  public ratingsArray: number[] = [];
  public rating: number = 0;
  public ideaDescription: String = '';

  ngOnInit(): void {
    this.ideaName = this.service.IdeaName;
    this.getIdeaData();
    this.calculateRatings();
    this.getDescription();
  }

  backactivities(): void {
    this.router.navigate(['/activities']);
  }

  saveactivitytoitinerary(): void {}

  getDescription(): void {
    let nameO = this.service.getSelfActivityDescription();
    nameO.subscribe(names => {
      this.showDescription(names);
    });
  }

  showDescription(names: String): void {
    this.ideaDescription = names;
  }

  getIdeaData(): void {
    let nameO = this.service.getSelfActivityName();
    nameO.subscribe(names => {
      this.showName(names);
    });
    let ideasO = this.service.getSelfActivityIdeas();
    ideasO.subscribe(ideas => {
      this.showIdeas(ideas);
    });
    let imagesArrayO = this.service.getSelfActivityImages();
    imagesArrayO.subscribe(images => {
      this.showImages(images);
    });
    let ratingsArrayO = this.service.getSelfActivityRating();
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
    this.IdeaName = name;
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
