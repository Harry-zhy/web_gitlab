import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DecorationsService {
  constructor(private http: HttpClient) {}

  // Example method to fetch companies from an API
  getCompanies(): Observable<any[]> {
    return this.http.get<any[]>('api/deco-companies');
  }
}
