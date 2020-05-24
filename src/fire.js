
var firebase = require("firebase/app");
require('firebase/auth');
require('firebase/database');
require('dotenv').config();

console.log(process.env);
export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    
    authDomain: "shopping-cart-b4473.firebaseapp.com",
    databaseURL: "https://shopping-cart-b4473.firebaseio.com",
    projectId: "shopping-cart-b4473",
    storageBucket: "shopping-cart-b4473.appspot.com",
    messagingSenderId: "986575100469",
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
  
    measurementId: "G-X04NFFCYLT"
};

const fire = firebase.initializeApp(firebaseConfig);
export default fire;

export function writeItemData(ids, removedIds,userId){
    var ref = firebase.database().ref("users/"+userId+"/items");
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
        console.log(info);
        ref.child(info.id).set({
            id: info.id,
            name: info.name,
            price: info.price,
            shippingCost: info.shippingCost,
            url: info.url,
            quantity: info.quantity
        }, onComplete);
    }
    //loops through every id that was removed and removes that id child from firebase collection
    for (var j=0; j < removedIds.length; j++ ){
        var info2 = removedIds[j];
        ref.child(info2.id).remove(onComplete);
    }
}
