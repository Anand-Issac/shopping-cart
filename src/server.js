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

export function writeItemData(info){
    var ref = firebase.database().ref("items");
    var onComplete = function(error) {
        if (error) {
            console.log('Write to Firebase failed');
        } else {
            console.log('Write to Firebase completed');
        }
    };

    ref.child(info.id).set({
        id: info.id,
        name: info.name,
        price: info.price,
        quantity: info.quantity
    }, onComplete);

    // ref.push({
        
    //         Id: info.id,
    //         Name: info.name,
    //         Price: info.price,
    //         Quantity: info.quantity
        
    // }, onComplete);

    console.log("firebase clicked" );
}

// export function readItemsData(){
//     var ref = firebase.database().ref("items");
//     var itemsList = [];
//     ref.on("value", function(snapshot) {
//         console.log(snapshot.val());
//         snapshot.forEach(function(childSnapshot){
//             console.log(childSnapshot.val());
//             itemsList.push(childSnapshot.val());
//         });
//         console.log("itemsList is " + itemsList.join(", "));
       
//     }, function (errorObject) {
//         console.log("The read failed: " + errorObject.code);
//     });

//     return itemsList;
// }
