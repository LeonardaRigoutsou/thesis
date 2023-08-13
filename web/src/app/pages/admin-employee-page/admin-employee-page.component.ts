import { Component, NgModule, OnInit, SchemaMetadata } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdminEmployeeFormComponent } from 'src/app/components/admin-employee-form/admin-employee-form.component';
import { ConfirmationModalComponent } from 'src/app/components/confirmation-modal/confirmation-modal.component';
import { User, UserService } from 'src/app/services/user.service';

export interface DialogData {
  firstName: string,
  lastName: string,
  hireDate: Date,
  userName: string,
  password: string,
  role: string
}

@Component({
  selector: 'app-admin-employee-page',
  templateUrl: './admin-employee-page.component.html',
  styleUrls: ['./admin-employee-page.component.css']
})
export class AdminEmployeePageComponent implements OnInit {

  users: User[];
  dialogData: DialogData;
  confirmDialogRef: MatDialogRef<ConfirmationModalComponent>;
  employeeDialogRef: MatDialogRef<AdminEmployeeFormComponent>;

  constructor(private userService: UserService,
    public editDialog: MatDialog, public newDialog: MatDialog, public confirmDialog: MatDialog) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().then(users => {
      this.users = users;
    });
  }

  openConfirmationDialog(userId: number): void {
    this.confirmDialogRef = this.confirmDialog.open(ConfirmationModalComponent, {
      width: '400px'
    });
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result.data === 'yes') {
        this.userService.deleteUser(userId);
      }
    });
  }

  openEditEmployeeDialog(user: User): void {
    this.employeeDialogRef = this.editDialog.open(AdminEmployeeFormComponent, {
      width: '400px',
      data: {
        editMode: true,
        user: user
      }
    });
  }

  openNewEmployeeDialog(): void {
    this.employeeDialogRef = this.newDialog.open(AdminEmployeeFormComponent, {
      width: '400px',
      data: {
        editMode: false,
        user: null
      }
    });
  }

}
