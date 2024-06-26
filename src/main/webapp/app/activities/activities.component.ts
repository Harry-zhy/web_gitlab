import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ActivitiesService } from 'app/activities/activities.service';
import { NewActivityCompany } from 'app/entities/activity-company/activity-company.model';
import { companyModel } from 'app/activities/activities.service';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';

@Component({
  selector: 'jhi-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {
  constructor(private router: Router, private activitiesService: ActivitiesService) {}

  isDarkMode: boolean = false;
  isDarkModeMenu: boolean = false;
  isDarkModeContainer: boolean = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.isDarkModeMenu = !this.isDarkModeMenu;
    this.isDarkModeContainer = !this.isDarkModeContainer;
  }

  public allBookedActivitiesArray: String[] = [];
  public allSelfActivitiesArray: String[] = [];
  public displayBooked1: String = '';
  public displayBooked2: String = '';
  public displayBooked3: String = '';
  public displayBooked4: String = '';
  public displaySelf1: String = '';
  public displaySelf2: String = '';
  public displaySelf3: String = '';
  public displaySelf4: String = '';
  public BookednextbuttonCounter: number = 0;
  public SelfnextbuttonCounter: number = 0;

  ngOnInit(): void {
    this.selfActivityNames();
    this.bookedActivityNames();
    this.activitiesService.setBookedArray();
    this.activitiesService.setSelfArray();
  }

  BookedActivityPage1(): void {
    this.activitiesService.Index = this.BookednextbuttonCounter;
    this.activitiesService.IdeaName = this.displaySelf1;
    this.activitiesService.BookedArray.subscribe(activity => {
      let navExtras: NavigationExtras = { state: { activity: activity[this.BookednextbuttonCounter] } };
      this.router.navigate(['/bookactivitypage'], navExtras);
    });
  }

  BookedActivityPage2(): void {
    this.activitiesService.Index = this.BookednextbuttonCounter + 1;
    this.activitiesService.IdeaName = this.displaySelf2;
    this.activitiesService.BookedArray.subscribe(activity => {
      let navExtras: NavigationExtras = { state: { activity: activity[this.BookednextbuttonCounter + 1] } };
      this.router.navigate(['/bookactivitypage'], navExtras);
    });
  }
  BookedActivityPage3(): void {
    this.activitiesService.Index = this.BookednextbuttonCounter + 2;

    this.activitiesService.IdeaName = this.displaySelf3;
    this.activitiesService.BookedArray.subscribe(activity => {
      let navExtras: NavigationExtras = { state: { activity: activity[this.BookednextbuttonCounter + 2] } };
      this.router.navigate(['/bookactivitypage'], navExtras);
    });
  }

  BookedActivityPage4(): void {
    this.activitiesService.Index = this.BookednextbuttonCounter + 3;
    this.activitiesService.IdeaName = this.displaySelf4;
    this.activitiesService.BookedArray.subscribe(activity => {
      let navExtras: NavigationExtras = { state: { activity: activity[this.BookednextbuttonCounter] } };
      this.router.navigate(['/bookactivitypage'], navExtras);
    });
  }

  selfActivityNames(): void {
    let allSelfNames = this.activitiesService.getAllSelfActivitiesNames();
    allSelfNames.subscribe(names => {
      let SelfActivitiesArray = names;
      let i: number = 0;
      while (i < SelfActivitiesArray.length) {
        this.allSelfActivitiesArray.push(SelfActivitiesArray[i]);
        i = i + 1;
      }
      this.shownewSelf();
    });
  }

  selfpage4(): void {
    this.activitiesService.Index = this.SelfnextbuttonCounter + 3;
    this.activitiesService.SelfArray.subscribe(activity => {
      let navExtras: NavigationExtras = { state: { activity: activity[this.SelfnextbuttonCounter + 3] } };
      this.router.navigate(['/selfactivitypage'], navExtras);
    });
  }

  selfpage3(): void {
    this.activitiesService.Index = this.SelfnextbuttonCounter + 2;
    this.activitiesService.SelfArray.subscribe(activity => {
      let navExtras: NavigationExtras = { state: { activity: activity[this.SelfnextbuttonCounter + 2] } };
      this.router.navigate(['/selfactivitypage'], navExtras);
    });
  }
  selfpage2(): void {
    this.activitiesService.Index = this.SelfnextbuttonCounter + 1;
    this.activitiesService.SelfArray.subscribe(activity => {
      let navExtras: NavigationExtras = { state: { activity: activity[this.SelfnextbuttonCounter + 1] } };
      this.router.navigate(['/selfactivitypage'], navExtras);
    });
  }
  selfpage1(): void {
    this.activitiesService.Index = this.SelfnextbuttonCounter;
    this.activitiesService.SelfArray.subscribe(activity => {
      let navExtras: NavigationExtras = { state: { activity: activity[this.SelfnextbuttonCounter] } };
      this.router.navigate(['/selfactivitypage'], navExtras);
    });
  }

  bookedActivityNames(): void {
    let allBookedNames = this.activitiesService.getAllBookedActivitiesNames();
    allBookedNames.subscribe(names => {
      let BookedActivitiesArray = names;
      let i: number = 0;
      while (i < BookedActivitiesArray.length) {
        this.allBookedActivitiesArray.push(BookedActivitiesArray[i]);
        i = i + 1;
      }
      this.shownewBooked();
    });
  }

  nextbooked(): void {
    if (this.BookednextbuttonCounter * 4 != this.allBookedActivitiesArray.length / 4) {
      this.BookednextbuttonCounter = this.BookednextbuttonCounter + 4;
      this.shownewBooked();
    }
  }

  previousbooked(): void {
    if (this.BookednextbuttonCounter != 0) {
      this.BookednextbuttonCounter = this.BookednextbuttonCounter - 4;
      this.shownewBooked();
    }
  }

  nextself(): void {
    if (this.SelfnextbuttonCounter * 4 != this.allSelfActivitiesArray.length / 4) {
      this.SelfnextbuttonCounter = this.SelfnextbuttonCounter + 4;
      this.shownewSelf();
    }
  }

  previousself(): void {
    if (this.SelfnextbuttonCounter != 0) {
      this.SelfnextbuttonCounter = this.SelfnextbuttonCounter - 4;
      this.shownewSelf();
    }
  }

  shownewBooked(): void {
    this.displayBooked1 = this.allBookedActivitiesArray[this.BookednextbuttonCounter];
    this.displayBooked2 = this.allBookedActivitiesArray[this.BookednextbuttonCounter + 1];
    this.displayBooked3 = this.allBookedActivitiesArray[this.BookednextbuttonCounter + 2];
    this.displayBooked4 = this.allBookedActivitiesArray[this.BookednextbuttonCounter + 3];
  }

  shownewSelf(): void {
    this.displaySelf1 = this.allSelfActivitiesArray[this.SelfnextbuttonCounter];
    this.displaySelf2 = this.allSelfActivitiesArray[this.SelfnextbuttonCounter + 1];
    this.displaySelf3 = this.allSelfActivitiesArray[this.SelfnextbuttonCounter + 2];
    this.displaySelf4 = this.allSelfActivitiesArray[this.SelfnextbuttonCounter + 3];
  }

  backUserProfile(): void {
    this.router.navigate(['/userprofile']);
  }
}
