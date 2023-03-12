import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Reservation, ReservationService } from 'src/app/services/reservation.service';
import { AdminEmployeeFormComponent } from '../admin-employee-form/admin-employee-form.component';

@Component({
  selector: 'admin-reservation-form',
  templateUrl: './admin-reservation-form.component.html',
  styleUrls: ['./admin-reservation-form.component.css']
})
export class AdminReservationFormComponent {
  newReservationForm: FormGroup;
  errorMessage: string = "";

  constructor(private authService: AuthService, private reservationService: ReservationService,
    public dialogRef: MatDialogRef<AdminEmployeeFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.newReservationForm = new FormGroup({
      'reservationName': new FormControl("", Validators.required),
      'reservationDate': new FormControl("", Validators.required),
      'tableNum': new FormControl("", Validators.required)
    });

    if (this.data.reservation) {
      const reservation = this.data.reservation;
      this.newReservationForm.get('reservationName')?.setValue(reservation.reservationName);
      this.newReservationForm.get('reservationDate')?.setValue(reservation.reservationDate);
      this.newReservationForm.get('tableNum')?.setValue(reservation.tableNum);
    }
  }

  onCreate(): void {
    let newReservation = this.formToReservation();
    this.reservationService.createReservation(newReservation).then(message => {
      this.errorMessage = message;
    });
    this.dialogRef.close();
  }

  onUpdate(): void {
    let newReservation = this.formToReservation();
    this.reservationService.updateReservation(newReservation, this.data.reservation.reservationId).then(message => {
      this.errorMessage = message;
    });
    this.dialogRef.close();
  }

  private formToReservation(): Reservation {
    let newReservation: Reservation = {} as Reservation;
    newReservation.reservationDate = this.newReservationForm.get('reservationDate')?.value;
    newReservation.reservationName = this.newReservationForm.get('reservationName')?.value;
    newReservation.tableNum = this.newReservationForm.get('tableNum')?.value;

    return newReservation;
  }
}
