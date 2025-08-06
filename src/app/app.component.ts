import { Component, OnInit, effect, inject } from '@angular/core';
import { UpdateService } from './shared/services/update.service';
import { NotificationService } from './shared/services/notification.service';
import { ConnectivityService } from './shared/services/connectivity.service';
import { CacheInspectorService } from './shared/services/cache-inspector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private updateService = inject(UpdateService);
  private notificationService = inject(NotificationService);
  private connectivityService = inject(ConnectivityService);
  private cacheInspector = inject(CacheInspectorService);

  constructor() {
    effect(() => {
      if (!this.connectivityService.isOnline) {
        this.notificationService.showNotification('Notificação', {
          body: 'Você está offline. :c',
        });
        return;
      }

      this.notificationService.showNotification('Notificação', {
        body: 'Você está online. :3',
      });
    });
  }

  async ngOnInit() {
    const hasUpdate = await this.updateService.checkForUpdate();

    if (hasUpdate) {
      console.log('Update check initiated.');
    }

    this.cacheInspector.checkAssetsCache();
  }
}
