import { Component } from '@angular/core';
import { QuotationPage } from '../quotation/quotation';
import { RequestPage } from '../request/request';
import { ContractorOptionsPage } from '../options/contractor-options';

@Component({
    selector: 'contractor-tabs',
    templateUrl: 'contractor-tabs.html'
})
export class ContractorTabsPage {

    tab1Root = QuotationPage;
    tab2Root =  RequestPage;
    tab3Root = ContractorOptionsPage;

    constructor() {

    }
}