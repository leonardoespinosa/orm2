import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
    selector: 'page-step-one',
    templateUrl: 'step-one.html'
})
export class StepOnePage {

    private _recording: boolean = false;
    private _filePath: string;
    private _fileName: string;
    private _audio: MediaObject;
    private _audioList: any[] = [];

    constructor(public _navCtrl: NavController,
        private _media: Media,
        private _file: File,
        public _platform: Platform) {

    }

    /**
     * Function to cancel quotation creation
     */
    cancel(): void {
        this._navCtrl.pop();
    }

    /**
     * Function to start audio record
     */
    startRecord(): void {
        if (this._platform.is('ios')) {
            this._fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.m4a';
            this._filePath = this._file.documentsDirectory.replace(/file:\/\//g, '') + this._fileName;
            this._audio = this._media.create(this._filePath);
        } else if (this._platform.is('android')) {
            this._fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
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
}
