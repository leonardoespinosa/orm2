import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { StepOnePage } from './step-one/step-one';

@Component({
  selector: 'page-quotation',
  templateUrl: 'quotation.html'
})
export class QuotationPage {

  private disconnectSubscription: Subscription;

  /**
   * QuotationPage Constructor
   * @param {NavController} navCtrl 
   * @param {AlertController} _alertCtrl 
   * @param {Platform} _platform 
   * @param {Network} _network 
   */
  constructor(public navCtrl: NavController,
    public _alertCtrl: AlertController,
    public _platform: Platform,
    private _network: Network ) {

  }

  /**
   * Function to begin quotation creation
   */
  goToStepOne(): void {
    this.navCtrl.push(StepOnePage);
  }

  /**
   * ionViewWillLeave Implementation
   */
  ionViewWillLeave() {
    this.disconnectSubscription.unsubscribe();
  }

  /** 
   * This function verify the conditions on page did enter for internet and server connection
   */
  ionViewDidEnter() {
    this.isConnected();
    this.disconnectSubscription = this._network.onDisconnect().subscribe(data => {
      let title = 'Error de red';
      let subtitle = 'Por favor revisa tu conexión a internet e intenta de nuevo';
      let btn = 'Reintentar';
      this.presentAlert(title, subtitle, btn);
    }, error => console.error(error));
  }

  /** 
   * This function verify with network plugin if device has internet connection
   */
  isConnected() {
    if (this._platform.is('cordova')) {
      let conntype = this._network.type;
      let validateConn = conntype && conntype !== 'unknown' && conntype !== 'none';
      if (!validateConn) {
        let title = 'Error de red';
        let subtitle = 'Por favor revisa tu conexión a internet e intenta de nuevo';
        let btn = 'Reintentar';
        this.presentAlert(title, subtitle, btn);
      } /*else {
              if (!Meteor.status().connected) {
                  let title2 = this.itemNameTraduction('MOBILE.SERVER_ALERT.TITLE');
                  let subtitle2 = this.itemNameTraduction('MOBILE.SERVER_ALERT.SUBTITLE');
                  let btn2 = this.itemNameTraduction('MOBILE.SERVER_ALERT.BTN');
                  this.presentAlert(title2, subtitle2, btn2);
              }
          }*/
    }
  }

  /**
   * Present the alert for advice to internet
   */
  presentAlert(_pTitle: string, _pSubtitle: string, _pBtn: string) {
    let alert = this._alertCtrl.create({
      title: _pTitle,
      subTitle: _pSubtitle,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: _pBtn,
          handler: () => {
            this.isConnected();
          }
        }
      ]
    });
    alert.present();
  }
}
