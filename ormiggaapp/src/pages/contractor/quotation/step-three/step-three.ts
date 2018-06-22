import { Component } from '@angular/core';
import { NavController, AlertController, Platform, ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Subscription } from 'rxjs';
import { AccessServiceProvider } from '../../../../providers/access-service';
import { StepFourPage } from '../step-four/step-four';
@Component({
    selector: 'page-step-three',
    templateUrl: 'step-three.html'
})
export class StepThreePage {

    private _fileURI: any = null;
    private disconnectSubscription: Subscription;

    /**
     * StepThreePage Constructor
     * @param {NavController} _navCtrl 
     * @param {AlertController} _alertCtrl 
     * @param {Platform} _platform 
     * @param {Network} _network 
     * @param {AccessServiceProvider} _accessService
     * @param {FileTransfer} _transfer
     * @param {Camera} _camera
     * @param {ToastController} _toastCtrl
     */
    constructor(public _navCtrl: NavController,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        private _accessService: AccessServiceProvider,
        private _transfer: FileTransfer,
        private _camera: Camera,
        public _toastCtrl: ToastController) {

    }

    /**
     * ionViewWillLeave Implementation
     */
    ionViewWillLeave() {
        this.disconnectSubscription.unsubscribe();
    }

    /**
     * Function to get image with camera
     */
    getFile() {
        const options: CameraOptions = {
            quality: 100,
            destinationType: this._camera.DestinationType.FILE_URI,
            sourceType: this._camera.PictureSourceType.PHOTOLIBRARY
        }
        this._camera.getPicture(options).then((imageData) => {
            this._fileURI = imageData;
            console.log(this._fileURI);
        }, (err) => {
            console.log(err);
            this.presentToast(err);
        });
    }

    /**
     * Function to remove URI
     */
    removeFile() {
        this._fileURI = null;
    }

    /**
     * Function to go back in step two
     */
    goToStepTwo(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step four
     * The reason why the quotation is sent by the localstorage (and not navparams) is for 
     * the requirement: "In case the user leaves or closes the app without completing the 
     * quotation, the data must be reloaded to the point where it was going"
     */
    goToStepFour(): void {
        this._navCtrl.push(StepFourPage);
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