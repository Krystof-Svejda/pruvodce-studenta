import {NgxLoggerLevel} from 'ngx-logger';


export const environment = {
  production: false,
  logLevel: NgxLoggerLevel.TRACE,
  firebaseConfig : {
    apiKey: 'AIzaSyC7xzse1kSPc4vjbDPpKkbL3aapURkl8DY',
    authDomain: 'pruvodce-studenta.firebaseapp.com',
    databaseURL: 'https://pruvodce-studenta.firebaseio.com',
    projectId: 'pruvodce-studenta',
    storageBucket: 'pruvodce-studenta.appspot.com',
    messagingSenderId: '109507833397',
    appId: '1:109507833397:web:676395e65cc22643d10b7c',
    measurementId: 'G-EXLT0ZVMVL'
  }
};
