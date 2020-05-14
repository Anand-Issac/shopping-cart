import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';


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
                price: null,
                shippingCost: null,
                url: ''

            },
            submitPressed: false
        };
        
        //this.handleIdChange = this.handleIdChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        //this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendData = this.sendData.bind(this);
        this.ebaySearch = this.ebaySearch.bind(this);
    }

    //good place to handle updates to component state changes
    //process after first render 
    componentDidUpdate(prevProps, prevState ){
        console.log(this.state.submitPressed);
        if (prevState.submitPressed !== this.state.submitPressed){
            if (this.state.submitPressed === true){
                console.log("componentDidUpdate");
                this.ebaySearch(this.state.info.name);
            }
        
        
        }
    
    }
    
    ebaySearch(keyword){
        console.log("searching ebay");
        //this finds keyword item and returns u info from ebay, logs it to console
        const uri = "/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=AnandIss-shopping-PRD-1c51f635b-2111347e&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords="+keyword
        let h = new Headers();
        h.append("X-EBAY-SOA-OPERATION-NAME", 'findItemsByKeywords');
        h.append('X-EBAY-SOA-SECURITY-APPNAME','AnandIss-shopping-PRD-1c51f635b-2111347e');
        h.append('X-EBAY-SOA-RESPONSE-DATA-FORMAT', 'JSON');

        let req = new Request(uri, {
        method: "GET",
        headers: h,
        mode: "cors"
        });

        fetch(req)
        .then((response) => {
        
            console.log(response);
            response.json()
        .then(data =>{
            console.log(data.findItemsByKeywordsResponse[0].searchResult[0].item)
            const listOfItems = data.findItemsByKeywordsResponse[0].searchResult[0].item;
            const minCostIndex = this.findCheapestItem(listOfItems);
            if (minCostIndex > -1 ){
                const item = listOfItems[minCostIndex];
                console.log(item.shippingInfo[0]);
                this.setState({
                    info:{
                        id: item.itemId[0],
                        name: this.state.info.name,
                        price: item.sellingStatus[0].convertedCurrentPrice[0].__value__,
                        shippingCost: item.shippingInfo[0].shippingServiceCost[0].__value__,
                        url: item.viewItemURL[0]
                        
                    },
                    
                });

                this.sendData();

                this.setState({
                    info: {
                        id: "",
                        name: "",
                        price: "",
                        shippingCost: '',
                        url: ''
                    },
                    submitPressed: false,
                });
                

            }else{
                this.setState({
                    info:{
                        id: "00000",
                        name: "Item Not Found",
                        price: 0,
                        shippingCost: 0,
                        url: ''
                        
                    },
                    
                });

                this.sendData();

                this.setState({
                    info: {
                        id: "",
                        name: "",
                        price: "",
                        shippingCost:'',
                        url:''
                    },
                    submitPressed: false,
                });               
            }

            })
        })
        .catch((err)=>{
            console.log('error:', err.message);
        })
    }

    findCheapestItem(listOfItems){
        if (listOfItems.length > 0){
            var minCost = 1000000000;
            var minCostIndex = 0;
            if(listOfItems[0].hasOwnProperty('sellingStatus') && listOfItems[0].hasOwnProperty('shippingInfo')){
                minCost = (listOfItems[0].sellingStatus[0].convertedCurrentPrice[0].__value__) + (listOfItems[0].shippingInfo[0].shippingServiceCost[0].__value__);
                minCostIndex = 0;
            }
          
            for (let i=0; i < listOfItems.length; i ++){
                if(listOfItems[i].hasOwnProperty('sellingStatus') && listOfItems[i].hasOwnProperty('shippingInfo') 
                && (listOfItems[i].sellingStatus[0].hasOwnProperty('convertedCurrentPrice')) && (listOfItems[i].shippingInfo[0].hasOwnProperty('shippingServiceCost')))
                
                
                {
                    var currentPrice = listOfItems[i].sellingStatus[0].convertedCurrentPrice[0].__value__;
                    var shippingPrice = listOfItems[i].shippingInfo[0].shippingServiceCost[0].__value__;
                    var totalPrice = currentPrice + shippingPrice;
                    if (totalPrice < minCost){
                        minCost = totalPrice;
                        minCostIndex = i;
                }
                }

                
            }
            return minCostIndex;
        }
        return -1;
        
    }

    /*
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
    */

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
    /*
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
    */
  
    handleSubmit(event) {
      //sends data after submit button pressed
      this.setState({
          submitPressed: true
      });
      //this.sendData();
      event.preventDefault();
      /*
      this.setState({
        info: {
            id: "",
            name: "",
            price: ""
        }
        });
    */
 
    }

    sendData(){
        //updates the sendData prop that parent component passed
        console.log(this.state.info);
        this.props.sendData(this.state.info);
    }
    
    

    render() {
        
        return (
        <form onSubmit={this.handleSubmit} id="cart-form">
              
           <div>
            <StyledTextField
                id="name-field"
                label="Name of Item"
                value={this.state.info.name}
                onChange={this.handleNameChange}
                variant="outlined"
            
            />
            </div>
         
   
            <div>
            <StyledButton variant="contained" color="primary" type="submit" value="Submit" onSubmit={this.resetForm}> 
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

            <div>
                <NameForm sendData={this.getData}/>
                
            </div>
            
        );
    }
}
 
