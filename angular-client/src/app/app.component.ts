import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {
    var stopStyle = ['font-family: Roboto, "Helvetica Neue", sans-serif',
      'font-size: 1.7rem',
      'color: Red',
      'font-weight: 600'].join(';');
    console.log('%c Stop!!', stopStyle);
    var msgStyle = ['font-family: Roboto, "Helvetica Neue", sans-serif',
      'font-size: 1.4rem',
      'color: #114b5f',
      'font-weight: 500'].join(';');
    console.log('%c This is a browser feature intended for developers. If someone told you to copy-paste something here to enable a Ormigga feature or "hack" someone\'s account, it is a scam and will give them access to your Ormigga account. Legal Copy at Ormigga 2018 / Edit or change something with this options is considerated like an attack.', msgStyle);
  }
}
