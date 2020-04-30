import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { dark } from '@material-ui/core/styles/createPalette';
import AddIcon from '@material-ui/icons/Add';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded';



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  palette:{
      type: dark,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(3, 2),
    
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
}));

export default function MiddleDividers(props) {
    const classes = useStyles();
    var style = {
        padding: "10px"
    };

    return (
        <div className={classes.root}>
        <div className={classes.section1} style={style}>
            <Grid container alignItems="center">
            <Grid item xs>
                <Typography gutterBottom variant="h4">
                {props.value.name}
                </Typography>
            </Grid>
            <Grid item>
                <Typography gutterBottom variant="h6">
                Total Price of Item: ${props.value.quantity * props.value.price}
                </Typography>
            </Grid>
            </Grid>
            <Typography color="textSecondary" variant="subtitle1" >
            ID: {props.value.id}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
            Quantity: {props.value.quantity}
            </Typography>
            <Typography color="textSecondary" variant="subtitle1">
            Price of Item: {props.value.price}
            </Typography>
        </div>
        <Divider variant="middle"/>
        <div className={classes.section2} style={style}>
      
            <div>
            <AddCircleRoundedIcon onClick={()=>{props.addButtonChange(props.value.id)}} style={{fontSize:30, marginRight:30}}></AddCircleRoundedIcon>
            <RemoveCircleRoundedIcon onClick={()=>{props.removeButtonChange(props.value.id)}} style={{fontSize:30, marginRight:30}}></RemoveCircleRoundedIcon>
            <DeleteRoundedIcon onClick={()=>{props.deleteButtonChange(props.value.id)}}  style={{fontSize:30}}></DeleteRoundedIcon>
    
            </div>
        </div>
        
        </div>
    );
}