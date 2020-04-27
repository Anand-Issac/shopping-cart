import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AddToCart from './components/AddToCart';
import Counter from './components/Counter'
import Navbar from './components/Navbar';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ids : [
  
      ],
    };

    this.updateCartInfo = this.updateCartInfo.bind(this);
  
  }

  updateCartInfo(info){
    const ids = this.state.ids;
    // first we must check if the id list is empty; if so we can initialize it
    // if not empty, loop through array and check if info.id is unique
      // if unique: push it to the array
      // else: increase the object with that id and increase it's quantity

    if (ids.length == 0 ){
      this.state.ids.push({id: info.id, name: info.name, price: info.price, quantity:1});
    } else{
      let uniqueIndex = this.uniqueIDCheck(info);
      if (uniqueIndex < 0){
        //id was unique
        this.state.ids.push({id: info.id, name: info.name, price: info.price, quantity:1});
      }else{
        this.state.ids[uniqueIndex].quantity = this.state.ids[uniqueIndex].quantity + 1;
      }
    }
    
  }
  
  uniqueIDCheck(info){
    const idList = this.state.ids;
    for (let i = 0; i < idList.length; i++){
      if (idList[i].id == info.id){
        return i;
      }
    }
    return -1;
   
  }

  render() { 
      return (  
        
          <Router>
              <div>
                  <Navbar/>
                  <Route path="/" exact strict render={(props) => <Counter {...props} ids={this.state.ids}/>}   />

                  <Route path="/addToCart" exact strict render={(props) => <AddToCart {...props} updateCart={this.updateCartInfo}/>}/>

        
          

              </div>
          </Router>
       
      );
  }
}
