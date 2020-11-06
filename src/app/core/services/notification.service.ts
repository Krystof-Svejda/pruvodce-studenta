import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  notify(message: string, action = '', durationInSeconds = 5) {
    this.snackBar.open(message, action, {
      duration: durationInSeconds * 1000
    });
}
  notifyError(message: string, action = '', durationInSeconds = 5) {
    this.snackBar.open(message, '', {
      duration: durationInSeconds * 1000,
      panelClass: ['mat-toolbar', 'mat-warn'] });
  }
}
