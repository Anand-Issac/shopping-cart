import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AddToCart from './components/AddToCart';
import Cart from './components/Cart'
import Navbar from './components/Navbar';
import Button from '@material-ui/core/Button';

import {writeItemData} from './server';
import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.itemsFirebaseRef = firebase.database().ref("items");
    this.usersRef = firebase.database().ref("users");
    this.uiConfig = {
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccess: ()=> false
      }

    }
   

    this.state = {
      ids : [
  
      ],
      removedIds:[

      ],
      user: null
    };
    
    this.updateCartInfo = this.updateCartInfo.bind(this);
    this.increaseItemQuantity = this.increaseItemQuantity.bind(this);
    this.decreaseItemQuantity = this.decreaseItemQuantity.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.authListener = this.authListener.bind(this);
  
  }

  authListener(){
    let App = this;

    //handles authentication state changes
    firebase.auth().onAuthStateChanged((user)=> {
      //if user exists/authenticated
      if (user){
          console.log("user logged in: " + user.uid);
          this.setState({user});

          //reads snapshot inside users collection
          this.usersRef.on("value", function(snapshot){
              console.log(snapshot.val());
              // if user is not in users collection (null), then initialize it 
              if (snapshot.child(user.uid).val() === null){
                console.log("user id "+ user.uid+" is not found in db");
                var onComplete = function(error) {
                  if (error) {
                      console.log('Write to Firebase failed');
                  } else {
                      console.log('Write to Firebase completed');
                  }
                };
                
                firebase.database().ref("users").child(user.uid).set({items:"None"}, onComplete);
                //firebase.database().ref("users/"+user.uid+"/items").push();
              
              }else{
                  console.log("uid is not null: " + user.uid);
                  //if user in user ids collection, but items collection is null, initialize it
                  if (snapshot.child(user.uid+ "/items").val() === "None"){
                      console.log("empty items list for user");
                      //firebase.database().ref("users/"+user.uid+"/items").push();
                  //if item collection is not null, then read from it and set state
                  }else{
                      
                    
                      firebase.database().ref("users/"+user.uid+"/items").on("value", function(snapshot) {
                        var itemsList = [];
                        console.log(snapshot.val());
                        snapshot.forEach(function(childSnapshot){
                            console.log(childSnapshot.val());
                            itemsList.push(childSnapshot.val());
                        });
                        
                        App.setState((state) => ({
                          ids: itemsList
                        }));
                      })

                  }
              }
          });
      //else user is null
      }else{
        this.setState({user:null});
        console.log("user logged out");
      }
      
    });
  }

  // good place to initialize state with requests to databases, etc..
  //this will process before first render
  componentDidMount(){
    this.authListener();
  }

  //good place to handle updates to component state changes
  //process after first render 
  componentDidUpdate(prevProps, prevState ){
    if (prevState.ids !== this.state.ids){
      
      writeItemData(this.state.ids, this.state.removedIds, (this.state.user).uid);
      this.setState({
        removedIds: []
      });
    }
   
  }
  updateCartInfo(info){
    //ES6 way of copying a list (idList and this.state.ids dont share same memory addy)
    const idList = [...this.state.ids];
    

    // initialize idlist if empty
    // if not empty, loop through array and check if info.id is unique
      // if unique: push it to the array
      // else: increase the object with that id and increase it's quantity
    
    if (idList.length == 0 ){
      
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
      if (idList[i].id === info.id){
        return i;
      }
    }
    return -1;
   
  }

  // increases quantity of item where add button was pressed
  increaseItemQuantity(itemId){
    
    const idList = this.state.ids;
    
    for (let i = 0; i < idList.length; i++){
        if (idList[i].id === itemId){
            const currentQuantity = idList[i].quantity;
            idList[i].quantity = currentQuantity + 1;
            this.setState((state) => ({
                ids: idList
            })); 
        }
    }
  }

  //decreases quantity of item where remove button pressed
  decreaseItemQuantity(itemId){
    const idList = this.state.ids;
    const removedIdsList = [...this.state.removedIds];
    const newList = [];


    for (let i = 0; i < idList.length; i++){
        //target item that had decrease button pressed
        if (idList[i].id === itemId){
            const currentQuantity = idList[i].quantity;
            // if quantity is greater than 0, decrease by 1
            if (currentQuantity > 1){
              idList[i].quantity = currentQuantity - 1;
              newList.push(idList[i]);
            // if quantity is 0, then do not push into new list
            } else{
              removedIdsList.push(idList[i]);
            }
  
        }else{
          newList.push(idList[i]);
        }
    }
    this.setState((state) => ({
      ids: newList,
      removedIds: removedIdsList
    })); 

  }

  //deletes item from item where delete button pressed
  deleteItem(itemId){
    const idList = this.state.ids;
    const removedIdsList = [...this.state.removedIds];
    const newList = [];

    for (let i = 0; i < idList.length; i++){
        //target item that had decrease button pressed
        if (idList[i].id === itemId){
          removedIdsList.push(idList[i]);
        }else{
          newList.push(idList[i]);
        }
    }
    this.setState((state) => ({
      ids: newList,
      removedIds: removedIdsList
    })); 
  }



  render() { 
      return (  
        <div>
          {this.state.user ? (
            <Router>
              <div>
                  <Navbar/>
                  
                  <Button onClick={()=>{firebase.auth().signOut() }}> 
                  Sign Out {firebase.auth().currentUser.displayName}</Button>
                  
                  <Route path="/" exact strict render={(props) => <Cart {...props} ids={this.state.ids} addButtonChange={this.increaseItemQuantity}  removeButtonChange={this.decreaseItemQuantity}   deleteButtonChange={this.deleteItem}      />}   />

                  <Route path="/addToCart" exact strict render={(props) => <AddToCart {...props} updateCart={this.updateCartInfo}/>}/>

        
          

              </div>
            </Router>
          ): (
          
          
          <div class = "App-header"> 
            <h1>Welcome to my Shopping Cart App! </h1>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>

          </div>
          
          
          )}
        
        
        
          
        </div>
      );
  }
}
