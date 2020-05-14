import React, {useState} from 'react';
import {MuiThemeProvider, createMuiTheme} from "@material-ui/core/styles";
import {Switch, FormControlLabel} from "@material-ui/core";
import App from "./App";
import CssBaseline from '@material-ui/core/CssBaseline';



const themeObject = {
    palette: {
        primary: {main : '#053f5b'},
        secondary: {main : "#5e3c6f"},
        type: "light"
    },
    themeName: 'Blue Lagoon 2020',
    typography: {
       
    }
}

const useDarkMode = () => {
    const [theme, setTheme] = useState(themeObject);
    const {palette: {type}} = theme;
    const toggleDarkMode = () => {
        const updatedTheme = { 
            palette:{
                primary: {main : '#053f5b'},
                secondary: {main : "#5e3c6f"},
                type: type === "light" ? "dark":'light'
            },
            themeName: 'Blue Lagoon 2020',
            typography: {
            
    }

        }
        setTheme(updatedTheme)
    }
    return [theme, toggleDarkMode]
}

const Theme = () => {
    const [theme, toggleDarkMode] = useDarkMode()
    const themeConfig = createMuiTheme(theme)

    return (
        <MuiThemeProvider theme={themeConfig}>
            
            
                
                
            
            <CssBaseline />
        
            <App/>
            <FormControlLabel control={<Switch onClick={toggleDarkMode}/>} style={{position: "fixed", bottom: 0,right: 0}}/>


        </MuiThemeProvider>

    )
}

export default Theme;