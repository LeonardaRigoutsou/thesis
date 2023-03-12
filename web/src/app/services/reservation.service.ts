import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

export interface Reservation {
    tableNum: number,
    reservationName: string,
    reservationDate: Date
    reservationId: number
}

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    reservations: Reservation[] = [];
    token: string = '';

    constructor(private authService: AuthService) { }

    async getReservations(): Promise<Reservation[]> {

        try {
            const response: Response = await fetch('http://localhost:8080/api/reservations', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                }
            });

            if (response.status === 200) {
                await response.json().then(body => { this.reservations = body.reservations; });
            }
        } catch (err) {
            console.log(err);
        }

        return this.reservations;
    }

    async createReservation(newReservation: Reservation): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/reservation', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                },
                body: JSON.stringify(newReservation)
            });

            if (response.status === 200) {
                await response.json().then(body => this.reservations.push(body.reservation));
            } else if (response.status === 500 || response.status === 409) {
                await response.json().then(body => errorMessage = body.message);
            }
        } catch (err) {
            console.log(err);
        }

        return errorMessage;
    }

    async updateReservation(editedReservation: Reservation, reservationId: number): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/reservation/' + reservationId, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                },
                body: JSON.stringify(editedReservation)
            });

            if (response.status === 200) {
                const index = this.reservations.findIndex(reservation => {
                    return reservation.reservationId === editedReservation.reservationId
                });
                console.log(index);
                this.reservations.splice(index, 1, editedReservation);
            } else if (response.status === 500 || response.status === 400) {
                await response.json().then(body => errorMessage = body.message);
            }

        } catch (err) {
            console.log(err);
        }
        return errorMessage;
    }

    async deleteReservation(reservationId: number): Promise<string> {
        let errorMessage: string = "";
        try {
            const response: Response = await fetch('http://localhost:8080/api/reservation/' + reservationId, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
                }
            });

            if (response.status === 200) {
                const index = this.reservations.findIndex(reservation => {
                    reservation.reservationId === reservationId
                })
                this.reservations.splice(index, 1);
            } else if (response.status === 500 || response.status === 400 || response.status === 404) {
                await response.json().then(body => errorMessage = body.message);
            }

        } catch (err) {
            console.log(err);
        }
        return errorMessage;

    }

}
