import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Event} from '../../../../core/models/event';
import {NGXLogger} from 'ngx-logger';
import {Subject} from 'rxjs';

@Component({
  templateUrl: './admin-calendar-dialog.component.html',
  styles: [
  ]
})
export class AdminCalendarDialogComponent implements OnInit {

  dialogForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AdminCalendarDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: Event,
              private logger: NGXLogger) {
    this.dialogForm = this.formBuilder.group({
      event: [data.id ? data.event : '', Validators.required],
      date: [ data.id ? this.convertTimestamp(data.date) : null ],

    });
  }

  ngOnInit(): void {
  }
  onCancel() {
    this.dialogRef.close();
  }
  onSubmit() {
    this.data.event = this.dialogForm.get('event').value;
    this.data.date = this.dialogForm.get('date').value;

    this.dialogRef.close(this.data);
  }

  convertTimestamp(timestamp: any): Date {
    return timestamp ? timestamp.toDate() : null;
  }
}
