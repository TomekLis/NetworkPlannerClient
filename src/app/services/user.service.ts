import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { BehaviorSubject } from 'rxjs';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ConfigService } from '../utils/config.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  baseUrl = '';

  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private loggedIn = false;

  constructor(private http: Http, private configService: ConfigService) {
    super();
    this.loggedIn = !!localStorage.getItem('auth_token');
    // ?? not sure if this the best way to broadcast the status but seems to resolve issue on page refresh where auth status is lost in
    // header component resulting in authed user nav links disappearing despite the fact user is still logged in
    this._authNavStatusSource.next(this.loggedIn);
    this.baseUrl = configService.getApiURI();
  }

  login(userName, password) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return (
      this.http
        .post(
          this.baseUrl + '/auth/login',
          JSON.stringify({ userName, password }),
          { headers }
        )
        // .pipe(map(res => res.json()))
        .pipe(
          map(res => {
            // res.json();
            const responseBody = JSON.parse((res as any)._body);
            localStorage.clear();
            localStorage.setItem(
              'auth_token',
              (responseBody as any).auth_token
            );
            this.loggedIn = true;
            this._authNavStatusSource.next(true);
            return true;
          }),
          catchError(this.handleError)
        )
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.loggedIn = false;
    this._authNavStatusSource.next(false);
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
