import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network';

@Component({
    selector: 'page-step-seven',
    templateUrl: 'step-seven.html'
})
export class StepSevenPage {

    public items: any = [
        { name: 'Tiempo de Entrega (días)' },
        { name: 'Valor Propuesta' },
        { name: 'Años de Experiencia' },
        { name: 'Calificación Proveedor en Ormigga.com' },
        { name: 'Forma de Pago' },
        { name: 'Calidad del Producto/Servicio' }];

    private disconnectSubscription: Subscription;

    /**
     * StepSevenPage Constructor
     * @param {NavController} _navCtrl 
     * @param {DragulaService} _dragulaService 
     * @param {AlertController} _alertCtrl 
     * @param {Platform} _platform 
     * @param {Network} _network 
     */
    constructor(public _navCtrl: NavController,
        private _dragulaService: DragulaService,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network) {
        _dragulaService.drag.subscribe((val) => { });
        _dragulaService.drop.subscribe((val) => {
            this.onDrop(val[2]);
        });
    }

    /**
     * ionViewWillLeave Implementation
     */
    ionViewWillLeave() {
        this.disconnectSubscription.unsubscribe();
    }

    /**
     * Function to validate drop list
     * @param {any} val 
     */
    onDrop(val: any): void {
        this.items = [];
        val.childNodes.forEach((item) => {
            if (item.id !== undefined) {
                this.items.push({ name: item.id });
            }
        });
    }

    /**
     * Function to go back in step six
     */
    goToStepSix(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to create quotation
     */
    createQuotation(): void {

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