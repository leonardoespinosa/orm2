import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, Platform } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network';
import { ModalItem } from './modal-item/modal-item';
import { Item } from '../../../../models/quotation/item.model';
import { AccessServiceProvider } from '../../../../providers/access-service';
import { StepThreePage } from '../step-three/step-three';

@Component({
    selector: 'page-step-two',
    templateUrl: 'step-two.html'
})
export class StepTwoPage {

    private _items: Item[] = [];
    private disconnectSubscription: Subscription;

    /**
     * StepTwoPage Constructor
     * @param {NavController} _navCtrl 
     * @param {ModalController} _modalCtrl 
     * @param {AlertController} _alertCtrl
     * @param {Platform} _platform
     * @param {Network} _network
     * @param {AccessServiceProvider} _accessService
     */
    constructor(public _navCtrl: NavController,
        public _modalCtrl: ModalController,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        private _accessService: AccessServiceProvider) {
    }

    /**
     * ionViewWillLeave Implementation
     */
    ionViewWillLeave() {
        this.disconnectSubscription.unsubscribe();
    }

    /**
     * Function to go back in step one
     */
    goToStepOne(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step three
     */
    goToStepThree(): void {
        this._navCtrl.push(StepThreePage);
    }

    /**
     * Function to add item
     */
    AddItem(): void {
        let _item: Item = { description: '', quantity: null, createBy: 'Contratante', valSuggest: null };
        let modal = this._modalCtrl.create( ModalItem, { item: _item });
        modal.onDidDismiss(data => {
            if (typeof data != "undefined" || data != null) {
                this._items.push(data);
            }
        });
        modal.present();
    }

    /**
     * Function to delete item
     * @param {number} _pItemIndex 
     */
    deleteItem(_pItemIndex: number): void {
        this._items.splice(_pItemIndex, 1);
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
