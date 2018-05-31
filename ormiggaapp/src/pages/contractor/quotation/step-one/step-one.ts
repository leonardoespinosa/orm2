import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-step-one',
    templateUrl: 'step-one.html'
})
export class StepOnePage {

    constructor(public navCtrl: NavController) {

    }

    cancel():void{
        this.navCtrl.pop();
    }

}
