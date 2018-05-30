import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';

@Component({
    selector: 'page-signin',
    templateUrl: 'signin.html'
})
export class SigninComponent implements OnInit {

    private _signinForm: FormGroup;
    private _error: string;
    private disconnectSubscription: Subscription;

    /**
     * SigninComponent Constructor
     * @param {NgZone} _zone 
     * @param {FormBuilder} _formBuilder 
     * @param {NavController} _navCtrl 
     * @param {AlertController} _alertCtrl 
     * @param {LoadingController} _loadingCtrl 
     * @param {Platform} _platform 
     * @param {Network} _network 
     * @param {Device} _device 
     */
    constructor(public _zone: NgZone,
        public _formBuilder: FormBuilder,
        public _navCtrl: NavController,
        public _alertCtrl: AlertController,
        public _loadingCtrl: LoadingController,
        public _platform: Platform,
        private _network: Network,
        private _device: Device) {
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
        this._signinForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
        });

        this._error = '';
    }

    login(){

    }

    sendEmailPrompt(){

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