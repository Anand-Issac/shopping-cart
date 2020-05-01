import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { withStyles } from '@material-ui/core/styles';

//import {writeItemData} from '../server';


const StyledButton = withStyles({
    root: { 
      margin: '10px',
    }
   
  })(Button);

const StyledTextField = withStyles({
    root:{
        margin: '10px',
        
        
    }
})(TextField);
//Child Component 


class NameForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
          info: {
              id: '',
              name: '',
              price: null
            }
        };
  
        this.handleIdChange = this.handleIdChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendData = this.sendData.bind(this);
    }
  
    handleIdChange(event) {
        // sets state of new ID
        this.setState({
            info: {
                id: event.target.value,
                name: this.state.info.name,
                price: this.state.info.price
            }
        });
    }

    handleNameChange(event) {
        //sets state of new name
        this.setState({
            info: {
                id: this.state.info.id,
                name: event.target.value,
                price: this.state.info.price
            }
        });
    }

    handlePriceChange(event) {
        // sets state of new price
        this.setState({
            info: {
                id: this.state.info.id,
                name: this.state.info.name,
                price: event.target.value
            }
        });
    }
  
    handleSubmit(event) {
      //sends data after submit button pressed
      this.sendData();
      event.preventDefault();
    }

    sendData(){
        //updates the sendData prop that parent component passed
        this.props.sendData(this.state.info);
    }
  
    render() {
        
        return (
        <form onSubmit={this.handleSubmit}>
          
            <div>
            <StyledTextField
                id="outlined-name"
                label="ID"
                value={this.state.info.id}
                onChange={this.handleIdChange}
                variant="outlined"
               
            />
           
           </div>
            
           <div>
            <StyledTextField
                id="outlined-name"
                label="Name"
                value={this.state.info.name}
                onChange={this.handleNameChange}
                variant="outlined"
            
            />
            </div>

           <div>
            <StyledTextField
                id="outlined-name"
                label="Price"
                value={this.state.info.price}
                onChange={this.handlePriceChange}
                variant="outlined"
            
            />
            </div>

         
   
            <div>
            <StyledButton variant="contained" color="primary" type="submit" value="Submit" > 
            Submit
            </StyledButton>
            </div>

        </form>
      );
    }
  }


// Parent Component
export default class AddToCart extends Component {
    constructor(props) {
        super(props);
        
        

        //binding the getData function allows us to set the focus of "this" to be at AddToCart component level
        // this gives us access to the props that we need to update
        this.getData = this.getData.bind(this);

    }

    getData(info){
        this.props.updateCart(info);
    }
    
    

    render() { 
        
        return (
            //add form here
            // most likely will create a <Cart> component from here and update it from here!? 
            // figure out how forms work in react: https://reactjs.org/docs/forms.html
            <div>
                <NameForm sendData={this.getData}/>
                
            </div>
            
        );
    }
}
 
