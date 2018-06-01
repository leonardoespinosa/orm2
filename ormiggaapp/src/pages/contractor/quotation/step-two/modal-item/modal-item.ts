import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Item } from '../../../../../models/quotation/item.model';

@Component({
    selector: 'modal-item',
    templateUrl: 'modal-item.html'
})
export class ModalItem {

    private _item: Item;
    private _msgError: string;
    private _showError: boolean = false;

    /**
     * ModalItem Constructor
     * @param viewCtrl 
     * @param _params 
     */
    constructor(public viewCtrl: ViewController,
        public _params: NavParams) {
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
            this._msgError = 'Por favor ingresa la descripcion del item';
            this._showError = true;
        } else if (this._item.quantity <= 0 || this._item.quantity === null) {
            this._msgError = 'Por favor ingresa las unidades';
            this._showError = true;
        } else if (this._item.valSuggest&& this._item.valSuggest <= 0) {
            this._msgError = 'Por favor verifica el presupuesto';
            this._showError = true;
        } else {
            this.viewCtrl.dismiss(this._item);
        }
    }
}