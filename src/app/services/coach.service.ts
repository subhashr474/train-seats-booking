import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoachService {
  baseURL: string = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCoachInfo(): Observable<any> {
    return this.http.get(this.baseURL + '/coachInfo');
  }

  userSeatBooks(
    trainId: number,
    coachId: number,
    userId: number,
    seats: number[]
  ): Observable<any> {
    const headers = new HttpHeaders();
    var request: any = {};
    request.trainId = trainId;
    request.coachId = coachId;
    request.userId = userId;
    request.seats = seats;
    return this.http.post(this.baseURL + '/seatBooks', request);
  }
}
