import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ClaimDetail, ClaimListItem, ClaimsOverview } from '../../models/claim.models';
import { DashboardData } from '../../models/dashboard.models';
import { ClaimsService } from '../../services/claims.service';
import { DashboardService } from '../../services/dashboard.service';
import { mockClaimDetails, mockClaims, mockClaimsOverview, mockDashboardData } from '../../services/mock-api.data';
import { AllClaimsScreenComponent } from './all-claims-screen.component';
import { ClaimDetailScreenComponent } from './claim-detail-screen.component';
import { DashboardScreenComponent } from './dashboard-screen.component';
import { PrototypeIconComponent } from './prototype-icon.component';
import { sidebarSections } from './prototype-data';
import { isAngularScreen, resolvePrototypeAction } from './prototype-registry';

@Component({
  selector: 'app-prototype-shell',
  standalone: true,
  imports: [CommonModule, DashboardScreenComponent, AllClaimsScreenComponent, ClaimDetailScreenComponent, PrototypeIconComponent],
  templateUrl: './prototype-shell.component.html',
})
export class PrototypeShellComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dashboardService = inject(DashboardService);
  private readonly claimsService = inject(ClaimsService);

  protected readonly sidebarSections = sidebarSections;
  protected readonly legacyScreenHtml = signal<SafeHtml>('');
  protected readonly modalHtml = signal<SafeHtml>('');
  protected readonly activeScreenId = signal('dashboard-screen');
  protected readonly claimId = signal<string | null>(null);
  protected readonly usesAngularScreen = signal(true);
  protected readonly screenLoading = signal(false);
  protected readonly screenError = signal<string | null>(null);
  protected readonly dashboardData = signal<DashboardData | null>(mockDashboardData);
  protected readonly claimsOverview = signal<ClaimsOverview | null>(mockClaimsOverview);
  protected readonly claims = signal<ClaimListItem[]>(mockClaims);
  protected readonly claimDetail = signal<ClaimDetail | null>(mockClaimDetails['CLM-78492']);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const screenId = params.get('screenId') ?? 'dashboard-screen';
      const claimId = this.route.snapshot.queryParamMap.get('claimId');

      this.activeScreenId.set(screenId);
      this.claimId.set(claimId);
      this.usesAngularScreen.set(isAngularScreen(screenId));
      this.modalHtml.set('');
      this.screenError.set(null);

      if (isAngularScreen(screenId)) {
        this.legacyScreenHtml.set('');
        this.loadAngularScreenData(screenId, claimId);
      } else {
        this.loadLegacyScreen(screenId, claimId);
      }
    });
  }

  protected handleMarkupClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const actionElement = target?.closest<HTMLElement>('[onclick],[data-prototype-action]');

    if (!actionElement) {
      return;
    }

    event.preventDefault();
    const action =
      actionElement.getAttribute('data-prototype-action') ??
      actionElement.getAttribute('onclick') ??
      '';

    this.processAction(action);
  }

  protected processAction(action: string): void {
    const modalMatch = action.match(/closeModal\('([^']+)'\)/);
    if (modalMatch) {
      this.closeModal();
      return;
    }

    const claimMatch = action.match(/showClaimDetail\('([^']+)'\)/);
    if (claimMatch) {
      this.openClaimDetail(claimMatch[1]);
      return;
    }

    const resolved = resolvePrototypeAction(action);

    if (resolved.type === 'modal' && resolved.target) {
      this.loadModal(resolved.target);
      return;
    }

    if (resolved.type === 'screen' && resolved.target) {
      this.navigateToScreen(resolved.target);
      return;
    }

    if (resolved.type === 'feedback') {
      this.showFeedbackModal(this.humanizeAction(resolved.target ?? action));
    }
  }

  protected onSidebarItemClick(action: string | undefined, screenId: string | undefined): void {
    if (screenId) {
      this.navigateToScreen(screenId);
      return;
    }

    if (action) {
      this.processAction(action);
    }
  }

  protected isSidebarScreenActive(screenId: string | undefined): boolean {
    return !!screenId && screenId === this.activeScreenId();
  }

  protected openClaimDetail(claimId: string): void {
    this.router.navigate(['/screen/claim-detail-screen'], { queryParams: { claimId } });
  }

  protected goBackToClaims(): void {
    this.navigateToScreen('all-claims-screen');
  }

  protected closeModal(): void {
    this.modalHtml.set('');
  }

  private loadAngularScreenData(screenId: string, claimId: string | null): void {
    this.screenLoading.set(true);
    this.screenError.set(null);

    if (screenId === 'dashboard-screen') {
      forkJoin({
        dashboard: this.dashboardService.getDashboardData(),
        claims: this.claimsService.getClaims(),
      }).subscribe({
        next: ({ dashboard, claims }) => {
          this.dashboardData.set(dashboard);
          this.claims.set(claims);
          this.screenLoading.set(false);
        },
        error: () => {
          this.dashboardData.set(mockDashboardData);
          this.claims.set(mockClaims);
          this.screenError.set('Unable to load dashboard data right now.');
          this.screenLoading.set(false);
        },
      });
      return;
    }

    if (screenId === 'all-claims-screen') {
      forkJoin({
        overview: this.claimsService.getClaimsOverview(),
        claims: this.claimsService.getClaims(),
      }).subscribe({
        next: ({ overview, claims }) => {
          this.claimsOverview.set(overview);
          this.claims.set(claims);
          this.screenLoading.set(false);
        },
        error: () => {
          this.claimsOverview.set(mockClaimsOverview);
          this.claims.set(mockClaims);
          this.screenError.set('Unable to load claims right now.');
          this.screenLoading.set(false);
        },
      });
      return;
    }

    if (screenId === 'claim-detail-screen') {
      this.claimsService.getClaimDetail(claimId).subscribe({
        next: (detail) => {
          this.claimDetail.set(detail);
          this.screenLoading.set(false);
        },
        error: () => {
          this.claimDetail.set(mockClaimDetails['CLM-78492']);
          this.screenError.set('Unable to load claim details right now.');
          this.screenLoading.set(false);
        },
      });
      return;
    }

    this.screenLoading.set(false);
  }

  private loadLegacyScreen(screenId: string, claimId: string | null): void {
    this.http
      .get(`/prototype/screens/${screenId}.html`, { responseType: 'text' })
      .subscribe({
        next: (html) => {
          let nextHtml = html.replace('class="screen"', 'class="screen active-screen"');

          if (screenId === 'claim-detail-screen' && claimId) {
            nextHtml = nextHtml.replace(/(<span id="detail-claim-id">)(.*?)(<\/span>)/, `$1${claimId}$3`);
          }

          this.legacyScreenHtml.set(this.toSafeHtml(nextHtml));
        },
        error: () => {
          const fallback = this.buildPlaceholderScreen(
            screenId,
            'This original screen was referenced, but its extracted markup was not found.',
          );
          this.legacyScreenHtml.set(this.toSafeHtml(fallback));
        },
      });
  }

  private loadModal(modalId: string): void {
    this.http
      .get(`/prototype/modals/${modalId}.html`, { responseType: 'text' })
      .subscribe((html) => {
        this.modalHtml.set(this.toSafeHtml(html.replace('class="modal"', 'class="modal modal-active"')));
      });
  }

  private navigateToScreen(screenId: string): void {
    this.router.navigate(['/screen', screenId]);
  }

  private buildPlaceholderScreen(screenId: string, message: string): string {
    const title = screenId
      .replace(/-screen$/, '')
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

    return `
      <section class="prototype-placeholder">
        <div class="detail-header">
          <div class="logo">C</div>
          <div class="header-title">
            <h1>${title}</h1>
            <p>Original prototype placeholder</p>
          </div>
        </div>
        <div class="detail-content">
          <div class="detail-section">
            <h3>Screen Ready</h3>
            <p class="detail-copy">${message}</p>
          </div>
        </div>
      </section>
    `;
  }

  private showFeedbackModal(actionName: string): void {
    const modal = `
      <div class="modal modal-active">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Prototype Action</h2>
            <button class="close-btn" data-prototype-action="closeModal('feedback-modal')">x</button>
          </div>
          <div class="modal-body">
            <p>${actionName} was triggered. This flow is acknowledged in the Angular prototype shell.</p>
          </div>
          <div class="modal-footer">
            <button class="primary" data-prototype-action="closeModal('feedback-modal')">Close</button>
          </div>
        </div>
      </div>
    `;

    this.modalHtml.set(this.toSafeHtml(modal));
  }

  private humanizeAction(actionName: string): string {
    return actionName
      .replace(/^submit/, '')
      .replace(/^apply/, '')
      .replace(/^show/, '')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .trim();
  }

  private toSafeHtml(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
