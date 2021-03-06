import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'

import ItemContainer from './ItemContainer';


class Item extends Component {
    constructor(props) {
        super(props);
        
        this.increaseItemQuantity = this.increaseItemQuantity.bind(this);
        this.decreaseItemQuantity = this.decreaseItemQuantity.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
      }

    increaseItemQuantity(itemId){
        this.props.addButtonChange(itemId);
    }

    decreaseItemQuantity(itemId){
        console.log("decrease 1")
        this.props.removeButtonChange(itemId);
    }

    deleteItem(itemId){
        this.props.deleteButtonChange(itemId);
    }

    render() { 
        return ( 
           <ItemContainer value={this.props.item}  addButtonChange={this.increaseItemQuantity} removeButtonChange={this.decreaseItemQuantity} deleteButtonChange={this.deleteItem} />
          
         );
    }
}

export default class Cart extends Component {

    constructor(props) {
        super(props);
        
        this.increaseItemQuantity = this.increaseItemQuantity.bind(this);
        this.decreaseItemQuantity = this.decreaseItemQuantity.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
      }

    
    totalItemsinCart(){
    
        let totalItems = 0;
        console.log(this.props.ids);
        this.props.ids.map((item, key) => 
            totalItems += item.quantity
        )
        return totalItems;
    }

    totalPriceofCart(){
        let totalPrice = 0;
        this.props.ids.map((item, key) =>
            {
                if (item.quantity === 1){
                    totalPrice += (Number(item.price) + Number(item.shippingCost))
                }else{
                    totalPrice += ((item.quantity * item.price) + Number(item.shippingCost))
                }
            }
             
            
        )
        return totalPrice;
    }

    increaseItemQuantity(itemId){
        //if add button pressed, increase quantity of itemId by 1
        this.props.addButtonChange(itemId);      
    }

    decreaseItemQuantity(itemId){
        console.log("decrease Cart ")
        this.props.removeButtonChange(itemId);
    }

    deleteItem(itemId){
        this.props.deleteButtonChange(itemId);
    }
    
    render() { 
        var style = {
            margin: "10px"
        };
        return (  
            <div>
                <h2 style={style}>{this.totalItemsinCart()} Items in Cart</h2>
                <h3 style={style}>Price of Cart: ${Math.round((this.totalPriceofCart() + Number.EPSILON) * 100) / 100} </h3>
                {this.props.ids.map((item, key) =>
                <Item item={item} key={item.id} addButtonChange={this.increaseItemQuantity} removeButtonChange={this.decreaseItemQuantity} deleteButtonChange={this.deleteItem}/>
                )}

            </div>
            

        );
    }
}
 



