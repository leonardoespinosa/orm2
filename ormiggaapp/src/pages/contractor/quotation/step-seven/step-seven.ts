import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController, App } from 'ionic-angular';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Subscription } from 'rxjs';
import { Network } from '@ionic-native/network';
import { ContractorTabsPage } from '../../../contractor/tabs/contractor-tabs';
import { AccessServiceProvider } from '../../../../providers/access-service';
import { QuotationServiceProvider } from '../../../../providers/quotation-service';
import { Quotation, Weight, WeightDetail } from '../../../../models/quotation/quotation.model';

@Component({
    selector: 'page-step-seven',
    templateUrl: 'step-seven.html'
})
export class StepSevenPage implements OnInit {

    private _newQuotation: Quotation;
    public items: WeightDetail[] = [];
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
     * @param {QuotationServiceProvider} _quotationService
     */
    constructor(public _navCtrl: NavController,
        private _dragulaService: DragulaService,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        public _loadingCtrl: LoadingController,
        private _app: App,
        private _accessService: AccessServiceProvider,
        private _quotationService: QuotationServiceProvider) {
        this.items = [
            { status: true, text: 'Tiempo de Entrega (días)', value: '' },
            { status: true, text: 'Valor Propuesta', value: '' },
            { status: true, text: 'Años de Experiencia', value: '' },
            { status: true, text: 'Calificación', value: '' },
            { status: true, text: 'Forma de Pago', value: '' },
            { status: true, text: 'Calidad del Producto/Servicio', value: '' }];
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
     * ngOnInit Implementation
     */
    ngOnInit() {
        let _quotation: Quotation = this._quotationService.getQuotation();
        if (_quotation) {
            this._newQuotation = _quotation;
            this.items = this.buildItems();
        } else {
            this.items = [
                { status: true, text: 'Tiempo de Entrega (días)', value: '' },
                { status: true, text: 'Valor Propuesta', value: '' },
                { status: true, text: 'Años de Experiencia', value: '' },
                { status: true, text: 'Calificación', value: '' },
                { status: true, text: 'Forma de Pago', value: '' },
                { status: true, text: 'Calidad del Producto/Servicio', value: '' }];
        }
    }

    /**
     * Function to validate drop list
     * @param {any} val 
     */
    onDrop(val: any): void {
        this.items = [];
        val.childNodes.forEach((item) => {
            if (item.id !== undefined) {
                this.items.push({ status: true, text: item.id, value: '' });
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
     * Function to build items vector
     */
    buildItems(): WeightDetail[] {
        let _itemsAux: WeightDetail[] = [];
        if (this._newQuotation.peso) {
            if (this._newQuotation.peso.calidad) {
                let _item: WeightDetail = { status: true, text: 'Calidad del Producto/Servicio', value: this._newQuotation.peso.calidad.value };
                _itemsAux.push(_item);
            } else {
                let _item: WeightDetail = { status: true, text: 'Calidad del Producto/Servicio', value: '' };
                _itemsAux.push(_item);
            }

            if (this._newQuotation.peso.calificacion) {
                let _item: WeightDetail = { status: true, text: 'Calificación', value: this._newQuotation.peso.calificacion.value };
                _itemsAux.push(_item);
            } else {
                let _item: WeightDetail = { status: true, text: 'Calificación', value: '' };
                _itemsAux.push(_item);
            }

            if (this._newQuotation.peso.experiencia) {
                let _item: WeightDetail = { status: true, text: 'Años de Experiencia', value: this._newQuotation.peso.experiencia.value };
                _itemsAux.push(_item);
            } else {
                let _item: WeightDetail = { status: true, text: 'Años de Experiencia', value: '' };
                _itemsAux.push(_item);
            }

            if (this._newQuotation.peso.formapago) {
                let _item: WeightDetail = { status: true, text: 'Forma de Pago', value: this._newQuotation.peso.formapago.value };
                _itemsAux.push(_item);
            } else {
                let _item: WeightDetail = { status: true, text: 'Forma de Pago', value: '' };
                _itemsAux.push(_item);
            }

            if (this._newQuotation.peso.tiempoentrega) {
                let _item: WeightDetail = { status: true, text: 'Tiempo de Entrega (días)', value: this._newQuotation.peso.tiempoentrega.value };
                _itemsAux.push(_item);
            } else {
                let _item: WeightDetail = { status: true, text: 'Tiempo de Entrega (días)', value: '' };
                _itemsAux.push(_item);
            }

            if (this._newQuotation.peso.valueProffer) {
                let _item: WeightDetail = { status: true, text: 'Valor Propuesta', value: this._newQuotation.peso.valueProffer.value };
                _itemsAux.push(_item);
            } else {
                let _item: WeightDetail = { status: true, text: 'Valor Propuesta', value: '' };
                _itemsAux.push(_item);
            }
            _itemsAux.sort(function (a, b) { return Number.parseInt(b.value.toString()) - Number.parseInt(a.value.toString()) });
        } else {
            _itemsAux = [
                { status: true, text: 'Tiempo de Entrega (días)', value: '' },
                { status: true, text: 'Valor Propuesta', value: '' },
                { status: true, text: 'Años de Experiencia', value: '' },
                { status: true, text: 'Calificación', value: '' },
                { status: true, text: 'Forma de Pago', value: '' },
                { status: true, text: 'Calidad del Producto/Servicio', value: '' }];
        }
        return _itemsAux;
    }

    /**
     * Function to create quotation
     */
    createQuotation(): void {
        let loading_msg = 'Creando solicitud...';
        let loading = this._loadingCtrl.create({ content: loading_msg });
        let _weight: Weight;
        let _itemsAux: WeightDetail[] = [];

        _itemsAux = this.setItemValues();
        _weight = this.buildWeight(_itemsAux);
        this._newQuotation.peso = _weight;
        this._quotationService.setQuotation(this._newQuotation);
        loading.present();
        setTimeout(() => {
            let _quotation: Quotation = this._quotationService.getQuotation();
            //this._app.getRootNavs()[0].setRoot(ContractorTabsPage);
            loading.dismiss();
        }, 3500);
    }

    /**
     * Function to set values in items
     */
    setItemValues(): WeightDetail[] {
        let _itemsAux: WeightDetail[] = [];
        let _index: number = 0;
        for (let it of this.items) {
            _index = _index + 1;
            if (_index === 1) {
                it.value = '50';
            } else if (_index === 2) {
                it.value = '25';
            } else if (_index === 3) {
                it.value = '13';
            } else if (_index === 4) {
                it.value = '7';
            } else if (_index === 5) {
                it.value = '4';
            } else if (_index === 6) {
                it.value = '0';
            }
            _itemsAux.push(it);
        }
        return _itemsAux;
    }

    /**
     * Function to build quitation weight
     * @param {WeightDetail[]} _pItems 
     */
    buildWeight(_pItems: WeightDetail[]): Weight {
        let _weightAux: Weight = {};
        for (let it of _pItems) {
            if (it.text === 'Calidad del Producto/Servicio') {
                _weightAux.calidad = it;
            }
            if (it.text === 'Calificación') {
                _weightAux.calificacion = it;
            }
            if (it.text === 'Años de Experiencia') {
                _weightAux.experiencia = it;
            }
            if (it.text === 'Forma de Pago') {
                _weightAux.formapago = it;
            }
            if (it.text === 'Tiempo de Entrega (días)') {
                _weightAux.tiempoentrega = it;
            }
            if (it.text === 'Valor Propuesta') {
                _weightAux.valueProffer = it;
            }
        }
        return _weightAux;
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