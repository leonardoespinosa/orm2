import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { AccessServiceProvider } from '../../../../providers/access-service';
import { QuotationServiceProvider } from '../../../../providers/quotation-service';
import { Quotation } from '../../../../models/quotation/quotation.model';
import { StepFivePage } from '../step-five/step-five';

@Component({
    selector: 'page-step-four',
    templateUrl: 'step-four.html'
})
export class StepFourPage implements OnInit {

    private _newQuotation: Quotation;
    private _dateMax: string;
    private _minDate: string;
    private _todayDate: Date;
    private disconnectSubscription: Subscription;

    /**
     * StepFourPage Constructor
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
        this._todayDate = new Date();
        this._todayDate.setDate(this._todayDate.getDate() + 3);
        this._dateMax = this._todayDate.toISOString();
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
        this._minDate = this.getMinDate();
        let _quotation: Quotation = this._quotationService.getQuotation();
        if (_quotation) {
            this._newQuotation = _quotation;
            if (_quotation.dateFinish) {
                this._dateMax = _quotation.dateFinish;
            }
        } else {
            this._dateMax = this._todayDate.toISOString();
        }
    }

    /**
     * Function to return min date
     */
    getMinDate(): string {
        let mindate: Date = new Date();
        let dd: number = mindate.getDate();
        let mm: number = mindate.getMonth() + 1;
        let yyyy: number = mindate.getFullYear();
        let day: string;
        let month: string;

        if (dd < 10) {
            day = '0' + dd;
        } else {
            day = dd.toString();
        }

        if (mm < 10) {
            month = '0' + mm;
        } else {
            month = mm.toString();
        }

        return yyyy + '-' + month + '-' + day;
    }

    /**
     * Function to go back in step three
     */
    goToStepThree(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step five
     * The reason why the quotation is sent by the localstorage (and not navparams) is for 
     * the requirement: "In case the user leaves or closes the app without completing the 
     * quotation, the data must be reloaded to the point where it was going"
     */
    goToStepFive(): void {
        this._newQuotation.dateFinish = this._dateMax;
        this._quotationService.setQuotation(this._newQuotation);
        this._navCtrl.push(StepFivePage);
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