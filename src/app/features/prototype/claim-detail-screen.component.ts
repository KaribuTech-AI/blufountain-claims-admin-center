import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ClaimDetail } from '../../models/claim.models';

@Component({
  selector: 'app-claim-detail-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (claim; as claimDetail) {
      <div class="dashboard">
        <div class="detail-header">
          <button type="button" class="back-button" (click)="back.emit()">Back to claims</button>
          <h2 style="font-size: 18px; font-weight: 500; margin-left: auto;">Claim {{ claimDetail.claimId }}</h2>
        </div>

        <div class="detail-content">
          <div class="detail-section">
            <h3>Claim Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Policyholder</span>
                <span class="detail-value">{{ claimDetail.policyholder }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Policy Number</span>
                <span class="detail-value">{{ claimDetail.policyNumber }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Insurance Type</span>
                <span class="detail-value">{{ claimDetail.insuranceType }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Claim Amount</span>
                <span class="detail-value">{{ claimDetail.claimAmount }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date Filed</span>
                <span class="detail-value">{{ claimDetail.dateFiled }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status</span>
                <span class="status-badge" [ngClass]="claimDetail.statusClass">{{ claimDetail.status }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Priority</span>
                <span class="priority-badge" [ngClass]="claimDetail.priorityClass">{{ claimDetail.priority }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Assigned To</span>
                <span class="detail-value">{{ claimDetail.assigneeName }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Claim Details</h3>
            <p style="font-size: 14px; line-height: 1.6; color: var(--color-text-secondary);">
              {{ claimDetail.description }}
            </p>
            <div style="margin-top: 16px;">
              <p style="font-size: 13px; font-weight: 500; margin-bottom: 8px;">Documents Attached:</p>
              <ul style="font-size: 14px; color: var(--color-text-secondary); margin-left: 20px;">
                @for (document of claimDetail.documents; track document) {
                  <li>{{ document }}</li>
                }
              </ul>
            </div>
          </div>

          <div class="detail-section">
            <h3>Activity Timeline</h3>
            <div class="timeline">
              @for (item of claimDetail.timeline; track item.date + item.description) {
                <div class="timeline-item">
                  <div class="timeline-date">{{ item.date }}</div>
                  <div class="timeline-content">
                    @if (item.user) {
                      <span class="timeline-user">{{ item.user }}</span>
                      {{ ' ' + item.description }}
                    } @else {
                      {{ item.description }}
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="detail-section">
            <h3>Actions</h3>
            <div class="action-buttons">
              <button type="button" class="primary" (click)="action.emit('approveClaimFlow()')">Approve Claim</button>
              <button type="button" class="danger" (click)="action.emit('denyClaimFlow()')">Deny Claim</button>
              <button type="button" (click)="action.emit('requestDocsFlow()')">Request Documents</button>
              <button type="button" (click)="action.emit('reassignClaim()')">Assign to Another Adjuster</button>
              <button type="button" (click)="action.emit('addNote()')">Add Note</button>
              <button type="button" (click)="action.emit('scheduleCall()')">Schedule Call</button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class ClaimDetailScreenComponent {
  @Input() claim: ClaimDetail | null = null;
  @Output() readonly action = new EventEmitter<string>();
  @Output() readonly back = new EventEmitter<void>();
}
