import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminReservationFormComponent } from 'src/app/components/admin-reservation-form/admin-reservation-form.component';
import { ConfirmationModalComponent } from 'src/app/components/confirmation-modal/confirmation-modal.component';
import { Reservation } from 'src/app/models/reservation.model';
import { ReservationService } from 'src/app/services/reservation.service';

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
  filteredReservations: Reservation[];
  dialogData: DialogData;
  currentDate: Date;

  constructor(private reservationService: ReservationService,
    public dialog: MatDialog) {
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.reservationService.getReservations();
    this.reservationService.reservations.subscribe({
      next: (reservations) => {
        this.reservations = reservations;
        this.filterReservations();
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => { }
    });
  }

  previousDate() {
    let prevDate: Date = new Date(this.currentDate.getTime());
    prevDate.setDate(this.currentDate.getDate() - 1);
    this.currentDate = prevDate;
    this.filterReservations();
  }

  nextDate() {
    let nextDate: Date = new Date(this.currentDate.getTime());
    nextDate.setDate(this.currentDate.getDate() + 1);
    this.currentDate = nextDate;
    this.filterReservations();
  }

  filterReservations(): void {
    this.filteredReservations = this.reservations.filter((reservation) => {
      return new Date(reservation.reservationDate).toDateString() === this.currentDate.toDateString();
    });
  }

  openConfirmationDialog(reservationId: number): void {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data === 'yes') {
        this.reservationService.deleteReservation(reservationId);
        this.deleteReservation(reservationId);
      }
    });
  }

  deleteReservation(reservationId: number): void {
    const index = this.reservationService.reservations.getValue().findIndex(reservation => {
      reservation.reservationId === reservationId
    });
    const indexFiltered = this.filteredReservations.findIndex(reservation => {
      reservation.reservationId === reservationId
    });
    this.reservations.splice(index, 1);
    this.filteredReservations.splice(indexFiltered, 1);
  }

  openEditReservationDialog(reservation: Reservation): void {
    const dialogRef = this.dialog.open(AdminReservationFormComponent, {
      width: '400px',
      data: {
        editMode: true,
        reservation: reservation
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      const index = this.reservations.findIndex(current => {
        return current.reservationId === reservation.reservationId
      });
      this.reservations.splice(index, 1, result.data);
      this.filterReservations();
    })
  }

  openNewReservationDialog(): void {
    const dialogRef = this.dialog.open(AdminReservationFormComponent, {
      data: {
        editMode: false,
        reservation: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.filterReservations();
    })
  }

}
