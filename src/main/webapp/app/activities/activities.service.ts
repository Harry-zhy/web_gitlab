import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBookedActivity } from 'app/entities/booked-activity/booked-activity.model';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

export class companyModel {
  constructor(public flag: boolean) {}
}

export class bookedActivityEntityFrontEnd {
  constructor(public bookedActivity: IBookedActivity) {}
}

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  public Index: number = 0;
  public BookedArray: Observable<any[]> = EMPTY;
  public SelfArray: Observable<any[]> = EMPTY;
  public IdeaName: String = '';

  getElement(): Observable<any[]> {
    return this.BookedArray.pipe(
      map((array: any[]) => {
        return array[this.Index];
      })
    );
  }

  getElementSelf(): any {
    this.SelfArray.subscribe(names => {
      let SelfActivitiesArray = names;
      let i: number = this.Index;
      return SelfActivitiesArray[i];
    });
  }

  setBookedArray(): void {
    this.BookedArray = this.getAllBookedActivityEntities();
  }

  setSelfArray(): void {
    this.SelfArray = this.getAllSelfActivityEntities();
  }

  getAllBookedActivityEntities(): Observable<any[]> {
    return this.http.get<any[]>(this.applicationConfigService.getEndpointFor('api/booked-activities'));
  }

  getAllSelfActivityEntities(): Observable<any[]> {
    return this.http.get<any[]>(this.applicationConfigService.getEndpointFor('api/activity-selves'));
  }

  getAllBookedActivitiesNames(): Observable<any[]> {
    return this.http.get<any[]>(this.applicationConfigService.getEndpointFor('api/booked-activities-names'));
  }

  getAllSelfActivitiesNames(): Observable<any[]> {
    return this.http.get<any[]>(this.applicationConfigService.getEndpointFor('api/self-activities-names'));
  }

  getcompanynamesfromthebookedactivity(): Observable<any[]> {
    console.log(this.getElement());

    return this.http.get<any[]>(this.applicationConfigService.getEndpointFor('api/activity-companiesNames/' + this.getElement()));
  }

  getcompanycontactdetails(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-companiesContactDetails/' + this.getElement()));
  }

  getcompanyAbout(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-companiesAbout/' + this.getElement()));
  }

  getcompanyimages(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-companiesImage/' + this.getElement()));
  }

  getcompanyratings(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-companiesRatings/' + this.getElement()));
  }

  getcompanyProfiles(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-companiesProfile/' + this.getElement()));
  }

  getSelfActivityName(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-selvesOneName/' + this.getElementSelf()));
  }

  getSelfActivityDescription(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-selvesDescription/' + this.getElementSelf()));
  }

  getSelfActivityIdeas(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-selvesIdeas/' + this.getElementSelf()));
  }

  getSelfActivityImages(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-selvesImages/' + this.getElementSelf()));
  }

  getSelfActivityRating(): Observable<any> {
    return this.http.get<any>(this.applicationConfigService.getEndpointFor('api/activity-selvesRating/' + this.getElementSelf()));
  }
}
