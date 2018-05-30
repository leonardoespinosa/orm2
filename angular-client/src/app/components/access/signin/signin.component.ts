import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from '../../../general/utils/utils';
import { AccessService } from '../../../services/access/access.service';
import { User, UserData, CurrentUser } from '../../../models/access/access.model';

@Component({
    selector: 'signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit, OnDestroy {

    _signinForm: FormGroup;

    /**
     * SigninComponent Constructor
     * @param {AccessService} _accessService 
     */
    constructor(private _accessService: AccessService,
        private _router: Router) {
    }

    /**
     * ngOnInit Implementation
     */
    ngOnInit() {
        let _currentUser: CurrentUser = this._accessService.getCurrentUser();
        if (_currentUser) {
            this._router.navigate(['portal/view-proposals']);
        }
        this._signinForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.minLength(6), CustomValidators.emailValidator]),
            password: new FormControl('', [Validators.required, Validators.minLength(4)])
        });
    }

    /**
     * Function to login user
     */
    login(): void {
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
                // socket.openMsgNotifyParams(['¡Oops!', 'Tu cuenta esta bloqueada'], ['Debes estar al día en tus pagos para poder volver a ingresar en el Ormiggero'], 'ModalInstanceSigninCtrl')
            } else if (result.status == -2) {
                //socket.openMsgNotifyParams(['¡Oops!', 'Algo salió mal'], ['El usuario o la contraseña no es válida, intenta nuevamente...'], 'ModalInstanceSigninCtrl')
            } else if (result.status == -3) {
                //socket.openMsgNotifyParams(['Aishh…'], ['Vemos que no puedes entrar porque tu cuenta está en estos momentos suspendida. Si tienes dudas, comunícate a hola@ormigga.com'], 'ModalInstanceSigninCtrl')
            } else if (result.status == 0) {
                //socket.openMsgNotifyParams(['¡Oops!', 'Aún no has activado tu cuenta'], ['Ingresa a tu correo para hacerlo, o solicita nuevamente el correo de activación en el siguiente enlace o link:'], 'ModalInstanceSigninCtrl', { sendActivationMail: true })
                if (result.tokenActivate) {
                    //$rootScope.userAct = dataRSP.user
                    //$rootScope.tokenActivate = dataRSP.tokenActivate
                } else {
                    //socket.openMsgNotifyParams(['¡Oops! Tu cuenta no esta activada.'], ['Por favor, comunicate con soporte y solicita tu activación'], 'ModalInstanceSigninCtrl')
                }
            } else if (result.status == 1) {
                this._accessService.setCurrentUser(result);
                //this._router.navigateByUrl('/profile');
                if (result.data.usr.level != 0) {
                    //$rootScope.changeIAM(dataRSP.data.usr.level, true)
                } else if (result.data.usr.level != 99 && result.data.usr.level != 80) {
                    //$state.go('public.profileData', {}, { reload: true, location: true });
                } else {
                    //$state.go('access.signin', {}, { reload: true, location: true });
                }
                this._router.navigate(['portal/view-proposals']);
            }
        }, (err) => {
            console.error(err);
        });
    }

    /**
     * This function transform to lowercase a string
     */
    transformToLower(_word: string): string {
        return _word.toLowerCase();
    }

    /**
     * ngOnDestroy Implementation
     */
    ngOnDestroy() {

    }
}