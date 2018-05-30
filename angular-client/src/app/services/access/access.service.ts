import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { CurrentUser } from '../../models/access/access.model';

@Injectable()
export class AccessService {

    private token: string;
    private headers = new HttpHeaders({
        'Content-Type': 'application/json;charset=utf-8',
        'Accept': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
    });

    /**
     * AccessService Constructor
     * @param {HttpClient} http 
     */
    constructor(private http: HttpClient, private router: Router) { }

    /**
     * Function to save token in local storage
     * @param {string} token 
     */
    private saveToken(token: string): void {
        localStorage.setItem('ormigga-token', token);
        this.token = token;
    }

    /**
     * Function to get token from local storage
     */
    private getToken(): string {
        if (!this.token) {
            this.token = localStorage.getItem('ormigga-token');
        }
        return this.token;
    }

    /**
     * Function to get user from local storage
     */
    public getCurrentUser(): CurrentUser {
        const _token = this.getToken();
        let _payload;
        if (_token) {
            _payload = window.atob(_token);
            return JSON.parse(_payload);
        } else {
            return null;
        }
    }

    /**
     * Function to set current user and set in local storage
     * @param {any} _userRsp 
     */
    public setCurrentUser(_userRsp: any) {
        let _currentUser: CurrentUser = this.getCurrentUser();
        let actD = new Date().toISOString();
        let options = {
            hour: "2-digit", minute: "2-digit"
        };
        let iam = _userRsp.data.usr.level;

        if (_currentUser !== null) {
            if (_currentUser.iam) {
                iam = _currentUser.iam;
            }
        }

        let ormiggaPro = false
        if (_userRsp.data.usr.typePlan == "T3JtaWdnYVBybw==") {
            ormiggaPro = true
        }

        if (!_userRsp.data.usr.user_uuid) {
            _userRsp.data.usr.user_uuid = false
        }

        let currentUser: CurrentUser = {
            name: name,
            uuid: _userRsp.data.usr.token,
            platform: _userRsp.data.platform,
            username: _userRsp.data.usr.username,
            phone: _userRsp.data.usr.phone,
            level: _userRsp.data.usr.level,
            ddd: actD,
            cid: _userRsp.data.usr.nit,
            iam: iam,
            plan: _userRsp.data.usr.typePlan,
            accessToken: _userRsp.data.accessToken,
            apikey: _userRsp.data.usr["Api-key"],
            privatekey: _userRsp.data.usr["Private-key"],
            token_user: _userRsp.data.usr.id,
            permisos: _userRsp.data.usr.permissions,
            rol: _userRsp.data.usr.rol,
            contact: _userRsp.data.usr.contact,
            ormiggaPro: ormiggaPro,
            user_uuid: _userRsp.data.usr.user_uuid
        };
        let _dataCode = btoa(JSON.stringify(currentUser));
        this.saveToken(_dataCode);
    }

    /**
     * Function to create request to specific api
     * @param {string} method 
     * @param {string} type 
     * @param {string} user 
     */
    private request(method: 'post' | 'get', type: 'login' | 'register', user?: Object): Observable<any> {
        let base;
        if (method === 'post') {
            base = this.http.post(`/api/${type}`, user);
        } else {
            base = this.http.get(`/api/${type}`, { headers: this.headers });
        }

        const request = base.pipe(
            retry(3),
            catchError(this.handleError)
        );
        return request;
    }

    /**
     * Function to register new user
     * @param {Object} user 
     */
    public register(user: Object): Observable<any> {
        return this.request('post', 'register', user);
    }

    /**
     * Function to user login
     * @param {Object} user 
     */
    public login(user: Object): Observable<any> {
        return this.request('post', 'login', user);
    }

    /**
     * Function to user logout
     */
    public logout(): void {
        this.token = '';
        window.localStorage.removeItem('ormigga-token');
        this.router.navigateByUrl('/');
    }

    /**
     * Handle Http operation that failed
     * @param {HttpErrorResponse} error 
     */
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
    };
}