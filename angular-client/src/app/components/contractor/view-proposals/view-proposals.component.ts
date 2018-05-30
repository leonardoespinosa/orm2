import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUser } from '../../../models/access/access.model';
import { AccessService } from '../../../services/access/access.service';

@Component({
    selector: 'view-proposals',
    templateUrl: './view-proposals.component.html',
    styleUrls: ['./view-proposals.component.scss']
})
export class ViewProposalsComponent implements OnInit, OnDestroy {

    _currentUser: CurrentUser;
    _inProcess: boolean = false;
    _solicitudSelect: Object = { nameRequest: "No hay solicitudes creadas" }

    /**
     * ViewProposalsComponent Constructor
     * @param {AccessService} _accessService 
     */
    constructor(private _accessService: AccessService, private _router: Router) {
        this._currentUser = this._accessService.getCurrentUser();
    }

    ngOnInit() {
        
    }

    /**
     * Function to navigate supplier contracts component
     */
    goToSupplierContracts(): void {
        this._router.navigate(['portal/supplier-contracts']);
    }

    ngOnDestroy() {

    }
}