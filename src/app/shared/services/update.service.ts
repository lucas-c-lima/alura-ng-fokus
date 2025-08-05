import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { filter, interval, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  constructor(private swUpdate: SwUpdate) {
    this.initalizeUpdateChecks();
  }

  initalizeUpdateChecks(): void {
    if (!this.swUpdate.isEnabled) return;

    interval(60 * 5000).subscribe(() => this.checkForUpdate());

    this.swUpdate.versionUpdates
      .pipe(
        tap((event) => console.log(event)),
        filter((event) => event.type === 'VERSION_READY')
      )
      .subscribe(() => this.promptUserToUpdate());
  }

  async checkForUpdate(): Promise<boolean> {
    if (!this.swUpdate.isEnabled) return false;

    try {
      return await this.swUpdate.checkForUpdate();
    } catch (error) {
      console.error('Error checking for updates:', error);
      return false;
    }
  }

  private promptUserToUpdate(): void {
    if (
      confirm(
        'A new version of the app is available. Would you like to update?'
      )
    ) {
      this.swUpdate
        .activateUpdate()
        .then(() => window.location.reload())
        .catch((error) => console.error('Error activating update:', error));
    }
  }
}
