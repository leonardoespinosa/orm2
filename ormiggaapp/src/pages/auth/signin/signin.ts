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
        if (_currentUser) {
            let loading_msg = 'Un momento por favor...';
            let loading = this._loadingCtrl.create({ content: loading_msg });
            loading.present();
            setTimeout(() => {
                this._navCtrl.setRoot(ContractorTabsPage);
                loading.dismiss();
            }, 1000);
        }
        this._signinForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.minLength(6)]),
            password: new FormControl('', [Validators.required, Validators.minLength(4)])
        });
    }

    /**
     * Function to login user
     */
    login() {
        let loading_msg = 'Un momento por favor...';
        let loading = this._loadingCtrl.create({ content: loading_msg });
        loading.present();
        setTimeout(() => {
            let _userData: UserData = { username: this.transformToLower(this._signinForm.value.email), password: this._signinForm.value.password, platform: 'App' };
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
                    this.showMessage('¡Oops! Tu cuenta esta bloqueada',
                        'Debes estar al día en tus pagos para poder volver a ingresar en el Ormiggero',
                        'Aceptar');
                } else if (result.status == -2) {
                    this.showMessage('¡Oops! Algo salió mal',
                        'El usuario o la contraseña no es válida, intenta nuevamente...',
                        'Aceptar');
                } else if (result.status == -3) {
                    this.showMessage('Aishh…',
                        'Vemos que no puedes entrar porque tu cuenta está en estos momentos suspendida. Si tienes dudas, comunícate a hola@ormigga.com',
                        'Aceptar');
                } else if (result.status == -4) {
                    this.showMessage('¡Oops! Se esta presentando un problema',
                        'Por favor contacta con el administrador',
                        'Aceptar');
                } else if (result.status == 0) {
                    this.showMessage('¡Oops! Aún no has activado tu cuenta',
                        'Ingresa a tu correo para hacerlo, o solicita nuevamente el correo de activación',
                        'Aceptar');
                } else if (result.status == 1) {
                    this._accessService.setCurrentUser(result);
                    this._navCtrl.setRoot(ContractorTabsPage);
                }
            }, (err) => {
                this.showMessage('¡Oops! Se esta presentando un problema',
                    'Por favor contacta con el administrador',
                    'Aceptar');
            });
            loading.dismiss();
        }, 1500);
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
     * Function to show message
     * @param {string} _title 
     * @param {string} _subtitle 
     * @param {string} _btn 
     */
    showMessage(_title: string, _subtitle: string, _btn: string): void {
        let title = _title;
        let subtitle = _subtitle;
        let btn = _btn;
        this.presentAlert(title, subtitle, btn);
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
                let title = 'Error de red!';
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