import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { StepSevenPage } from '../step-seven/step-seven';
import { AccessServiceProvider } from '../../../../providers/access-service';

@Component({
    selector: 'page-step-six',
    templateUrl: 'step-six.html'
})
export class StepSixPage {

    private _advance: number;
    private _upon_delivery: number;
    private _30_days: number;
    private _60_days: number;
    private _90_days: number;
    private disconnectSubscription: Subscription;

    /**
     * StepSixPage Constructor
     * @param {NavController} _navCtrl 
     * @param {AlertController} _alertCtrl 
     * @param {Platform} _platform 
     * @param {Network} _network 
     * @param {AccessServiceProvider} _accessService
     */
    constructor(public _navCtrl: NavController,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        private _accessService: AccessServiceProvider) {
        this._advance = 20;
        this._upon_delivery = 80;
        this._30_days = 0;
        this._60_days = 0;
        this._90_days = 0;
    }

    /**
     * ionViewWillLeave Implementation
     */
    ionViewWillLeave() {
        this.disconnectSubscription.unsubscribe();
    }

    /**
     * Function to go back in step five
     */
    goToStepFive(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step seven
     */
    goToStepSeven(): void {
        this._navCtrl.push(StepSevenPage);
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