import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs';
import { QuotationServiceProvider } from '../../../../../providers/quotation-service';
import { AccessServiceProvider } from '../../../../../providers/access-service';

@Component({
    selector: 'page-proposal-detail',
    templateUrl: 'proposal-detail.html'
})
export class ProposalDetailPage implements OnInit {

    private _proposal: any = {};
    private _proposalDetail: any = {};
    private disconnectSubscription: Subscription;

    /**
     * ProposalDetailPage Constructor
     * @param {NavController} _navCtrl 
     * @param {NavParams} _navParams 
     * @param {AlertController} _alertCtrl 
     * @param {Platform} _platform 
     * @param {Network} _network 
     * @param {NgZone} _ngZone 
     * @param {LoadingController} _loadingCtrl 
     * @param {AccessServiceProvider} _accessService 
     * @param {QuotationServiceProvider} _quotationService 
     */
    constructor(public _navCtrl: NavController,
        public _navParams: NavParams,
        public _alertCtrl: AlertController,
        public _platform: Platform,
        private _network: Network,
        private _ngZone: NgZone,
        public _loadingCtrl: LoadingController,
        private _accessService: AccessServiceProvider,
        private _quotationService: QuotationServiceProvider) {
        this._proposal = this._navParams.get("proposal");
    }

    /**
     * ionViewWillLeave Implementation
     */
    ionViewWillLeave() {
        this.disconnectSubscription.unsubscribe();
    }

    /**
     * ionViewWillEnter Implementation
     */
    ionViewWillEnter() {
        let loading_msg = 'Cargando...';
        let loading = this._loadingCtrl.create({ content: loading_msg });
        loading.present();

        this._quotationService.viewRequestProposalDetail(this._proposal.tokenPropuesta).subscribe((result) => {
            this._ngZone.run(() => {
                try {
                    let _dataRSP: any = JSON.parse(atob(result.toString('utf8')));
                    if (_dataRSP.status === 200) {
                        this._proposalDetail = _dataRSP.data;
                    }
                    loading.dismiss();
                } catch (e) {
                    loading.dismiss();
                    let title = 'Error!';
                    let subtitle = 'En este momento se presenta un problema al mostrar el detalle de la propuesta. por favor intenta de nuevo.'
                    let btn = 'Aceptar'
                    this.presentAlert(title, subtitle, btn);
                }
            });
        }, (err) => {
            loading.dismiss();
            let title = 'Error!';
            let subtitle = 'En este momento no es posible mostrar el detalle de la propuesta. por favor intenta de nuevo.'
            let btn = 'Aceptar'
            this.presentAlert(title, subtitle, btn);
        });
    }

    /**
     * ngOnInit Implementation
     */
    ngOnInit() {

    }

    /**
     * Function to return
     */
    backToProposal(): void {
        this._navCtrl.pop();
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