import { Component } from '@angular/core';
import { ViewController, NavParams, ToastController } from 'ionic-angular';
import { Item } from '../../../../../models/quotation/item.model';

@Component({
    selector: 'modal-item',
    templateUrl: 'modal-item.html'
})
export class ModalItem {

    private _item: Item;

    /**
     * ModalItem Constructor
     * @param {ViewController} viewCtrl 
     * @param {NavParams} _params 
     * @param {ToastController} _toastCtrl
     */
    constructor(public viewCtrl: ViewController,
        public _params: NavParams,
        public _toastCtrl: ToastController) {
        this._item = this._params.get('item');
    }

    /**
     * Function to close modal
     */
    close() {
        this.viewCtrl.dismiss();
    }

    /**
     * Function to close modal with item information
     */
    closeWithNewItem() {
        if (this._item.description === '') {
            this.presentToast('Por favor ingresa la descripcion del item');
        } else if (this._item.quantity <= 0 || this._item.quantity === null) {
            this.presentToast('Por favor ingresa las unidades');
        } else if (this._item.valSuggest && this._item.valSuggest <= 0) {
            this.presentToast('Por favor verifica el presupuesto');
        } else {
            this.viewCtrl.dismiss(this._item);
        }
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