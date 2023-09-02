import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    reservations: BehaviorSubject<Reservation[]> = new BehaviorSubject<Reservation[]>([]);
    token: string = '';

    constructor(private http: HttpClient) { }

    getReservations() {
        this.http.get<{ reservations: Reservation[] }>('http://localhost:8080/api/reservations', {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (value) => {
                this.reservations.next(value.reservations);
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => { }
        });
    }

    createReservation(newReservation: Reservation): string {
        let errorMessage: string = "";

        this.http.post<{ newReservation: Reservation }>('http://localhost:8080/api/reservation', newReservation, {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (value) => {
                let newReservations = this.reservations.getValue();
                newReservations.push(value.newReservation);
                this.reservations.next(newReservations);
            },
            error: (error) => {
                errorMessage = error.message
            },
            complete: () => { }
        });

        return errorMessage;
    }

    updateReservation(editedReservation: Reservation, reservationId: number): string {
        let errorMessage: string = "";

        this.http.put<{ reservation: Reservation }>('http://localhost:8080/api/reservation/' + reservationId, editedReservation, {
            "headers": {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (value) => {
                let newReservations = this.reservations.getValue();
                const index = newReservations.findIndex(reservation => {
                    return reservation.reservationId === editedReservation.reservationId
                });
                newReservations.splice(index, 1, editedReservation);
                this.reservations.next(newReservations);
            },
            error: (error) => {
                errorMessage = error.message;

            },
            complete: () => { console.log(this.reservations) }
        });

        return errorMessage;
    }

    deleteReservation(reservationId: number): string {
        let errorMessage: string = "";

        this.http.delete<{ reservation: Reservation }>('http://localhost:8080/api/reservation/' + reservationId, {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).subscribe({
            next: (value) => {
                const index = this.reservations.getValue().findIndex(reservation => {
                    reservation.reservationId === reservationId
                })
                this.reservations.getValue().splice(index, 1);
            },
            error: (error) => {
                errorMessage = error.message;
            },
            complete: () => { }
        });

        return errorMessage;

    }

}
