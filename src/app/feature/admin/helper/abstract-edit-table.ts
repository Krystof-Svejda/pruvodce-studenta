import { FirestoreService } from '../../../core/services/firestore.service';
import { SchoolService } from '../../../core/services/school.service';
import { NGXLogger } from 'ngx-logger';
import { Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import {AdminClassesDialogComponent} from '../widgets/admin-classes/admin-classes-dialog.component';
import {AdminSubjectsDialogComponent} from '../widgets/admin-subjects/admin-subjects-dialog.component';
import {AdminCreditsDialogComponent} from '../widgets/admin-credits/admin-credits-dialog.component';
import {AdminPeriodsDialogComponent} from '../widgets/admin-periods/admin-periods-dialog.component';
import {AdminUsersDialogComponent} from '../admin-users/admin-users-dialog.component';
import {AdminCalendarDialogComponent} from '../widgets/admin-calendar/admin-calendar-dialog.component';

interface ItemWithId {
  id?: string;
}

export abstract class AbstractEditTable<T extends ItemWithId> implements OnDestroy {

  ngUnsubscribe = new Subject();
  data: T[] = [];
  dataSource: MatTableDataSource<T>;
  displayedColumns: string[] = [];
  private path: string;

  protected constructor(public firestoreService: FirestoreService,
                        public schoolService: SchoolService,
                        public matDialog: MatDialog,
                        private dialog: ComponentType<unknown>,
                        public logger: NGXLogger) {
  }

  init(path: string, queryFn?) {
    this.logger.trace('init', path);

    this.path = path;

    this.firestoreService.colWithIds$<T>(path, queryFn)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.data = result;
        this.dataSource = new MatTableDataSource<T>(this.data);
        this.logger.trace(this.data);

        this.initTable();
      });
  }

  protected abstract initTable(): void;

  protected abstract initData(data?: T): T;

  get dialogComponent(): any {
    switch (this.dialog.constructor.name) {
      case 'AdminClassesDialogComponent': return AdminClassesDialogComponent;
      case 'AdminSubjectsDialogComponent': return AdminSubjectsDialogComponent;
      case 'AdminCreditsDialogComponent': return AdminCreditsDialogComponent;
      case 'AdminPeriodsDialogComponent': return AdminPeriodsDialogComponent;
      case 'AdminUsersDialogComponent': return AdminUsersDialogComponent;
      case 'AdminCalendarDialogComponent': return AdminCalendarDialogComponent;

    }
  }
  onAdd() {
    this.logger.trace('onAdd');
    const record: T = this.initData();

    const dialogRef = this.matDialog.open(this.dialogComponent, { panelClass: 'admin-dialog', data: record });
    dialogRef.afterClosed()
      .subscribe(result => {
        this.logger.trace('DIALOG WAS CLOSED', result);

        if (result !== undefined) {
          this.addItem(result);
        }
      });
  }


  onEdit(id: string) {
    this.logger.trace('onEdit', id);
    const record = { ...this.dataSource.data.find(item => item.id === id ) };

    const dialogRef = this.matDialog.open(this.dialogComponent, { panelClass: 'admin-dialog', data: record });
    dialogRef.afterClosed()
      .subscribe(result => {
        this.logger.trace('DIALOG WAS CLOSED', result);

        if (result !== undefined) {
          this.editItem(id, result);
        }
      });
  }

  onDelete(id: string) {
    this.logger.trace('onDelete', id);
    this.deleteItem(id);
  }

  private addItem(item: T) {
    this.firestoreService.add<T>(this.path, item)
      .then(() => { this.logger.trace('added successfully'); })
      .catch(error => { this.logger.error('problem during addItem', error); });
  }

  private editItem(id: string, item: T) {
    this.firestoreService.updateWithoutId<T>(this.path + '/' + id, item)
      .then(() => { this.logger.trace('edited successfully'); })
      .catch(error => { this.logger.error('problem during editItem', error); });
  }

  private deleteItem(id: string) {
    this.firestoreService.delete<T>(this.path + '/' + id)
      .then(() => { this.logger.trace('deleted successfully'); })
      .catch(error => { this.logger.error('problem during deleteItem', error); });
  }


  ngOnDestroy(): void {
    this.logger.trace('ngOnDestroy');

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
