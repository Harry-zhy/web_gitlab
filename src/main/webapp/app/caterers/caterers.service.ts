import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';

export class companyModel {
  constructor(public flag: boolean) {}
}

@Injectable({ providedIn: 'root' })
export class CaterersService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  DisplayCaterers(): Observable<any> {
    return this.http.get<any>('api/caterers');
  }
}
