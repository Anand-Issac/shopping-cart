import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import AddToCart from './components/AddToCart';
import Cart from './components/Cart'
import Navbar from './components/Navbar';
import Button from '@material-ui/core/Button';
import Login from './components/Login/Login';

import {writeItemData} from './server';
import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";




export default class App extends Component {
  constructor(props) {
    super(props);
    
  
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
          const userRef = firebase.database().ref("users/"+user.uid);
          console.log("user logged in: " + user.uid);
          this.setState({user});

          //reads snapshot inside users collection
          userRef.on("value", function(snapshot){
              console.log(snapshot.val());
              // if user is not in users collection (null), then initialize it 
              if (snapshot.val() === null){
                console.log("user id "+ user.uid+" is not found in db");
                var onComplete = function(error) {
                  if (error) {
                      console.log('Write to Firebase failed');
                  } else {
                      console.log('Write to Firebase completed');
                  }
                };
                
                //sets the user to the users collection and sets its value to be items object 
                // which is initialized to store "None"
                userRef.set({items:"None"}, onComplete);
                
              
              }else{
                  console.log("uid is not null: " + user.uid);
                  //if user in user ids collection, but items collection is null, initialize it
                  if (snapshot.child("items").val() === "None"){
                      console.log("empty items list for user");
                      App.setState((state) => ({
                        ids: []
                      }));
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

  geoLocateStuff(){
    if('geolocation' in navigator) {
      /* geolocation is available */
      console.log("geo is available");
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.latitude, position.coords.longitude);
      });
    } else {
      /* geolocation IS NOT available */
      console.log("geo is not available");
    }
  }

  

  
  

  // good place to initialize state with requests to databases, etc..
  //this will process before first render
  componentDidMount(){
    this.authListener();
    this.geoLocateStuff();
    
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
    
    if (idList.length === 0 ){
      
      idList.push({id: info.id, name: info.name, price: info.price, shippingCost: info.shippingCost, url: info.url, quantity:1});
      this.setState((state) => ({
        ids: idList
      }));

    } else{
      let uniqueIndex = this.uniqueIDCheck(info);
      if (uniqueIndex < 0){
        //id was unique
        idList.push({id: info.id, name: info.name, price: info.price, shippingCost: info.shippingCost, url: info.url, quantity:1});
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
    const wordStyle = {
      fontWeight: "bold",
      fontFamily: ['Montserrat', "sans-serif"],
      textAlign:"center", 
      marginTop:"20px",
      color:"#FF4B2B"
    }; 
    
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
          
          
          <div > 
            <h1 style={{textAlign:"center", marginTop:"30px", marginBottom:"30px"}}>Welcome to cheap<span style={wordStyle}>Cart</span>! </h1>
           
            
            
            <Login/>
         

            <p style={{textAlign:"center",fontSize:"20px",fontWeight:"150", marginBottom:"5px", marginTop:"60px"}}>Have you ever spent hours on Ebay scrolling to find what you want? 
            </p>
            <p style={{textAlign:"center",fontSize:"20px", fontWeight:"250"}}>Well no more because 
              cheapCart will do the work for you!
            </p>
            
          </div>
          
          
          )}
        
        
        
          
        </div>
      );
  }
}
