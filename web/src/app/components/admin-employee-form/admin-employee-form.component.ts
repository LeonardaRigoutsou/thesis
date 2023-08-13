import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'admin-employee-form',
  templateUrl: './admin-employee-form.component.html',
  styleUrls: ['./admin-employee-form.component.css']
})
export class AdminEmployeeFormComponent {
  newEmployeeForm: FormGroup;
  errorMessage: string = "";

  constructor(private authService: AuthService, private userService: UserService,
    public dialogRef: MatDialogRef<AdminEmployeeFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newEmployeeForm = new FormGroup({
      'firstName': new FormControl("", Validators.required),
      'lastName': new FormControl("", Validators.required),
      'hireDate': new FormControl("", Validators.required),
      'username': new FormControl("", Validators.required),
      'password': new FormControl("", Validators.required),
      'role': new FormControl("", Validators.required)
    });

    if (this.data.user) {
      const user = this.data.user;
      this.newEmployeeForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        hireDate: user.hireDate,
        username: user.username,
        role: user.role
      });
    }
  }

  onCreate(): void {
    let newUser = this.formToUser();
    this.userService.createUser(newUser).then(message => {
      this.errorMessage = message;
    });
    this.dialogRef.close();
  }

  onUpdate(): void {
    let newUser = this.formToUser();
    this.userService.updateUser(newUser, this.data.user.userId).then(message => {
      this.errorMessage = message;
    });
    this.dialogRef.close();
  }

  private formToUser(): User {
    let newUser: User = {} as User;
    newUser.firstName = this.newEmployeeForm.get('firstName')?.value;
    newUser.lastName = this.newEmployeeForm.get('lastName')?.value;
    newUser.hireDate = this.newEmployeeForm.get('hireDate')?.value;
    newUser.username = this.newEmployeeForm.get('username')?.value;
    newUser.password = this.newEmployeeForm.get('password')?.value;
    newUser.role = this.newEmployeeForm.get('role')?.value;

    return newUser;
  }

}
