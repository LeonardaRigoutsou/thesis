import { Component, NgModule, OnInit, SchemaMetadata } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(private userService: UserService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().then(users => {
      console.log(users);
      this.users = users;
    });
  }

  openConfirmationDialog(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data === 'yes') {
        this.userService.deleteUser(userId);
      }
    });
  }

  openEditEmployeeDialog(user: User): void {
    const dialogRef = this.dialog.open(AdminEmployeeFormComponent, {
      width: '400px',
      data: {
        editMode: true,
        user: user
      }
    });
  }

  openNewEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AdminEmployeeFormComponent, {
      width: '400px',
      data: {
        editMode: false,
        user: null
      }
    });
  }

}
