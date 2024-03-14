import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

export class companyModel {
  constructor(public flag: boolean) {}
}

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getcompanynamesfromthebookedactivity(companyModel: companyModel): Observable<any> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/activity-companiesNames'), companyModel);
  }

  getcompanycontactdetails(companyModel: companyModel): Observable<any> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/activity-companiesContactDetails'), companyModel);
  }

  getcompanyAbout(companyModel: companyModel): Observable<any> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/activity-companiesAbout'), companyModel);
  }
}
