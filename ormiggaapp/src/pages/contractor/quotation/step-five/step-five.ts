import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StepSixPage } from '../step-six/step-six';

@Component({
    selector: 'page-step-five',
    templateUrl: 'step-five.html'
})
export class StepFivePage {

    private _today: string;

    constructor(public _navCtrl: NavController) {
        this._today = new Date().toISOString();
    }

    /**
     * Function to go back in step four
     */
    goToStepFour(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step six
     */
    goToStepSix(): void {
        this._navCtrl.push(StepSixPage);
    }
}