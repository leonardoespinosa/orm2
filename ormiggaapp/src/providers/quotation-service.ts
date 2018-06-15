import { Injectable } from '@angular/core';
import { Quotation } from '../models/quotation/quotation.model';

@Injectable()
export class QuotationServiceProvider {

    constructor() { }

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
}