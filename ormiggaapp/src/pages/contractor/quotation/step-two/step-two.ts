import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network';
import { ModalItem } from './modal-item/modal-item';
import { ModalItemEdit } from './modal-item-edit/modal-item-edit';
import { Item } from '../../../../models/quotation/item.model';
import { Quotation } from '../../../../models/quotation/quotation.model';
import { AccessServiceProvider } from '../../../../providers/access-service';
import { QuotationServiceProvider } from '../../../../providers/quotation-service';
import { StepThreePage } from '../step-three/step-three';

@Component({
    selector: 'page-step-two',
    templateUrl: 'step-two.html'
})
export class StepTwoPage implements OnInit {

    private _newQuotation: Quotation;
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
     * @param {QuotationServiceProvider} _quotationService
     * @param {ToastController} _toastCtrl
     */
    constructor(public _navCtrl: NavController,
        public _modalCtrl: ModalController,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        private _accessService: AccessServiceProvider,
        private _quotationService: QuotationServiceProvider,
        public _toastCtrl: ToastController) {
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
        let _quotation: Quotation = this._quotationService.getQuotation();
        if (_quotation) {
            this._newQuotation = _quotation;
            if (_quotation.dataItems) {
                this._items = _quotation.dataItems;
            } else {
                this._items = [];
            }
        } else {
            this._items = [];
        }
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
        if (this._items.length === 0) {
            this.presentToast('Ingresa items para poder avanzar');
        } else {
            this._newQuotation.dataItems = this._items;
            this._quotationService.setQuotation(this._newQuotation);
            this._navCtrl.push(StepThreePage);
        }
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
     * Function to edit item
     * @param {number} _pIndex 
     * @param {Item} _pItem 
     */
    EditItem(_pIndex: number, _pItem: Item): void {
        let modal = this._modalCtrl.create(ModalItemEdit, { index: _pIndex, itemEdit: _pItem });
        modal.onDidDismiss(data => {
            if (typeof data != "undefined" || data != null) {
                if (data.remove) {
                    this.deleteItem(data.index);
                } else {
                    this.deleteItem(data.index);
                    this._items.splice(data.index, 0, data.item);
                }
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

    /**
     * Function to show toast
     * @param {string} _pMessage 
     */
    presentToast(_pMessage: string) {
        const toast = this._toastCtrl.create({
            message: _pMessage,
            duration: 3000,
            position: 'middle'
        });
        toast.present();
    }
}
