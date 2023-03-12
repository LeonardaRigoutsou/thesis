import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminReservationFormComponent } from 'src/app/components/admin-reservation-form/admin-reservation-form.component';
import { ConfirmationModalComponent } from 'src/app/components/confirmation-modal/confirmation-modal.component';
import { Reservation, ReservationService } from 'src/app/services/reservation.service';

export interface DialogData {
  reservationId: number,
  firstName: string,
  lastName: string,
  Date: Date,
  tableNum: string
}

@Component({
  selector: 'app-admin-reservations-page',
  templateUrl: './admin-reservations-page.component.html',
  styleUrls: ['./admin-reservations-page.component.css']
})
export class AdminReservationsPageComponent {
  reservations: Reservation[];
  dialogData: DialogData;
  currentDate = new Date();

  constructor(private reservationService: ReservationService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadReservations();
  }

  loadReservations(): void {
    this.reservationService.getReservations().then(reservations => {
      console.log(reservations);
      this.reservations = reservations;
    });
  }

  previousDate(currentDate: Date) {
    return currentDate.getDate() - 1;
  }

  nextDate(currentDate: Date) {
    return currentDate.getDate() + 1;
  }

  openConfirmationDialog(reservationId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      hasBackdrop: true
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data === 'yes') {
        this.reservationService.deleteReservation(reservationId);
      }
    });
  }

  openEditReservationDialog(reservation: Reservation): void {
    const dialogRef = this.dialog.open(AdminReservationFormComponent, {
      width: '400px',
      data: {
        editMode: true,
        reservation: reservation
      }
    });
  }

  openNewReservationDialog(): void {
    const dialogRef = this.dialog.open(AdminReservationFormComponent, {
      width: '400px',
      data: {
        editMode: false,
        reservation: null
      }
    });
  }

}
