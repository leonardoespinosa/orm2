import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { CurrentUser } from '../../../models/access/access.model';
import { AccessServiceProvider } from '../../../providers/access-service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'page-contractor-options',
    templateUrl: 'contractor-options.html'
})
export class ContractorOptionsPage implements OnInit {

    private _currentUser: CurrentUser;
    private disconnectSubscription: Subscription;

    /**
     * ContractorOptionsPage Constructor
     * @param {NavController} _navCtrl 
     * @param {AccessServiceProvider} _accessService 
     * @param {LoadingController} _loadingCtrl 
     * @param {AlertController} _alertCtrl
     * @param {Platform} _platform
     * @param {Network} _network
     */
    constructor(public _navCtrl: NavController,
        private _accessService: AccessServiceProvider,
        public _loadingCtrl: LoadingController,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network) {

    }

    /**
     * ionViewWillLeave Implementation
     */
    ionViewWillLeave() {
        this.disconnectSubscription.unsubscribe();
    }

    /**
     * ngOnInit Implementation
     */
    ngOnInit() {
        this._currentUser = this._accessService.getCurrentUser();
    }

    /**
     * Function to close user session
     */
    logout(): void {
        let loading_msg = 'Un momento por favor...';
        let loading = this._loadingCtrl.create({ content: loading_msg });
        loading.present();
        setTimeout(() => {
            this._accessService.logout();
            loading.dismiss();
        }, 1500);
    }

    /** 
     * This function verify the conditions on page did enter for internet and server connection
     */
    ionViewDidEnter() {
        this.isConnected();
        this.disconnectSubscription = this._network.onDisconnect().subscribe(data => {
            let title = 'Error de red';
            let subtitle = 'Por favor revisa tu conexión a internet e intenta de nuevo';
            let btn = 'Reintentar';
            this.presentAlert(title, subtitle, btn);
        }, error => console.error(error));
    }

    /** 
     * This function verify with network plugin if device has internet connection
     */
    isConnected() {
        if (this._platform.is('cordova')) {
            let conntype = this._network.type;
            let validateConn = conntype && conntype !== 'unknown' && conntype !== 'none';
            if (!validateConn) {
                let title = 'Error de red';
                let subtitle = 'Por favor revisa tu conexión a internet e intenta de nuevo';
                let btn = 'Reintentar';
                this.presentAlert(title, subtitle, btn);
            } else {
                this._accessService.verifyApiConnection().subscribe((result) => { }, (err) => {
                    if (err.status === 0) {
                        let title2 = 'Error de servicio!';
                        let subtitle2 = 'En este momento el servicio de Ormigga no se encuentra disponible. por favor intenta de nuevo.'
                        let btn2 = 'Reintentar'
                        this.presentAlert(title2, subtitle2, btn2);
                    }
                });
            }
        }
    }

    /**
     * Present the alert for advice to internet
     */
    presentAlert(_pTitle: string, _pSubtitle: string, _pBtn: string) {
        let alert = this._alertCtrl.create({
            title: _pTitle,
            subTitle: _pSubtitle,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: _pBtn,
                    handler: () => {
                        this.isConnected();
                    }
                }
            ]
        });
        alert.present();
    }
}
