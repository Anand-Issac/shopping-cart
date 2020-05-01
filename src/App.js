import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AddToCart from './components/AddToCart';
import Cart from './components/Cart'
import Navbar from './components/Navbar';

//import {readItemsData} from './server';
import {writeItemData} from './server';

import firebase from 'firebase';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.itemsFirebaseRef = firebase.database().ref("items");

    this.state = {
      ids : [
  
      ],
    };
    
    this.updateCartInfo = this.updateCartInfo.bind(this);
    this.increaseItemQuantity = this.increaseItemQuantity.bind(this);
    this.decreaseItemQuantity = this.decreaseItemQuantity.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  
  }

  // good place to initialize state with requests to databases, etc..
  componentDidMount(){
    let App = this;
    
    this.itemsFirebaseRef.on("value", function(snapshot) {
        var itemsList = [];
        console.log(snapshot.val());
        snapshot.forEach(function(childSnapshot){
            console.log(childSnapshot.val());
            itemsList.push(childSnapshot.val());
        });
        console.log("itemsList is " + itemsList.join(", "));
        App.setState((state) => ({
          ids: itemsList
        }));
       
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
  }

  componentDidUpdate(prevProps, prevState ){
    if (prevState !== this.state){
      writeItemData((this.state.ids));
      console.log("updating?");
    }
  }
  updateCartInfo(info){
    const idList = [...this.state.ids];
    // first we must check if the id list is empty; if so we can initialize it
    // if not empty, loop through array and check if info.id is unique
      // if unique: push it to the array
      // else: increase the object with that id and increase it's quantity
    console.log("starts");
    if (idList.length == 0 ){
      //this.state.ids.push({id: info.id, name: info.name, price: info.price, quantity:1});
      
      idList.push({id: info.id, name: info.name, price: info.price, quantity:1});
      this.setState((state) => ({
        ids: idList
      }));

    } else{
      let uniqueIndex = this.uniqueIDCheck(info);
      if (uniqueIndex < 0){
        //id was unique
        idList.push({id: info.id, name: info.name, price: info.price, quantity:1});
        this.setState((state) => ({
          ids: idList
        }));
      }else{
        idList[uniqueIndex].quantity = this.state.ids[uniqueIndex].quantity + 1;

        this.setState((state) => ({
          ids: idList
        }));

      }
    }
    
  }
  //helper function that checks if id is unique (return -1 if unique; return index if not)
  uniqueIDCheck(info){
    const idList = this.state.ids;
    for (let i = 0; i < idList.length; i++){
      if (idList[i].id == info.id){
        return i;
      }
    }
    return -1;
   
  }

  // increases quantity of item where add button was pressed
  increaseItemQuantity(itemId){
    
    const idList = this.state.ids;
    
    for (let i = 0; i < idList.length; i++){
        if (idList[i].id == itemId){
            const currentQuantity = idList[i].quantity;
            idList[i].quantity = currentQuantity + 1;
            this.setState((state) => ({
                ids: idList
            })); 
        }
    }
  }

  decreaseItemQuantity(itemId){
    const idList = this.state.ids;
    const newList = [];

    for (let i = 0; i < idList.length; i++){
        //target item that had decrease button pressed
        if (idList[i].id == itemId){
            const currentQuantity = idList[i].quantity;
            // if quantity is greater than 0, decrease by 1
            if (currentQuantity > 1){
              idList[i].quantity = currentQuantity - 1;
              newList.push(idList[i]);
            // if quantity is 0, then do not push into new list
            } else{
              continue;
            }
  
        }else{
          newList.push(idList[i]);
        }
    }
    this.setState((state) => ({
      ids: newList
    })); 

  }

  deleteItem(itemId){
    const idList = this.state.ids;
    const newList = [];

    for (let i = 0; i < idList.length; i++){
        //target item that had decrease button pressed
        if (idList[i].id == itemId){
            continue;
        }else{
          newList.push(idList[i]);
        }
    }
    this.setState((state) => ({
      ids: newList
    })); 
  }



  render() { 
      return (  
        
          <Router>
              <div>
                  <Navbar/>
                  <Route path="/" exact strict render={(props) => <Cart {...props} ids={this.state.ids} addButtonChange={this.increaseItemQuantity}  removeButtonChange={this.decreaseItemQuantity}   deleteButtonChange={this.deleteItem}      />}   />

                  <Route path="/addToCart" exact strict render={(props) => <AddToCart {...props} updateCart={this.updateCartInfo}/>}/>

        
          

              </div>
          </Router>
       
      );
  }
}
