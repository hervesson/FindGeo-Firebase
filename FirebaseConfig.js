import * as firebase from "firebase";

var config = {
    apiKey: "AIzaSyB-XYzhF6o2G2rM1qoGKWbt6TnDuLadrb4",
    authDomain: "services-club-9c5cf.firebaseapp.com",
    databaseURL: "https://services-club-9c5cf.firebaseio.com",
    projectId: "services-club-9c5cf",
    storageBucket: "services-club-9c5cf.appspot.com",
    messagingSenderId: "1019520644586",
    appId: "1:1019520644586:web:8df9e234983557c9216e93",
    measurementId: "G-7HPR9GY3NJ"
};


   export const firebaseApp = firebase.initializeApp(config);

   