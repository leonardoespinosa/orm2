import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StepSevenPage } from '../step-seven/step-seven';

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

    constructor(public _navCtrl: NavController) {
        this._advance = 20;
        this._upon_delivery = 80;
        this._30_days = 0;
        this._60_days = 0;
        this._90_days = 0;
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
}