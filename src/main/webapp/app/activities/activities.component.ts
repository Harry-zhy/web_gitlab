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
  allCompanyAboutsArray: any[] = [];
  allCompanyCDArray: any[] = [];
  allCompanyImagesArray: any[] = [];
  allCompanyRatingsArray: any[] = [];
  allCompanyProfilesArray: any[] = [];

  Name: String = '';
  About: String = '';
  CD: any[] = [];
  Images: any[] = [];
  Ratings: any[] = [];
  Profile: any[] = [];

  companyCounter: number = 0;

  getAllCompanyData(): void {
    //navigating to the booked activity page
    this.router.navigate(['/bookactivitypage']);
    let flag: boolean = false;
    this.companyCounter = 0;

    //getting all the data for every company related to that booked activity
    let allCompaniesNames = this.activitiesService.getcompanynamesfromthebookedactivity({ flag });
    allCompaniesNames.subscribe(names => {
      this.allCompaniesNamesArray = names;
    });

    let allCompanyAbouts = this.activitiesService.getcompanyAbout({ flag });
    allCompanyAbouts.subscribe(abouts => {
      this.allCompanyAboutsArray = abouts;
    });

    let allCompaniesCD = this.activitiesService.getcompanycontactdetails({ flag });
    allCompaniesCD.subscribe(CD => {
      this.allCompanyCDArray = CD;
    });

    let allCompaniesImages = this.activitiesService.getcompanyimages({ flag });
    allCompaniesImages.subscribe(images => {
      this.allCompanyImagesArray = images;
    });

    let allCompaniesRatings = this.activitiesService.getcompanyratings({ flag });
    allCompaniesRatings.subscribe(ratings => {
      this.allCompanyRatingsArray = ratings;
    });

    let allCompaniesProfiles = this.activitiesService.getcompanyProfiles({ flag });
    allCompaniesProfiles.subscribe(profiles => {
      this.allCompanyProfilesArray = profiles;
    });
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

  selfpage(): void {
    this.router.navigate(['/selfactivitypage']);
  }

  next(): void {}

  previous(): void {}
}
