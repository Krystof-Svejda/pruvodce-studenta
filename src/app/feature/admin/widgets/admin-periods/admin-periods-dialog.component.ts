import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { SubjectPeriods } from '../../../../core/models/subject-periods';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  templateUrl: './admin-periods-dialog.component.html',
  styles: [
  ]
})
export class AdminPeriodsDialogComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject();
  dialogForm: FormGroup;
  subjectsList: string[] = [];

  constructor(private firestoreService: FirestoreService,
              public dialogRef: MatDialogRef<AdminPeriodsDialogComponent>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: SubjectPeriods,
              private logger: NGXLogger) {
    this.logger.trace('Entering dialog with data:', this.data);

    this.firestoreService.colWithIds$('school-subjects', ref => ref.orderBy('subject'))
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(schoolSubjects => {
        this.subjectsList = [];
        for (const schoolSubject of schoolSubjects) {
          this.subjectsList.push(schoolSubject.subject);
        }
      });

    this.dialogForm = this.formBuilder.group({
      subject: [ { value: data.id ? data.subject : null, disabled: data.id }, Validators.required ],
      dateP1: [ data.id ? this.convertTimestamp(data.dateP1) : null ],
      dateP2: [ data.id ? this.convertTimestamp(data.dateP2) : null ],
      dateP3: [ data.id ? this.convertTimestamp(data.dateP3) : null ],
      dateP4: [ data.id ? this.convertTimestamp(data.dateP4) : null ],
      creditsP1: [ data.id ? data.creditsP1 : null ],
      creditsP2: [ data.id ? data.creditsP2 : null ],
      creditsP3: [ data.id ? data.creditsP3 : null ],
      creditsP4: [ data.id ? data.creditsP4 : null ],
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  convertTimestamp(timestamp: any): Date {
    return timestamp ? timestamp.toDate() : null;
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.data.subject = this.dialogForm.get('subject').value;

    this.data.dateP1 = this.dialogForm.get('dateP1').value;
    this.data.dateP2 = this.dialogForm.get('dateP2').value;
    this.data.dateP3 = this.dialogForm.get('dateP3').value;
    this.data.dateP4 = this.dialogForm.get('dateP4').value;

    this.data.creditsP1 = this.dialogForm.get('creditsP1').value;
    this.data.creditsP2 = this.dialogForm.get('creditsP2').value;
    this.data.creditsP3 = this.dialogForm.get('creditsP3').value;
    this.data.creditsP4 = this.dialogForm.get('creditsP4').value;

    this.dialogRef.close(this.data);
  }

}
