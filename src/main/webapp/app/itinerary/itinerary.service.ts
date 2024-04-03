import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Injectable({ providedIn: 'root' })
export class ItineraryService {
  private readonly guestsAPIurl = 'http://localhost:9002/api/itinerary-guests';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  createItineraryGuest(numberOfGuests: number): Observable<any> {
    return this.http.post<any>(this.guestsAPIurl, { numberOfGuests });
  }
}
