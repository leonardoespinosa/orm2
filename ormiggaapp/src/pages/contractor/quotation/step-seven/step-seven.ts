import { Component } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController, App } from 'ionic-angular';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network';
import { ContractorTabsPage } from '../../../contractor/tabs/contractor-tabs';
import { AccessServiceProvider } from '../../../../providers/access-service';

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
     * @param {LoadingController} _loadingCtrl
     * @param {App} _app
     * @param {AccessServiceProvider} _accessService
     */
    constructor(public _navCtrl: NavController,
        private _dragulaService: DragulaService,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        public _loadingCtrl: LoadingController,
        private _app: App,
        private _accessService: AccessServiceProvider) {
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
        let loading_msg = 'Creando solicitud...';
        let loading = this._loadingCtrl.create({ content: loading_msg });
        loading.present();
        setTimeout(() => {
            this._app.getRootNavs()[0].setRoot(ContractorTabsPage);
            loading.dismiss();
        }, 1500);
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
            } else {
                this._accessService.verifyApiConnection().subscribe((result) => { }, (err) => {
                    if (err.status === 0) {
                        let title2 = 'Error de servicio!';
                        let subtitle2 = 'En este momento el servicio de Ormigga no se encuentra disponible. por favor intenta de nuevo.'
                        let btn2 = 'Reintentar'
                        this.presentAlert(title2, subtitle2, btn2);
                    }
                });
            }
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