import App from './App';

var firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');

export const firebaseConfig = {
    apiKey: "AIzaSyAYAC2C96gTJg0yTQJ7u1lJiq-gm87Em0o",
    authDomain: "shopping-cart-b4473.firebaseapp.com",
    databaseURL: "https://shopping-cart-b4473.firebaseio.com",
    projectId: "shopping-cart-b4473",
    storageBucket: "shopping-cart-b4473.appspot.com",
    messagingSenderId: "986575100469",
    appId: "1:986575100469:web:46a6fc4a16c02044e86f7c",
    measurementId: "G-X04NFFCYLT"
};

firebase.initializeApp(firebaseConfig);

export function writeItemData(ids, removedIds){
    var ref = firebase.database().ref("items");
    //callback function which logs if write to firebase failed / completed
    var onComplete = function(error) {
        if (error) {
            console.log('Write to Firebase failed');
        } else {
            console.log('Write to Firebase completed');
        }
    };
    //loops through every id in the id list and sets the child to the properties of info object
    for (var i=0; i < ids.length; i++ ){
        var info = ids[i];
        ref.child(info.id).set({
            id: info.id,
            name: info.name,
            price: info.price,
            quantity: info.quantity
        }, onComplete);
    }
    //loops through every id that was removed and removes that id child from firebase collection
    for (var i=0; i < removedIds.length; i++ ){
        var info = removedIds[i];
        ref.child(info.id).remove(onComplete);
    }
}

