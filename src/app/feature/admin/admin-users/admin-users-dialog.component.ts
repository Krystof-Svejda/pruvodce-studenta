import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { User } from '../../../core/models/user';

@Component({
  templateUrl: './admin-users-dialog.component.html',
  styles: [
  ]
})
export class AdminUsersDialogComponent implements OnInit {

  dialogForm: FormGroup;

  constructor(public dialogRef: MatDialogRef<AdminUsersDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: User,
              private logger: NGXLogger) {
    this.logger.trace('Entering dialog with data:', this.data);

    this.dialogForm = this.formBuilder.group({
      firstName: [ this.data.firstName, Validators.required ],
      lastName: [ this.data.lastName, Validators.required ],
      roleStudentOrTeacher: [ this.data.roles ? (this.data.roles.student ? '1' : '2') : '1' ],
      roleAdmin: [ this.data.roles ? this.data.roles.admin : false ]
    });
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.roles = { student: false, admin: false, teacher: false };

    this.data.firstName = this.dialogForm.get('firstName').value;
    this.data.lastName = this.dialogForm.get('lastName').value;
    if (this.dialogForm.get('roleStudentOrTeacher').value === '1') {
      this.data.roles.student = true;
    } else {
      this.data.roles.teacher = true;
    }
    this.data.roles.admin = this.data.roles.admin = this.dialogForm.get('roleAdmin').value;

    this.dialogRef.close(this.data);
  }

}
