import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  api: string = "http://127.0.0.1:8000/api/login/";

  constructor(private http:HttpClient) { }
  login(usuarios: any)
  {
    return this.http.post(this.api, usuarios);
  }

  getRole(): string | null {
    return localStorage.getItem('user_role'); // O la lógica que uses
  }

  isLoggedIn(): boolean {
    return !!this.getRole();
  }
  
}
