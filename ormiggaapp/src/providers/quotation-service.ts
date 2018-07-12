import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { Quotation } from '../models/quotation/quotation.model';
import { AccessServiceProvider } from './access-service';

@Injectable()
export class QuotationServiceProvider {

    private _apiURL: string = 'http://services-test.ormigga.com';
    private _headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': btoa(this._accessService.getCurrentUser().accessToken),
        'Apikey': btoa(this._accessService.getCurrentUser().apikey),
        'Privatekey': btoa(this._accessService.getCurrentUser().privatekey),
        'token': btoa(this._accessService.getCurrentUser().uuid),
        'typeAccess': 'mobile'
    });

    /**
     * QuotationServiceProvider Constructor
     * @param {HttpClient} http 
     * @param {AccessServiceProvider} _accessService 
     */
    constructor(private http: HttpClient,
        private _accessService: AccessServiceProvider) { }

    /**
     * Function to set quotation 
     * @param {Quotation} _pQuotation 
     */
    public setQuotation(_pQuotation: Quotation): void {
        localStorage.setItem('customer-quotation', JSON.stringify(_pQuotation))
    }

    /**
     * Function to get quotation
     */
    public getQuotation(): Quotation {
        let _quotation = localStorage.getItem('customer-quotation');
        return JSON.parse(_quotation);
    }

    /**
     * Function to remove quotation
     */
    public removeQuotation(): void {
        localStorage.removeItem('customer-quotation');
    }

    /**
     * Function to create request to specific api
     * @param {string} type 
     * @param {string} object 
     */
    private request(type: string, object?: Object): Observable<any> {
        let base;

        if (type === 'files/uploadsS3') {
            base = this.http.post(this._apiURL + `/${type}`, object, { headers: this._headers });
        } else {
            const options: {
                headers?: HttpHeaders,
                observe?: 'body',
                params?: HttpParams,
                reportProgress?: boolean,
                responseType: 'text',
                withCredentials?: boolean
            } = {
                headers: this._headers,
                responseType: 'text'
            };
            base = this.http.post(this._apiURL + `/${type}`, object, options);
        }
        const request = base.pipe(retry(3));
        return request;
    }

    /**
     * Function to upload file un AWS
     * @param {any} _pFile 
     */
    private uploadUserFile(_pFile: any): Object {
        let _awsResult = null;
        let _fileToSend: any = {
            'client': this._accessService.getCurrentUser().uuid,
            'typeForm': "solicitudes",
            'file': _pFile,
            'bucket': 'ormiggatestfiles'
        };

        this.request('files/uploadsS3', _fileToSend).subscribe((result) => {
            _awsResult = result;
        }, (err) => {
            _awsResult = null;
        });
        return _awsResult;
    }

    /**
     * Function to create quotation
     */
    public createQuotation(): Observable<any> {
        let _quotation: Quotation = this.getQuotation();

        if (_quotation.appUserFile) {
            let _result: Object = this.uploadUserFile(_quotation.appUserFile);
            if (_result) {
                _quotation.file = _result;
            }
        }

        let _objectToSend = {
            token: this._accessService.getCurrentUser().uuid,
            solicitud: _quotation,
            proveedores: [],
            ormiggaPro: this._accessService.getCurrentUser().ormiggaPro
        };

        return this.request('contratante/1.0/createSolicitud2', _objectToSend);
    }

    /**
     * Function to return user requests
     */
    public viewRequests(_pPage: number, _pAction: string): Observable<any> {
        let _objectToSend = {
            token: this._accessService.getCurrentUser().uuid,
            page: _pPage,
            action: _pAction,
            tokenSolicitud: "",
            user_uuid: this._accessService.getCurrentUser().user_uuid
        };

        return this.request('contratante/1.0/viewRequest', _objectToSend);
    }

    /**
     * Function to view request detail
     * @param {string} _pTokenRequest 
     */
    public viewRequestData(_pTokenRequest: string): Observable<any> {
        let _objectToSend = {
            token: this._accessService.getCurrentUser().uuid,
            tokenSolicitud: _pTokenRequest
        }

        return this.request('contratante/1.0/getSolicitudData', _objectToSend);
    }

    /**
     * Function to view request proposals
     * @param {string} _pTokenRequest 
     */
    public viewRequestProposals(_pTokenRequest: string): Observable<any> {
        let _objectToSend = {
            token: this._accessService.getCurrentUser().uuid,
            tokenSolicitud: _pTokenRequest,
            user_uuid: this._accessService.getCurrentUser().user_uuid
        }

        return this.request('contratante/1.0/getProposal', _objectToSend);
    }

    public viewRequestProposalDetail(_pTokenProposal: string): Observable<any> {
        let _objectToSend = {
            token: this._accessService.getCurrentUser().uuid,
            tokenPropuesta: _pTokenProposal
        }

        return this.request('contratante/1.0/getProposalData', _objectToSend);
    }
}