import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { LongPressModule } from 'ionic-long-press';

import { MyApp } from './app.component';
import { PAGES_DECLARATIONS } from './index';
import { AccessServiceProvider } from '../providers/access-service';
import { QuotationServiceProvider } from '../providers/quotation-service';

import { Device } from '@ionic-native/device';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@NgModule({
  declarations: [
    MyApp,
    ...PAGES_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        android: {
          tabsPlacement: 'bottom',
          tabsHideOnSubPages: true
        },
        ios: {
          tabsPlacement: 'bottom',
          tabsHideOnSubPages: true,
          backButtonText: ''
        }
      }
    }),
    HttpClientModule,
    DragulaModule,
    LongPressModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ...PAGES_DECLARATIONS
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AccessServiceProvider,
    QuotationServiceProvider,
    Media,
    File,
    FileTransfer,
    FileTransferObject,
    Camera,
    AndroidPermissions
  ]
})
export class AppModule { }
