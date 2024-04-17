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
    let param = this.getElement();
    let api = this.applicationConfigService.getEndpointFor('api/activity-companiesNames');
    return this.http.get<any[]>(`${api}/${param}`);
  }

  getcompanycontactdetails(): Observable<any> {
    let param = this.getElement();
    let api = this.applicationConfigService.getEndpointFor('api/activity-companiesContactDetails');
    return this.http.get<any>(`${api}/${param}`);
  }

  getcompanyAbout(): Observable<any> {
    let param = this.getElement();
    let api = this.applicationConfigService.getEndpointFor('api/activity-companiesAbout');
    return this.http.get<any>(`${api}/${param}`);
  }

  getcompanyimages(): Observable<any> {
    let param = this.getElement();
    let api = this.applicationConfigService.getEndpointFor('api/activity-companiesImage');
    return this.http.get<any>(`${api}/${param}`);
  }

  getcompanyratings(): Observable<any> {
    let param = this.getElement();
    let api = this.applicationConfigService.getEndpointFor('api/activity-companiesRatings');
    return this.http.get<any>(`${api}/${param}`);
  }

  getcompanyProfiles(): Observable<any> {
    let param = this.getElement();
    let api = this.applicationConfigService.getEndpointFor('api/activity-companiesProfile');
    return this.http.get<any>(`${api}/${param}`);
  }

  getSelfActivityName(): Observable<any> {
    let param = this.getElementSelf();
    let api = this.applicationConfigService.getEndpointFor('api/activity-selvesOneName');
    return this.http.get<any>(`${api}/${param}`);
  }

  getSelfActivityDescription(): Observable<any> {
    let param = this.getElementSelf();
    let api = this.applicationConfigService.getEndpointFor('api/activity-selvesDescription');
    return this.http.get<any>(`${api}/${param}`);
  }

  getSelfActivityIdeas(): Observable<any> {
    let param = this.getElementSelf();
    let api = this.applicationConfigService.getEndpointFor('api/activity-selvesIdeas');
    return this.http.get<any>(`${api}/${param}`);
  }

  getSelfActivityImages(): Observable<any> {
    let param = this.getElementSelf();
    let api = this.applicationConfigService.getEndpointFor('api/activity-selvesImages');
    return this.http.get<any>(`${api}/${param}`);
  }

  getSelfActivityRating(): Observable<any> {
    let param = this.getElementSelf();
    let api = this.applicationConfigService.getEndpointFor('api/activity-selvesRatings');
    return this.http.get<any>(`${api}/${param}`);
  }
}
