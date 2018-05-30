import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CurrentUser } from '../../../models/access/access.model';
import { AccessService } from '../../../services/access/access.service';
import { Observable, BehaviorSubject } from 'rxjs';
declare const navigator: any;
declare const MediaRecorder: any;

@Component({
    selector: 'supplier-contracts',
    templateUrl: './supplier-contracts.component.html',
    styleUrls: ['./supplier-contracts.component.scss']
})
export class SupplierContractsComponent implements OnInit, OnDestroy {

    private _currentUser: CurrentUser;
    private _contractForm: FormGroup;

    private _mediaRecorder: any;
    private _chunks: any = [];
    private _audioSolicitud: Array<string> = [];
    private _messageRec: string = null;
    private _errorRecord: boolean = false;
    private _initRecord: boolean = false;

    //private _arrayItems: Array<any> = [];
    private _dataItem: any = { description: '', quantity: 0, createBy: 'Contratante' };
    private _arrayItems: Observable<{ description: string; quantity: number; createBy: string }[]>;
    private _itemsSource: BehaviorSubject<{ description: string; quantity: number; createBy: string }[]>;

    /**
     * SupplierContractsComponent Constructor
     * @param {AccessService} _accessService 
     */
    constructor(private _accessService: AccessService) {
        this._currentUser = this._accessService.getCurrentUser();
        const onSuccess = stream => {
            this._mediaRecorder = new MediaRecorder(stream);
            this._mediaRecorder.onstop = e => {
                //const audio = new Audio();
                const blob = new Blob(this._chunks, { 'type': 'audio/ogg; codecs=opus' });
                this._chunks.length = 0;
                this._audioSolicitud.push(window.URL.createObjectURL(blob));
                console.log(this._audioSolicitud);
                //audio.src = window.URL.createObjectURL(blob);
                //audio.load();
                //audio.play();
            };
            this._mediaRecorder.ondataavailable = e => this._chunks.push(e.data);
        };

        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getUserMedia({ audio: true }, onSuccess, e => { console.log(e); this._errorRecord = true });
    }

    /**
     * ngOnInit implementation
     */
    ngOnInit() {
        this._itemsSource = new BehaviorSubject<any>([{ description: '', quantity: 0, createBy: '' }]);
        this._arrayItems = this._itemsSource.asObservable();
        this._contractForm = new FormGroup({
            nameRequest: new FormControl('', [Validators.required, Validators.minLength(6)]),
            descripcion: new FormControl('')
        });
    }

    /**
     * Function to start audio record
     */
    createAudio(): void {
        this._messageRec = "Iniciando...";
        this._messageRec = "Grabando...";
        this._initRecord = true;
        this._mediaRecorder.start();
    }

    /**
     * Function to finish audio record
     */
    stopUserMedia(): void {
        this._mediaRecorder.stop();
        this._initRecord = false;
        this._messageRec = null;
    }

    /**
     * Function to remove audio from array
     * @param {number} _audioIndex 
     */
    deleteUserMedia(_audioIndex: number): void {
        this._audioSolicitud.splice(_audioIndex, 1);
    }

    /**
     * Function to add item in list
     */
    addItemList(): void {
        const currentItems = this._itemsSource.getValue();
        currentItems.push({ description: 'pruebas', quantity: 10, createBy: 'Contratante' });
        this._itemsSource.next(currentItems);
        /*if (this._dataItem.quantity > 0 && this._dataItem.description != "") {
            this._arrayItems.push(this._dataItem);
            this._dataItem = { description: '', quantity: 0, createBy: 'Contratante' }
        }*/
    }

    /**
     * Function to remove item in list
     * @param {number} _itemIndex 
     */
    removeItem(_itemIndex: number): void {
        //this._arrayItems.splice(_itemIndex, 1);
    }

    /**
     * ngOnDestroy implementation
     */
    ngOnDestroy() {

    }
}