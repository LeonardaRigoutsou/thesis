import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: string = '';
  userId: string = '';

  constructor() { }

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
          this.token = body.token;
          this.userId = body.userId;
        });
      }
    } catch (err) {
      console.log(err);
    }

    return errorMessage;
  }
}
