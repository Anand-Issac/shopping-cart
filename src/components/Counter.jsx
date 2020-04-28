import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import update from 'react-addons-update'; 

import { BrowserRouter as Router, Link, NavLink, Redirect, Prompt} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import ItemContainer from './ItemContainer';


class Item extends Component {
    constructor(props) {
        super(props);
        
        this.increaseItemQuantity = this.increaseItemQuantity.bind(this);
      
      }

    increaseItemQuantity(itemId){
        this.props.addButtonChange(itemId);
    }

    render() { 
        return ( 
           <ItemContainer value={this.props.item}  addButtonChange={this.increaseItemQuantity}  />
          
         );
    }
}

class Cart extends Component {

    constructor(props) {
        super(props);
        const idList = this.props.ids;
        this.state = {
            ids: idList
        }

        this.increaseItemQuantity = this.increaseItemQuantity.bind(this);
      
      }

    // componentWillReceiveProps({ids}) {
    //     this.setState({...this.state,ids})
    // }
    
    totalItemsinCart(){
    
        let totalItems = 0;
        console.log(this.state.ids);
        this.state.ids.map((item, key) => 
            totalItems += item.quantity
        )
        return totalItems;
    }

    totalPriceofCart(){
        let totalPrice = 0;
        this.state.ids.map((item, key) =>
            {
                if (item.quantity == 1){
                    totalPrice += Number(item.price)
                }else{
                    totalPrice += ((item.quantity * item.price))
                }
            }
             
            
        )
        return totalPrice;
    }

    increaseItemQuantity(itemId){
        //if add button pressed, increase quantity of itemId by 1
       
        const idList = this.state.ids.slice();
    
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
    
    render() { 
        var style = {
            margin: "10px"
        };
        return (  
            <div>
                <h1 style={style}>{this.totalItemsinCart()} Items in Cart</h1>
                <h3 style={style}>Price of Cart: ${this.totalPriceofCart()} </h3>
                {this.state.ids.map((item, key) =>
                <Item item={item} key={item.id} addButtonChange={this.increaseItemQuantity}/>
                )}

            </div>
            

        );
    }
}
 
export default class Counter extends Component {
    

    render() { 
        return (  
            <div>
                
                <Cart ids={this.props.ids}/>
            </div>
        );
    }
}

