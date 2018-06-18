import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { StepSevenPage } from '../step-seven/step-seven';
import { AccessServiceProvider } from '../../../../providers/access-service';
import { QuotationServiceProvider } from '../../../../providers/quotation-service';
import { Quotation } from '../../../../models/quotation/quotation.model';
@Component({
    selector: 'page-step-six',
    templateUrl: 'step-six.html'
})
export class StepSixPage implements OnInit {

    private _newQuotation: Quotation;
    private _advance: number;
    private _upon_delivery: number;
    private _30_days: number;
    private _60_days: number;
    private _90_days: number;
    private _acceptOtherOffer: boolean = false;
    private disconnectSubscription: Subscription;

    /**
     * StepSixPage Constructor
     * @param {NavController} _navCtrl 
     * @param {AlertController} _alertCtrl 
     * @param {Platform} _platform 
     * @param {Network} _network 
     * @param {AccessServiceProvider} _accessService
     * @param {QuotationServiceProvider} _quotationService
     * @param {ToastController} _toastCtrl
     */
    constructor(public _navCtrl: NavController,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        private _accessService: AccessServiceProvider,
        private _quotationService: QuotationServiceProvider,
        public _toastCtrl: ToastController) {
        this._advance = 20;
        this._upon_delivery = 80;
        this._30_days = 0;
        this._60_days = 0;
        this._90_days = 0;
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
            if (_quotation.pago) {
                if (_quotation.pago.anticipo) {
                    this._advance = _quotation.pago.anticipo;
                }
                if (_quotation.pago.pagoentrega) {
                    this._upon_delivery = _quotation.pago.pagoentrega;
                }
                if (_quotation.pago["En 30 días"]) {
                    this._30_days = _quotation.pago["En 30 días"];
                }
                if (_quotation.pago["En 60 días"]) {
                    this._60_days = _quotation.pago["En 60 días"];
                }
                if (_quotation.pago["En 90 días"]) {
                    this._90_days = _quotation.pago["En 90 días"];
                }
            }
            if (_quotation.notFlexPayForm) {
                this._acceptOtherOffer = _quotation.notFlexPayForm;
            }
        } else {
            this._advance = 20;
            this._upon_delivery = 80;
            this._30_days = 0;
            this._60_days = 0;
            this._90_days = 0;
            this._acceptOtherOffer = false;
        }
    }

    /**
     * Function to go back in step five
     */
    goToStepFive(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step seven
     * The reason why the quotation is sent by the localstorage (and not navparams) is for 
     * the requirement: "In case the user leaves or closes the app without completing the 
     * quotation, the data must be reloaded to the point where it was going"
     */
    goToStepSeven(): void {
        let sum: number = Number.parseInt(this._advance.toString()) + Number.parseInt(this._upon_delivery.toString()) + Number.parseInt(this._30_days.toString()) + Number.parseInt(this._60_days.toString()) + Number.parseInt(this._90_days.toString());

        if (sum !== 100) {
            this.presentToast('La forma de pago debe sumar el 100%');
        } else {
            this._newQuotation.pago.anticipo = this._advance;
            this._newQuotation.pago.pagoentrega = this._upon_delivery;
            this._newQuotation.pago["En 30 días"] = this._30_days;
            this._newQuotation.pago["En 60 días"] = this._60_days;
            this._newQuotation.pago["En 90 días"] = this._90_days;
            this._newQuotation.notFlexPayForm = this._acceptOtherOffer;
            this._quotationService.setQuotation(this._newQuotation);
            this._navCtrl.push(StepSevenPage);
        }
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

    /**
     * Function to show toast
     * @param {string} _pMessage 
     */
    presentToast(_pMessage: string) {
        const toast = this._toastCtrl.create({
            message: _pMessage,
            duration: 2000,
            position: 'middle'
        });
        toast.present();
    }
}