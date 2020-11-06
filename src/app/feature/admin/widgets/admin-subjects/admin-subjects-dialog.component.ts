import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NGXLogger } from 'ngx-logger';

import { SchoolSubject } from '../../../../core/models/school-subject';

@Component({
  templateUrl: './admin-subjects-dialog.component.html',
  styles: [
  ]
})
export class AdminSubjectsDialogComponent implements OnInit {

  dialogForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AdminSubjectsDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: SchoolSubject,
              private logger: NGXLogger) {
    this.logger.trace('Entering dialog with data:', this.data);

    this.dialogForm = this.formBuilder.group({
      subject: [ data.id ? data.subject : '', Validators.required ],
      optional: [ data.optional ]
    });
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.subject = this.dialogForm.get('subject').value;
    this.data.optional = this.dialogForm.get('optional').value;

    this.dialogRef.close(this.data);
  }

}
