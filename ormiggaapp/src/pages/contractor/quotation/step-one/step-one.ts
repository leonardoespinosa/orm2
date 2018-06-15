import { Component, OnInit } from '@angular/core';
import { NavController, Platform, AlertController, ToastController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { Quotation } from '../../../../models/quotation/quotation.model';
import { AccessServiceProvider } from '../../../../providers/access-service';
import { QuotationServiceProvider } from '../../../../providers/quotation-service';
import { CurrentUser } from '../../../../models/access/access.model';
import { StepTwoPage } from '../step-two/step-two';

@Component({
    selector: 'page-step-one',
    templateUrl: 'step-one.html'
})
export class StepOnePage implements OnInit {

    private _newQuotation: Quotation;
    private _nameRequest: string;
    private _description: string;
    private disconnectSubscription: Subscription;

    private _recordIndex: number;
    private _recording: boolean = false;
    private _filePath: string;
    private _fileName: string;
    private _audio: MediaObject;
    private _audioList: any[] = [];

    /**
     * StepOnePage Constructor
     * @param {NavController} _navCtrl 
     * @param {Media} _media 
     * @param {File} _file 
     * @param {Platform} _platform 
     * @param {Network} _network
     * @param {AlertController} _alertCtrl
     * @param {AccessServiceProvider} _accessService
     * @param {QuotationServiceProvider} _quotation
     * @param {ToastController} _toastCtrl
     */
    constructor(public _navCtrl: NavController,
        private _media: Media,
        private _file: File,
        public _platform: Platform,
        private _network: Network,
        public _alertCtrl: AlertController,
        private _accessService: AccessServiceProvider,
        private _quotationService: QuotationServiceProvider,
        public _toastCtrl: ToastController) {

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
        let _currentUser: CurrentUser = this._accessService.getCurrentUser();
        let _quotation: Quotation = this._quotationService.getQuotation();
        if (_quotation) {
            this._newQuotation = _quotation;
            this._nameRequest = _quotation.nameRequest;
            if (_quotation.questions) {
                this._description = _quotation.questions["Descripción del requerimiento"]
            } else {
                this._description = '';
            }
        } else {
            this._newQuotation = {
                client: _currentUser.name,
                username: _currentUser.username,
                tokenContratante: _currentUser.token_user,
                name: _currentUser.name,
                countProffers: 0,
                habilities: [],
                haveDateContrato: true,
                maxPropuestas: 50,
                nacional: false,
                sendForm: "save",
                nameRequest: '',
                questions: {
                    "Descripción del requerimiento": '',
                    "propous": ''
                }
            }
            this._nameRequest = '';
            this._description = '';
        }
        this._recordIndex = 0;
    }

    /**
     * Function to cancel quotation creation
     */
    cancel(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step two.
     * The reason why the quotation is sent by the localstorage (and not navparams) is for 
     * the requirement: "In case the user leaves or closes the app without completing the 
     * quotation, the data must be reloaded to the point where it was going"
     */
    goToStepTwo(): void {
        if (this._nameRequest === '') {
            this.presentToast('Ingresa el Nombre del Producto/Servicio')
        } else {
            if (this._description === '' && this._audioList.length === 0) {
                this.presentToast('Ingresa una descripción o graba un audio');
            } else {
                this._newQuotation.nameRequest = this._nameRequest;
                this._newQuotation.questions["Descripción del requerimiento"] = this._description;
                this._quotationService.setQuotation(this._newQuotation);
                this._navCtrl.push(StepTwoPage);
            }
        }
    }

    /**
     * Function to start audio record
     */
    startRecord(): void {
        this._recordIndex = this._recordIndex + 1;
        if (this._platform.is('ios')) {
            this._fileName = 'Solicitud_#' + this._recordIndex.toString() + '_' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.mp3';
            this._filePath = this._file.documentsDirectory.replace(/file:\/\//g, '') + this._fileName;
            this._audio = this._media.create(this._filePath);
        } else if (this._platform.is('android')) {
            this._fileName = 'Solicitud_#' + this._recordIndex.toString() + '_' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.mp3';
            this._filePath = this._file.externalDataDirectory.replace(/file:\/\//g, '') + this._fileName;
            this._audio = this._media.create(this._filePath);
        }
        this._audio.startRecord();
        this._recording = true;
    }

    /**
     * Function to stop audio record
     */
    stopRecord(): void {
        this._audio.stopRecord();
        let data = { filename: this._fileName };
        this._audioList.push(data);
        this._recording = false;
        // this.audioBlob = new Blob([this._audio], {type: 'audio/mp3'});
    }

    /**
     * Function to reproduce audio record
     * @param {number} file 
     * @param {string} idx 
     */
    playAudio(file: string, idx: number): void {
        if (this._platform.is('ios')) {
            this._filePath = this._file.documentsDirectory.replace(/file:\/\//g, '') + file;
            this._audio = this._media.create(this._filePath);
        } else if (this._platform.is('android')) {
            this._filePath = this._file.externalDataDirectory.replace(/file:\/\//g, '') + file;
            this._audio = this._media.create(this._filePath);
        }
        this._audio.play();
        this._audio.setVolume(0.8);
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
     * Function to show toast
     * @param {string} _pMessage 
     */
    presentToast(_pMessage: string) {
        const toast = this._toastCtrl.create({
            message: _pMessage,
            duration: 3000,
            position: 'middle'
        });
        toast.present();
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
