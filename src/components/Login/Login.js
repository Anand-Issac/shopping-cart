import React, { Component } from 'react';
import './Login.css';
import firebase from 'firebase';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import "firebase/auth"; 


class Login extends Component {
    constructor(props) {
        super(props);
        this.state ={
            email: "",
            password: "",
            nameSignUp:"",
            emailSignUp: "",
            passwordSignUp: "",
            message: ""
        }
        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSignUpChange = this.handleSignUpChange.bind(this);
        this.signUp = this.signUp.bind(this);
        this.containerRef = React.createRef();
        this.signUpButtonRef = React.createRef();
        this.signInButtonRef = React.createRef();
        
        
        this.uiConfig = {
            signInFlow: "popup",
            signInOptions: [
              firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ],
            callbacks: {
              signInSuccess: ()=> false
            }
      
          }
    }
    login(e){
        console.log(this.state.email);
        console.log(this.state.password);
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((u)=>
            console.log(u)
        ).catch((e)=> {console.log(e)});
    }

    signUp(e){
        
        console.log(this.state.email);
        console.log(this.state.password);
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.emailSignUp, this.state.passwordSignUp).then((u)=>{
            console.log("user signed up")
        }).catch((e)=> {
            this.setState({
                message: e.message
            })
            
        });
      
        console.log(this.state.emailSignUp);
    }

    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleEmailChange(e){
        this.setState({
            email : e.target.value
        })
    }
    handlePassChange(e){
        this.setState({
            password : e.target.value
        })
    }

    handleSignUpChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    render() { 
        const formStyle = {
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            padding: "0 50px",
            height: "100%",
            textAlign: "center",
        };
       

     

        return (  
            
            <div>
                 
            <div ref={this.containerRef}  class="container" id="container">
                
                <div class="form-container sign-up-container">
                    <form style={formStyle} action="#">
                        <h1 style={{marginTop:"50px"}}>Create Account</h1>
                        <div class="social-container">
                       
                            
                        </div>
                        <span>Use your email for registration</span>
                        <input name="nameSignUp" type="text" placeholder="Name" onChange={this.handleSignUpChange} />
                        <input name="emailSignUp" type="email" placeholder="Email" onChange={this.handleSignUpChange}/>
                        <input name="passwordSignUp" type="password" placeholder="Password" onChange={this.handleSignUpChange} />
                        <button onClick={this.signUp}>Sign Up</button>
                        <p style={{color:"#FF416C"}}>{this.state.message}</p>
                    </form>
                </div>
                <div class="form-container sign-in-container">
                    <form style={formStyle} action="#">
                        <h1>Sign in</h1>
                        <div class="social-container">
                            
                            
                            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
                
                        </div>
                        <span>or use your account</span>
                        <input name="email" type="email" placeholder="Email" value={this.state.email} onChange={this.handleChange}/>
                        <input name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
                        <a href="#">Forgot your password?</a>
                        <button onClick={this.login}>Sign In</button>
                    </form>
                </div>
                <div class="overlay-container">
                    <div class="overlay">
                        <div class="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button ref={this.signInButtonRef} class="ghost" id="signIn" onClick={()=> {this.containerRef.current.classList.remove("right-panel-active")}}    >Sign In</button>
                        </div>
                        <div class="overlay-panel overlay-right">
                            <h1>Nice to meet you!</h1>
                            <p>Saving time begins here.</p>
                            <button ref={this.signUpButtonRef} class="ghost" id="signUp" onClick={()=> {this.containerRef.current.classList.add("right-panel-active")}}>Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>

            
            </div>
          
     



        );
    }
}
 
export default Login;