import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Reservation } from './reservation.service';

export interface User {
  userId: number,
  username: string,
  firstName: string,
  lastName: string,
  hireDate: Date,
  password: string,
  role: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  createReservation(newReservation: Reservation) {
    throw new Error('Method not implemented.');
  }
  users: User[] = [];
  token: string = '';

  constructor(private authService: AuthService) { }

  async getUsers(): Promise<User[]> {

    try {
      const response: Response = await fetch('http://localhost:8080/api/users', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
        }
      });

      if (response.status === 200) {
        await response.json().then(body => { this.users = body.users; });
      }
    } catch (err) {
      console.log(err);
    }

    return this.users;
  }

  async createUser(newUser: User): Promise<string> {
    let errorMessage: string = "";
    try {
      const response: Response = await fetch('http://localhost:8080/api/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
        },
        body: JSON.stringify(newUser)
      });

      if (response.status === 200) {
        await response.json().then(body => this.users.push(body.user));
      } else if (response.status === 500 || response.status === 409) {
        await response.json().then(body => errorMessage = body.message);
      }
    } catch (err) {
      console.log(err);
    }

    return errorMessage;
  }

  async updateUser(editedUser: User, userId: number): Promise<string> {
    let errorMessage: string = "";
    try {
      const response: Response = await fetch('http://localhost:8080/api/user/' + userId, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
        },
        body: JSON.stringify(editedUser)
      });

      if (response.status === 200) {
        const index = this.users.findIndex(user => {
          return user.userId === editedUser.userId
        });
        console.log(index);
        this.users.splice(index, 1, editedUser);
      } else if (response.status === 500 || response.status === 400) {
        await response.json().then(body => errorMessage = body.message);
      }

    } catch (err) {
      console.log(err);
    }
    return errorMessage;
  }

  async deleteUser(userId: number): Promise<string> {
    let errorMessage: string = "";
    try {
      const response: Response = await fetch('http://localhost:8080/api/user/' + userId, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcklkIjoiMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3NTQ1NjIyM30.dfAcUoiDSF9_rsDto2lma1tVH0y7MBKO1Xk2jJGUI4s"
        }
      });

      if (response.status === 200) {
        const index = this.users.findIndex(user => {
          user.userId === userId
        })
        this.users.splice(index, 1);
      } else if (response.status === 500 || response.status === 400 || response.status === 404) {
        await response.json().then(body => errorMessage = body.message);
      }

    } catch (err) {
      console.log(err);
    }
    return errorMessage;

  }

}
