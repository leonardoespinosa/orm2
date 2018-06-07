import { Component, OnInit } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { StepTwoPage } from '../step-two/step-two';

@Component({
    selector: 'page-step-one',
    templateUrl: 'step-one.html'
})
export class StepOnePage implements OnInit {

    private _recording: boolean = false;
    private _filePath: string;
    private _fileName: string;
    private _audio: MediaObject;
    private _audioList: any[] = [];
    private _recordIndex: number;
    private disconnectSubscription: Subscription;

    /**
     * StepOnePage Constructor
     * @param {NavController} _navCtrl 
     * @param {Media} _media 
     * @param {File} _file 
     * @param {Platform} _platform 
     * @param {Network} _network
     * @param {AlertController} _alertCtrl
     */
    constructor(public _navCtrl: NavController,
        private _media: Media,
        private _file: File,
        public _platform: Platform,
        private _network: Network,
        public _alertCtrl: AlertController) {

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
        this._recordIndex = 0;
    }

    /**
     * Function to cancel quotation creation
     */
    cancel(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to continue in step two
     */
    goToStepTwo(): void {
        this._navCtrl.push(StepTwoPage);
    }

    /**
     * Function to start audio record
     */
    startRecord(): void {
        this._recordIndex = this._recordIndex + 1;
        if (this._platform.is('ios')) {
            this._fileName = 'Solicitud_#' + this._recordIndex.toString() + '_' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.m4a';
            this._filePath = this._file.documentsDirectory.replace(/file:\/\//g, '') + this._fileName;
            this._audio = this._media.create(this._filePath);
        } else if (this._platform.is('android')) {
            this._fileName = 'Solicitud_#' + this._recordIndex.toString() + '_' + new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() + '.3gp';
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
