import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StepFourPage } from '../step-four/step-four';

@Component({
    selector: 'page-step-three',
    templateUrl: 'step-three.html'
})
export class StepThreePage {

    constructor(public _navCtrl: NavController) {

    }

    /**
     * Function to go back in step two
     */
    goToStepTwo(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step four
     */
    goToStepFour(): void {
        this._navCtrl.push(StepFourPage);
    }
}