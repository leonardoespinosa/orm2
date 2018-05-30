import { Component } from '@angular/core'
import { AlertController, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';

import { SigninComponent } from '../pages/auth/signin/signin';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  private rootPage: any = null;

  /**
   * MyApp Construtctor
   * @param {Platform} platform
   * @param {StatusBar} statusBar 
   * @param {SplashScreen} splashScreen 
   * @param {Device} _device 
   * @param {Network} _network 
   */
  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private _device: Device,
    private _network: Network, ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // TODO: Validar rol del usuario para redirigirlo a una pagina u otra
      this.rootPage = SigninComponent;
    });
  }
}
