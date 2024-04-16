import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivitiesService } from 'app/activities/activities.service';
import { NewActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { Observable } from 'rxjs';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';

@Component({
  selector: 'jhi-bookedactivitypage',
  templateUrl: './bookedactivitypage.component.html',
  styleUrls: ['./bookedactivitypage.component.scss'],
})
export class BookedactivitypageComponent implements OnInit {
  constructor(private router: Router, private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    this.getAllCompanyData();
    this.calculateRatings();
  }

  backactivities(): void {
    this.router.navigate(['/activities']);
  }

  saveactivitytoitinerary(): void {}

  allCompaniesNamesArray: any[] = [];
  allCompanyAboutsArray: any[] = [];
  allCompanyCDArray: any[] = [];
  allCompanyImagesArray: any[] = [];
  allCompanyRatingsArray: any[] = [];
  allCompanyProfilesArray: any[] = [];

  public Name: String = '';
  public About: String = '';
  public CD: any[] = [];
  public Images: any[] = [];
  public Ratings: any[] = [];
  public Profile: any[] = [];
  public rating: number = 0;

  companyCounter: number = 0;

  getAllCompanyData(): void {
    let flag: boolean = false;
    this.companyCounter = 0;

    //getting all the data for every company related to that booked activity
    let allCompaniesNames = this.activitiesService.getcompanynamesfromthebookedactivity();
    allCompaniesNames.subscribe(names => {
      this.allCompaniesNamesArray = names;
    });

    //let allCompanyAbouts = this.activitiesService.getcompanyAbout();
    //allCompanyAbouts.subscribe(abouts => {
    //  this.allCompanyAboutsArray = abouts;
    //});

    //let allCompaniesCD = this.activitiesService.getcompanycontactdetails();
    //allCompaniesCD.subscribe(CD => {
    //  this.allCompanyCDArray = CD;
    //});

    //let allCompaniesImages = this.activitiesService.getcompanyimages();
    //allCompaniesImages.subscribe(images => {
    //  this.allCompanyImagesArray = images;
    //});

    //let allCompaniesRatings = this.activitiesService.getcompanyratings();
    //allCompaniesRatings.subscribe(ratings => {
    //  this.allCompanyRatingsArray = ratings;
    //});

    //let allCompaniesProfiles = this.activitiesService.getcompanyProfiles();
    //allCompaniesProfiles.subscribe(profiles => {
    //  this.allCompanyProfilesArray = profiles;
    //});
    //displaying the first companys data
    this.displayCompanyData();
  }

  displayCompanyData(): void {
    this.Name = this.allCompaniesNamesArray[this.companyCounter];
    this.About = this.allCompanyAboutsArray[this.companyCounter];
    this.CD[0] = this.allCompanyCDArray[this.companyCounter];
    this.Images[0] = this.allCompanyImagesArray[this.companyCounter];
    this.Ratings[0] = this.allCompanyRatingsArray[this.companyCounter];
    this.Profile[0] = this.allCompanyProfilesArray[this.companyCounter];
  }

  nextCompany(): void {
    this.companyCounter = this.companyCounter + 1;
    this.displayCompanyData();
  }

  calculateRatings(): void {
    let i: number = 0;
    let total: number = 0;
    while (i < this.Ratings[0].length) {
      total = total + this.Ratings[0][i];
      i = i + 1;
    }
    this.rating = total / this.Ratings[0].length;
  }
}
