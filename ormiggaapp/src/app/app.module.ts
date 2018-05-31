import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { PAGES_DECLARATIONS } from './index';
import { AccessServiceProvider } from '../providers/access-service';

import { Device } from '@ionic-native/device';

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
          tabsPlacement: 'top',
          tabsHideOnSubPages: true
        },
        ios: {
          tabsPlacement: 'bottom',
          tabsHideOnSubPages: true,
          backButtonText: ''
        }
      }
    }),
    HttpClientModule
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
    AccessServiceProvider
  ]
})
export class AppModule { }
