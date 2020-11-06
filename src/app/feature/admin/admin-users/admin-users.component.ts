import {Component, Inject, OnInit} from '@angular/core';
import { AbstractEditTable } from '../helper/abstract-edit-table';
import { User } from '../../../core/models/user';
import { FirestoreService } from '../../../core/services/firestore.service';
import { SchoolService } from '../../../core/services/school.service';
import { MatDialog } from '@angular/material/dialog';
import { NGXLogger } from 'ngx-logger';
import { AdminUsersDialogComponent } from './admin-users-dialog.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent extends AbstractEditTable<User> implements OnInit {

  constructor(@Inject(FirestoreService) firestoreService: FirestoreService,
              @Inject(SchoolService) schoolService: SchoolService,
              @Inject(MatDialog) matDialog: MatDialog,
              @Inject(AdminUsersDialogComponent) adminUsersDialogComponent,
              @Inject(NGXLogger) logger: NGXLogger) {
    super(firestoreService, schoolService, matDialog, adminUsersDialogComponent, logger);
    this.displayedColumns = ['email', 'firstName', 'lastName', 'role', 'className', 'actions'];
  }

  ngOnInit(): void {
    this.init('users', ref => ref.orderBy('lastName'));
  }

  protected initData(data?: User): User {
    return null;
  }

  protected initTable(): void {
  }

  // Override method - there is no adding of user allowed here
  onAdd() {
    return;
  }

  // Override method
  onDelete(id: string) {
    // TODO implementation needed - delete record from Firestore + delete user
    // super.onDelete(id);
    this.logger.trace('Delete user', id);
  }

}
