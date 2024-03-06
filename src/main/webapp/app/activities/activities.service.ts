import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

export class bookedActivityModel {
  constructor(public flag: boolean) {}
}

//export class companyModel {
//  constructor(public activity: BookedActivity) {}
//}

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  //  getcompanyfromthebookedactivity(companyModel: companyModel): Observable<{}> {
  //    return this.http.post(this.applicationConfigService.getEndpointFor('api/activity-companies'), companyModel);
  //  }
  gettingallbookedactivity(bookedActivityModel: bookedActivityModel): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/booked-activities'), bookedActivityModel);
  }
}
