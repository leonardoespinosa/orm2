import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { ModalItem } from './modal-item/modal-item';
import { Item } from '../../../../models/quotation/item.model';
import { StepThreePage } from '../step-three/step-three';

@Component({
    selector: 'page-step-two',
    templateUrl: 'step-two.html'
})
export class StepTwoPage {

    private _items: Item[] = [];

    /**
     * StepTwoPage Constructor
     * @param {NavController} _navCtrl 
     * @param {ModalController} _modalCtrl 
     */
    constructor(public _navCtrl: NavController,
        public _modalCtrl: ModalController) {
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
}
