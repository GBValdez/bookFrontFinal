import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import {
  loginInterface,
  responseLoginInterface,
} from '@interfaces/login.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private urlBase: string = environment.api;
  constructor(private http: HttpClient) {}
  login(credentials: loginInterface): Observable<responseLoginInterface> {
    return this.http.post<responseLoginInterface>(
      `${this.urlBase}/user/login`,
      credentials
    );
  }
}
