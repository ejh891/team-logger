
import * as firebase from 'firebase';

const config = {
    apiKey: 'AIzaSyCbMFS8zte5mcwYve6_E_gXlqR4RDDkCNg',
    authDomain: 'team-logger.firebaseapp.com',
    databaseURL: 'https://team-logger.firebaseio.com/',
    projectId: 'team-logger',
    storageBucket: 'team-logger.appspot.com',
    messagingSenderId: '744631855671'
};

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
export const firebaseFacebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export const firebaseDatabase = firebase.database;
