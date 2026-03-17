import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DashboardData } from '../models/dashboard.models';
import { API_CONFIG } from './api-config';
import { mockDashboardData } from './mock-api.data';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);

  getDashboardData(): Observable<DashboardData> {
    if (this.config.useMockData) {
      return of(mockDashboardData);
    }

    return this.http.get<DashboardData>(`${this.config.apiBaseUrl}/dashboard`);
  }
}
