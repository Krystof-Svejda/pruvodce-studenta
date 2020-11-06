import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NGXLogger } from 'ngx-logger';

import { SchoolClass } from '../../../../core/models/school-class';

@Component({
  templateUrl: './admin-classes-dialog.component.html',
  styles: [
  ]
})
export class AdminClassesDialogComponent implements OnInit {

  dialogForm: FormGroup;
  thisYear = new Date().getFullYear();

  constructor(public dialogRef: MatDialogRef<AdminClassesDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: SchoolClass,
              private logger: NGXLogger) {
    this.logger.trace('Entering dialog with data:', this.data);

    this.dialogForm = this.formBuilder.group({
      className: [ data.id ? data.className : '', Validators.required ],
      freshmanYear: [ data.freshmanYear, [
        Validators.required,
        Validators.min(this.thisYear - 8),
        Validators.max(this.thisYear + 1) ] ]
    });
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.className = this.dialogForm.get('className').value;
    this.data.freshmanYear = this.dialogForm.get('freshmanYear').value;

    this.dialogRef.close(this.data);
  }

}
