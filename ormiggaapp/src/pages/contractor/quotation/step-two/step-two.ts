import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-step-two',
    templateUrl: 'step-two.html'
})
export class StepTwoPage {

    constructor(public _navCtrl: NavController) {

    }

    goToStepOne(): void {
        this._navCtrl.pop();
    }

    goToStepThree(): void {

    }

}
