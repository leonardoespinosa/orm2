import { Component } from '@angular/core';
import { ViewController, NavParams, ToastController } from 'ionic-angular';
import { Item } from '../../../../../models/quotation/item.model';

@Component({
    selector: 'modal-item-edit',
    templateUrl: 'modal-item-edit.html'
})
export class ModalItemEdit {

    private _index: number;
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
        this._index = this._params.get('index');
        this._item = this._params.get('itemEdit');
    }

    /**
     * Function to close modal
     */
    close(): void {
        this.viewCtrl.dismiss();
    }

    /**
     * Function to close modal with item edited
     */
    closeWithItemEdit(): void {
        if (this._item.description === '') {
            this.presentToast('Por favor ingresa la descripción del item');
        } else if (this._item.quantity <= 0 || this._item.quantity === null) {
            this.presentToast('Por favor ingresa las unidades');
        } else if (this._item.valSuggest && this._item.valSuggest <= 0) {
            this.presentToast('Por favor verifica el presupuesto');
        } else {
            this.viewCtrl.dismiss({ remove: false, index: this._index, item: this._item });
        }
    }

    /**
     * Function to close modal with item removed
     */
    removeItem(): void {
        this.viewCtrl.dismiss({ remove: true, index: this._index, item: this._item });
    }

    /**
     * Function to show toast
     * @param {string} _pMessage 
     */
    presentToast(_pMessage: string): void {
        const toast = this._toastCtrl.create({
            message: _pMessage,
            duration: 3000,
            position: 'middle'
        });
        toast.present();
    }
}