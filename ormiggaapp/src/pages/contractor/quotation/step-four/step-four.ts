import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StepFivePage } from '../step-five/step-five';

@Component({
    selector: 'page-step-four',
    templateUrl: 'step-four.html'
})
export class StepFourPage {

    private _today: string;

    constructor(public _navCtrl: NavController) {
        this._today = new Date().toISOString();
    }

    /**
     * Function to go back in step three
     */
    goToStepThree(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step five
     */
    goToStepFive(): void {
        this._navCtrl.push(StepFivePage);
    }
}