import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

interface JwtPayload {
  username: string,
  role: string,
  userId: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  async login(username: string, password: string): Promise<string> {
    let errorMessage: string = "";
    try {
      const response: Response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (response.status === 404 || response.status === 400 || response.status === 500) {
        await response.json().then(body => { errorMessage = body?.message });
      } else if (response.status === 200) {
        await response.json().then(body => {
          const jwt = jwt_decode<JwtPayload>(body.token);
          localStorage.setItem('username', jwt.username);
          localStorage.setItem('userId', body.userId);
          localStorage.setItem('role', jwt.role);

          if (!jwt.role) {
            return;
          }

          localStorage.setItem('token', body.token);

          if (jwt.role === 'admin') {
            this.router.navigate(['/admin']);
          }

          if (jwt.role === 'server') {
            this.router.navigate(['/server/map']);
          }

          if (jwt.role === 'cooker') {
            this.router.navigate(['/cooker/orders']);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }

    return errorMessage;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
