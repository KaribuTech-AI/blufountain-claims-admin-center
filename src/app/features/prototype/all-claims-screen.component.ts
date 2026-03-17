import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ClaimListItem, ClaimsOverview } from '../../models/claim.models';

@Component({
  selector: 'app-all-claims-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="detail-header">
        <div class="header-title">
          <h1>All Claims</h1>
          <p>Complete claims registry across all insurance products.</p>
        </div>
      </div>

      <div class="detail-content">
        @if (overview; as claimsOverview) {
          <div class="detail-section">
            <h3>Registry Overview</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Total Claims</span>
                <span class="detail-value">{{ claimsOverview.totalClaims }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">This Month</span>
                <span class="detail-value">{{ claimsOverview.thisMonth }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">This Week</span>
                <span class="detail-value">{{ claimsOverview.thisWeek }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Today</span>
                <span class="detail-value">{{ claimsOverview.today }}</span>
              </div>
            </div>
          </div>
        }

        <div class="detail-section">
          <div class="table-header">
            <h3>Priority claims</h3>
            <div class="table-controls">
              <button type="button" (click)="action.emit('sortClaims()')">Sort</button>
              <button type="button" (click)="action.emit('customizeColumns()')">Columns</button>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Claim ID</th>
                <th>Policyholder</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Assigned</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (claim of claims; track claim.claimId) {
                <tr>
                  <td class="claim-id">{{ claim.claimId }}</td>
                  <td>
                    <div class="user-info">
                      <div class="user-avatar" [style.background]="claim.avatarBackground" [style.color]="claim.avatarColor">
                        {{ claim.initials }}
                      </div>
                      <div>
                        <div class="user-details">{{ claim.policyholder }}</div>
                        <div class="user-policy">{{ claim.policyNumber }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ claim.type }}</td>
                  <td>{{ claim.amount }}</td>
                  <td><span class="status-badge" [ngClass]="claim.statusClass">{{ claim.status }}</span></td>
                  <td>{{ claim.assigneeName }}</td>
                  <td>
                    <button type="button" [class.primary]="claim.actionLabel === 'Review'" (click)="claimSelected.emit(claim.claimId)">
                      {{ claim.actionLabel }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AllClaimsScreenComponent {
  @Input() overview: ClaimsOverview | null = null;
  @Input() claims: ClaimListItem[] = [];
  @Output() readonly action = new EventEmitter<string>();
  @Output() readonly claimSelected = new EventEmitter<string>();
}
