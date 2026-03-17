import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ClaimDetail, ClaimListItem, ClaimsOverview } from '../models/claim.models';
import { API_CONFIG } from './api-config';
import { mockClaimDetails, mockClaims, mockClaimsOverview } from './mock-api.data';

@Injectable({ providedIn: 'root' })
export class ClaimsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIG);

  getClaims(): Observable<ClaimListItem[]> {
    if (this.config.useMockData) {
      return of(mockClaims);
    }

    return this.http.get<ClaimListItem[]>(`${this.config.apiBaseUrl}/claims`);
  }

  getClaimsOverview(): Observable<ClaimsOverview> {
    if (this.config.useMockData) {
      return of(mockClaimsOverview);
    }

    return this.http.get<ClaimsOverview>(`${this.config.apiBaseUrl}/claims/overview`);
  }

  getClaimDetail(claimId: string | null): Observable<ClaimDetail> {
    if (this.config.useMockData) {
      return of((claimId && mockClaimDetails[claimId]) || mockClaimDetails['CLM-78492']);
    }

    const id = claimId ?? 'CLM-78492';
    return this.http.get<ClaimDetail>(`${this.config.apiBaseUrl}/claims/${id}`);
  }
}
