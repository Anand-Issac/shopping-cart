import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import { BrowserRouter as Router, Link, NavLink, Redirect, Prompt} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import MiddleDividers from './MiddleDividers';



class Item extends Component {
      
    render() { 
        return ( 
           <MiddleDividers value={this.props.item}/>
          
         );
    }
}

class Cart extends Component {

    totalItemsinCart(){
        let totalItems = 0;
        this.props.ids.map((item, key) => 
            totalItems += item.quantity
        )
        return totalItems;
    }

    totalPriceofCart(){
        let totalPrice = 0;
        this.props.ids.map((item, key) =>
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
    
    render() { 
        var style = {
            margin: "10px"
        };
        return (  
            <div>
                <h1 style={style}>{this.totalItemsinCart()} Items in Cart</h1>
                <h3 style={style}>Price of Cart: ${this.totalPriceofCart()} </h3>
                {this.props.ids.map((item, key) =>
                <Item item={item} key={item.id} />
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

