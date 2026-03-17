import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ClaimListItem } from '../../models/claim.models';
import { DashboardData } from '../../models/dashboard.models';
import { dashboardQuickActionGroups } from './prototype-data';

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <div class="header">
        <div class="header-left">
          <div class="logo">C</div>
          <div class="header-title">
            <h1>Claims Admin Center</h1>
            <p>Life | Short-Term | Long-Term | Disability | Accident</p>
          </div>
        </div>
        <div class="header-right">
          <button type="button" (click)="action.emit('exportReport()')">Export report</button>
          <details class="quick-actions">
            <summary>
              <span class="quick-actions-label">Quick Actions</span>
              <span class="quick-actions-caret">+</span>
            </summary>
            <div class="quick-actions-panel">
              <div class="quick-actions-groups">
                @for (group of quickActionGroups; track group.title) {
                  <section class="quick-actions-group">
                    <h4>{{ group.title }}</h4>
                    <div class="quick-actions-grid">
                      @for (item of group.actions; track item.label) {
                        <button type="button" class="quick-action-button" (click)="action.emit(item.action)">
                          <strong>{{ item.label }}</strong>
                          <span>{{ item.description }}</span>
                        </button>
                      }
                    </div>
                  </section>
                }
              </div>
            </div>
          </details>
          <button type="button" (click)="action.emit('showNotifications()')">Notifications</button>
        </div>
      </div>

      @if (data; as dashboardData) {
        <div class="stats-grid">
          @for (stat of dashboardData.stats; track stat.label) {
            <div class="stat-card">
              <p class="stat-label">{{ stat.label }}</p>
              <p class="stat-value" [style.color]="stat.valueColor ?? null">{{ stat.value }}</p>
              <p class="stat-change" [ngClass]="stat.tone">{{ stat.change }}</p>
            </div>
          }
        </div>

        <div class="analytics-section">
          <div class="analytics-card">
            <h3>Claims volume by type</h3>
            @for (metric of dashboardData.volumeMetrics; track metric.label) {
              <div class="progress-item">
                <div class="progress-header">
                  <span style="color: var(--color-text-secondary);">{{ metric.label }}</span>
                  <span style="font-weight: 500;">{{ metric.value }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" [style.width]="metric.width" [style.background]="metric.color ?? null"></div>
                </div>
              </div>
            }
            <div class="analytics-footer">
              @for (item of dashboardData.footerStats; track item.label) {
                <div class="analytics-stat">
                  <p>{{ item.label }}</p>
                  <p>{{ item.value }}</p>
                </div>
              }
            </div>
          </div>

          <div class="analytics-card">
            <h3>Priority queue</h3>
            <div class="priority-queue">
              @for (item of dashboardData.priorityItems; track item.title) {
                <div class="priority-item" [ngClass]="item.tone">
                  <p>{{ item.title }}</p>
                  <p>{{ item.detail }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <div class="filters">
        <input type="text" placeholder="Search by claim ID, name, or policy..." />
        <select>
          <option>All types</option>
          <option>Life insurance</option>
          <option>Short-term disability</option>
          <option>Long-term disability</option>
          <option>Accidental death & dismemberment</option>
          <option>Critical illness</option>
          <option>Hospital indemnity</option>
          <option>Accident insurance</option>
        </select>
        <select>
          <option>All statuses</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Denied</option>
          <option>Under review</option>
          <option>Awaiting docs</option>
        </select>
        <select>
          <option>All time</option>
          <option>Today</option>
          <option>This week</option>
          <option>This month</option>
          <option>Last 30 days</option>
        </select>
        <button type="button" class="primary" (click)="action.emit('createNewClaim()')">+ New claim</button>
      </div>

      <div class="table-section">
        <div class="table-header">
          <h3>Recent claims</h3>
          <div class="table-controls">
            <button type="button" (click)="action.emit('sortClaims()')">Sort</button>
            <button type="button" (click)="action.emit('customizeColumns()')">Columns</button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Claim ID</th>
              <th>Policyholder</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Filed</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            @for (claim of claims; track claim.claimId) {
              <tr (click)="claimSelected.emit(claim.claimId)">
                <td (click)="$event.stopPropagation()"><input type="checkbox" /></td>
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
                <td style="color: var(--color-text-secondary);">{{ claim.type }}</td>
                <td style="font-weight: 500;">{{ claim.amount }}</td>
                <td class="date-filed">
                  <span class="date">{{ claim.filedDate }}</span>
                  <span class="elapsed">{{ claim.elapsed }}</span>
                </td>
                <td>
                  <div
                    class="assignee-avatar"
                    [style.background]="claim.assigneeBackground"
                    [style.color]="claim.assigneeColor"
                    [title]="claim.assigneeName"
                  >
                    {{ claim.assigneeInitials }}
                  </div>
                </td>
                <td><span class="status-badge" [ngClass]="claim.statusClass">{{ claim.status }}</span></td>
                <td><span class="priority-badge" [ngClass]="claim.priorityClass">{{ claim.priority }}</span></td>
                <td (click)="$event.stopPropagation()">
                  <button type="button" [class.primary]="claim.actionLabel === 'Review'" (click)="claimSelected.emit(claim.claimId)">
                    {{ claim.actionLabel }}
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div class="pagination-info">
          <p>Showing 1-3 of 186 claims</p>
          <select>
            <option>8 per page</option>
            <option>15 per page</option>
            <option>25 per page</option>
            <option>50 per page</option>
          </select>
        </div>
        <div class="pagination-controls">
          <button type="button">Previous</button>
          <button type="button" class="active">1</button>
          <button type="button">2</button>
          <button type="button">3</button>
          <button type="button">...</button>
          <button type="button">24</button>
          <button type="button">Next</button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardScreenComponent {
  @Input() data: DashboardData | null = null;
  @Input() claims: ClaimListItem[] = [];
  @Output() readonly action = new EventEmitter<string>();
  @Output() readonly claimSelected = new EventEmitter<string>();

  protected readonly quickActionGroups = dashboardQuickActionGroups;
}
