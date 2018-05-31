import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
    selector: 'page-step-one',
    templateUrl: 'step-one.html'
})
export class StepOnePage {

    private recording: boolean = false;
    private filePath: string;
    private fileName: string;
    private audio: MediaObject;
    private audioList: any[] = [];

    constructor(public _navCtrl: NavController,
        private media: Media,
        private file: File,
        public platform: Platform) {

    }

    ionViewWillEnter() {
        this.getAudioList();
    }

    cancel(): void {
        this._navCtrl.pop();
    }

    getAudioList() {
        if (localStorage.getItem("audiolist")) {
            this.audioList = JSON.parse(localStorage.getItem("audiolist"));
            console.log(this.audioList);
        }
    }

    startRecord() {
        if (this.platform.is('ios')) {
            this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.m4a';
            //this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
            this.filePath = 'file:///data/user/0/com.ormigga/files/' + this.fileName;
            this.audio = this.media.create(this.filePath);
        } else if (this.platform.is('android')) {
            this.fileName = 'record' + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.3gp';
            //this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
            this.filePath = 'file:///storage/emulated/0/Android/data/com.ormigga/files/' + this.fileName;
            this.audio = this.media.create(this.filePath);
        }
        this.audio.startRecord();
        this.recording = true;
    }

    stopRecord() {
        this.audio.stopRecord();
        let data = { filename: this.fileName };
        this.audioList.push(data);
        localStorage.setItem("audiolist", JSON.stringify(this.audioList));
        this.recording = false;
        this.getAudioList();
    }

    playAudio(file, idx) {
        if (this.platform.is('ios')) {
            //this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
            this.filePath = 'file:///data/user/0/com.ormigga/files/' + file;
            this.audio = this.media.create(this.filePath);
        } else if (this.platform.is('android')) {
            this.filePath = 'file:///storage/emulated/0/Android/data/com.ormigga/files/' + file;
            this.audio = this.media.create(this.filePath);
        }
        this.audio.play();
        //this.audio.setVolume(0.8);
    }
}
