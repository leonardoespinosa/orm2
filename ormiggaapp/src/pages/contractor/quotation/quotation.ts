import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StepOnePage } from './step-one/step-one';

@Component({
  selector: 'page-quotation',
  templateUrl: 'quotation.html'
})
export class QuotationPage {

  constructor(public navCtrl: NavController) {

  }

  /**
   * Function to begin quotation creation
   */
  goToStepOne():void{
    this.navCtrl.push(StepOnePage);
  }

}
