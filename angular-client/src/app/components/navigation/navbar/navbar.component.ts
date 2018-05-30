import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccessService } from '../../../services/access/access.service';
import { CurrentUser } from '../../../models/access/access.model';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

    _currentUser: CurrentUser;

    constructor(private _accessService: AccessService) { }

    ngOnInit() {
        this._currentUser = this._accessService.getCurrentUser();
    }

    logout(){
        this._accessService.logout();
    }

    ngOnDestroy() {

    }
}