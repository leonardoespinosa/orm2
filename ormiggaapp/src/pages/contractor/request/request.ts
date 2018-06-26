import { Component, NgZone } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { AccessServiceProvider } from '../../../providers/access-service';
import { QuotationServiceProvider } from '../../../providers/quotation-service';

@Component({
    selector: 'page-request',
    templateUrl: 'request.html'
})
export class RequestPage {

    private _allSolicitudesLoaded: any[] = [];
    private disconnectSubscription: Subscription;

    /**
     * RequestPage Constructor
     * @param {NavController} navCtrl 
     * @param {AlertController} _alertCtrl 
     * @param {Platform} _platform 
     * @param {Network} _network 
     * @param {NgZone} _ngZone
     * @param {AccessServiceProvider} _accessService 
     * @param {QuotationServiceProvider} _quotationService
     */
    constructor(public navCtrl: NavController,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        private _ngZone: NgZone,
        private _accessService: AccessServiceProvider,
        private _quotationService: QuotationServiceProvider) {

    }

    /**
     * ionViewWillLeave Implementation
     */
    ionViewWillLeave() {
        this.disconnectSubscription.unsubscribe();
    }

    /**
     * ionViewWillEnter Implementation
     */
    ionViewWillEnter() {
        this._quotationService.viewRequests().subscribe((result) => {
            this._ngZone.run(() => {
                let _dataRSP: any = JSON.parse(atob(result.toString('utf8')));
                console.log(_dataRSP);
            });
        }, (err) => {
            console.log('print error');
            console.log(err);
        });
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
