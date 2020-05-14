import React, { Component } from 'react';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import ShoppingCartRoundedIcon from '@material-ui/icons/ShoppingCartRounded';

import  '../App.css';
import './Navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ids : [

            ],
        };
    }

    updateIds(info){
        console.log("Navbar has this information " + info.id);
    }

    render() { 
        
        return (
            <div >
                
                <nav class="navbar navbar-expand-lg navbar-light bg-light-grey">
                    <ShoppingCartRoundedIcon style={{marginRight:10}}></ShoppingCartRoundedIcon>
                    <a class="navbar-brand" href="#" >Shopping Cart</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        
                        <ul class="navbar-nav mr-auto">
                        <NavLink className="inactive"   activeStyle={{color:"red"} } to='/' exact strict>
                            <li >
                                <a class = "Nav-links">View Cart</a>
                            </li>
                        </NavLink>
                        <NavLink className="inactive" activeStyle={{color:"red"}} to='/addToCart' exact strict>
                            <li >
                                <a class= "Nav-links" >Add to Cart</a>
                            </li>
                        </NavLink>
                        </ul>


                    
                    
                    </div>
                </nav>
            </div>
        );
    }
}
 
export default Navbar;