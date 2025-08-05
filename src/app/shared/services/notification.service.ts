import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { NotificationMessage } from './notification-message';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly VAPID_PUBLIC_KEY =
    'BDWfh55mpg_HTkszO_qh3aa_PcmbX_qvHrWvL9_FEtpvoXWrMmMz8PMZFU0WwUd-TV_xlkbGACS1BziV71M8pkU';
  private baseUrl = 'http://localhost:3000';

  constructor(
    private swPush: SwPush,
    private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.subscribeToNotifications();
  }

  requestPermission(): Promise<NotificationPermission> {
    if (this.notificationSupported) {
      return Promise.reject('Notifications not supported.');
    }

    return window.Notification.requestPermission();
  }

  showNotification(title: string, options?: NotificationOptions): void {
    if (!this.notificationSupported) {
      console.warn('Notifications not supported.');
      return;
    }

    if (window.Notification.permission === 'granted') {
      new window.Notification(title, options);
    } else {
      console.warn('Notification not supported.');
    }
  }

  private get notificationSupported(): boolean {
    return isPlatformBrowser(this.platformId) && 'Notification' in window;
  }

  private subscribeToNotifications() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((subscription) => {
        this.sendSubscriptionToServer(subscription).subscribe();
      });
  }

  private sendSubscriptionToServer(
    subscription: PushSubscription
  ): Observable<NotificationMessage> {
    return this.httpClient.post<NotificationMessage>(
      `${this.baseUrl}/subscribe`,
      subscription
    );
  }
}
