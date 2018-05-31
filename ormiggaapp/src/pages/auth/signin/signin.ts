import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Subscription } from 'rxjs';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { User, UserData, CurrentUser } from '../../../models/access/access.model';
import { AccessServiceProvider } from '../../../providers/access-service';
import { ContractorTabsPage } from '../../contractor/tabs/contractor-tabs';

@Component({
    selector: 'page-signin',
    templateUrl: 'signin.html'
})
export class SigninPage implements OnInit {

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
     * @param {AccessServiceProvider} _accessService
     */
    constructor(public _zone: NgZone,
        public _formBuilder: FormBuilder,
        public _navCtrl: NavController,
        public _alertCtrl: AlertController,
        public _loadingCtrl: LoadingController,
        public _platform: Platform,
        private _network: Network,
        private _device: Device,
        private _accessService: AccessServiceProvider) {
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
        /*if (_currentUser) {
            this._navCtrl.setRoot(ContractorTabsPage);
        }*/
        this._signinForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.minLength(6)]),
            password: new FormControl('', [Validators.required, Validators.minLength(4)])
        });

        this._error = '';
    }

    login() {
        let _userData: UserData = { username: this.transformToLower(this._signinForm.value.email), password: this._signinForm.value.password, platform: 'WEBApp' };
        let _trapSend: User = {
            from: 'signin',
            data: _userData,
            at: new Date().toISOString(),
            token: '',
            track: 0
        }
        let _trapSendCode = { code: btoa(JSON.stringify(_trapSend)) };
        this._accessService.login(_trapSendCode).subscribe((result) => {
            if (result.status == -1) {
                let title = '¡Oops! Tu cuenta esta bloqueada';
                let subtitle = 'Debes estar al día en tus pagos para poder volver a ingresar en el Ormiggero';
                let btn = 'Aceptar';
                this.presentAlert(title, subtitle, btn);
            } else if (result.status == -2) {
                let title = '¡Oops! Algo salió mal';
                let subtitle = 'El usuario o la contraseña no es válida, intenta nuevamente...';
                let btn = 'Aceptar';
                this.presentAlert(title, subtitle, btn);
            } else if (result.status == -3) {
                let title = 'Aishh…';
                let subtitle = 'Vemos que no puedes entrar porque tu cuenta está en estos momentos suspendida. Si tienes dudas, comunícate a hola@ormigga.com';
                let btn = 'Aceptar';
                this.presentAlert(title, subtitle, btn);
            } else if (result.status == 0) {
                let title = '¡Oops! Aún no has activado tu cuenta';
                let subtitle = 'Ingresa a tu correo para hacerlo, o solicita nuevamente el correo de activación';
                let btn = 'Aceptar';
                this.presentAlert(title, subtitle, btn);
            } else if (result.status == 1) {
                this._accessService.setCurrentUser(result);
                this._navCtrl.setRoot(ContractorTabsPage);
            }
        }, (err) => {
            let title = '¡Oops! Se esta presentando un problema';
            let subtitle = 'Por favor contacta con el administrador';
            let btn = 'Aceptar';
            this.presentAlert(title, subtitle, btn);
        });
    }

    /**
     * This function transform to lowercase a string
     */
    transformToLower(_word: string): string {
        return _word.toLowerCase();
    }

    sendEmailPrompt() {

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