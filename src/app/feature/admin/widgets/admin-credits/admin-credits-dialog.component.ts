import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';

import { CreditType, SubjectCredit } from '../../../../core/models/subject-credit';

@Component({
  templateUrl: './admin-credits-dialog.component.html',
  styles: [
  ]
})
export class AdminCreditsDialogComponent implements OnInit {

  dialogForm: FormGroup;
  typeOption: string[] = [];

  constructor(public dialogRef: MatDialogRef<AdminCreditsDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: SubjectCredit,
              private logger: NGXLogger) {
    this.logger.trace('Entering dialog with data:', this.data);

    this.dialogForm = this.formBuilder.group({
      creditType: [ data.id ? data.creditType : null, Validators.required ],
      creditCode: [ data.id ? data.creditCode : null, Validators.required ],
      required: [ data.required ],
      description: [ data.id ? data.description : null ]
    });

    Object.keys(CreditType).filter(key => this.typeOption.push(CreditType[key]));
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.creditType = this.dialogForm.get('creditType').value;
    this.data.creditCode = this.dialogForm.get('creditCode').value;
    this.data.required = this.dialogForm.get('required').value;
    this.data.description = this.dialogForm.get('description').value;

    this.dialogRef.close(this.data);
  }

}
