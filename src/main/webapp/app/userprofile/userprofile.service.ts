import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import BookedActivity from 'src.main.java.team.bham.domain.BookedActivity.java';

export class bookedActivityModel {
  constructor(public flag: boolean) {}
}

export class savedActivityModel {
  constructor(public flag: boolean) {}
}

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  gettingallbookedactivity(bookedActivityModel: bookedActivityModel): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/booked-activities'), bookedActivityModel);
  }

  gettingallselfactivity(selfActivityModel: selfActivityModel): Observable<{}> {
    return this.http.post(this.applicationConfigService.getEndpointFor('api/activity-selves'), selfActivityModel);
  }
}
