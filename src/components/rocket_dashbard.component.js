import {React, useEffect, useState} from "react";
import "./rocket_dashboard.css";
import king from "../images/king.png"
import falconServices from "../services/findingfalcons.service";
import {Button, DialogContent} from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import { Paper } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
var falconService = new falconServices();
var chosenplanets =[];
var chosenrockets = [];
var timeTaken =0;
export default function RocketDashboard(){

const [SelectedPlanet, setSelectedPlanet] = useState({});
const [selectedRocket, setSelectedRocket] = useState({});
const [rockets, setRockets] = useState([]);
const [planets, setPlanets] = useState([]);
const [openStatus,setOpenStatus] =useState(false);
const [responseData, setResponseData] = useState({});

let finalData = {
    
}


function handleClose(){
    setOpenStatus(false);
    window.location.reload();
}
function choosePlanetAndRocket(planet,rocket){
    
    timeTaken+=planet.distance/rocket.speed;

    chosenplanets.push(planet);
    chosenrockets.push(rocket);
    
    setPlanets(planets.filter((Planet)=>planet.name!==Planet.name));
    rockets.map((Rocket)=>{
             if(rocket.name===Rocket.name){
                 if(Rocket.total_no>1)
                   {      
                       Rocket.total_no-=1;
                       setRockets([...rockets.filter((vehicle)=>vehicle.name !== Rocket.name),Rocket])

                   }

                   else{
                       setRockets(rockets.filter((rocket)=>
                           rocket.name!==Rocket.name
                       ))
                   }
             }
    })
    if(chosenplanets.length===4){
                 
        setPlanets([]);
        setRockets([]);
        console.log("ok");
        falconService.getToken().then((response)=>{

               
                let token = response.data.token;
                finalData.token = token;
                finalData.planet_names =[];
                finalData.vehicle_names =[];
                chosenplanets.forEach((chosenPlanet)=>{
                    finalData.planet_names.push(chosenPlanet.name);
                  
                    
                })
                chosenrockets.forEach((chosenRocket)=>{
                      finalData.vehicle_names.push(chosenRocket.name);
                     
                })
                

        console.log(JSON.stringify(finalData));

        falconService.getFinalStatus(finalData).then((response)=>{
                   console.log(response.data);
                   setResponseData(response.data);
                   setOpenStatus(true);
                   
        }).catch((err)=>{
                 console.log(err);
        });
            
        })
    
}
}
useEffect(()=>{
         falconService.getVehicleData().then((response)=>{
            console.log(response)
             setRockets(response.data);
             console.log(response.data);
             
         }
         )

         falconService.getPlanetData().then((response)=>{
             setPlanets(response.data);
             console.log(response.data);
         })
},[])

return(
   
    <div className="mainContainer" id="mainContainer">


        
         <Dialog
                 onClose={handleClose}
                 aria-labelledby="simple-dialog-title"
                  open={openStatus}
      >
          {
              responseData.status==="success"?<DialogContent><h2>Found in {responseData.planet_name}</h2><h1 style={{color:responseData.status==="success"?"green":"red"}}>{responseData.status}</h1>
        
              <h2>Time taken: {timeTaken}</h2></DialogContent>:<DialogContent>Oops, Falcone won!<h1 style={{color:responseData.status==="success"?"green":"red"}}>You failed!</h1>
        
              <h2>Time taken: {timeTaken}</h2></DialogContent>
          }
          <DialogContent>
              
            </DialogContent>
          
      </Dialog>
         <div id="RocketsInfo">
            {
              planets.map((planet)=>{
                  return(<div><Button id="planet" onClick={()=>{setSelectedPlanet(planet)}}><strong>{planet.name}</strong></Button>
                  
                  <Slide direction="right" in={SelectedPlanet===planet} mountOnEnter unmountOnExit="true">
                     <Paper id="planetInfo" elevation={4} >
                          I'm at a distance of {planet.distance} megamiles, choose a vehicle<br/>
                         
                         {
                              rockets.filter(rocket=>rocket.max_distance>=planet.distance).map((rocket)=>{
                                
                                
                                  
                                    return(
                                        <div id="rocketc"> <Button onClick={()=>{choosePlanetAndRocket(planet,rocket)}}>{rocket.name} </Button> </div>
                                    )
                                    

                                    
                              })
                          }
                         
                          </Paper>
                       </Slide>
                      
                  </div>
                  
                  )
              }
              
              
              )
            }
            <Button disabled={Object.keys(SelectedPlanet).length === 0?true:false} onClick={()=>{setSelectedPlanet({})}}><strong>Clear selection</strong></Button>
        </div>


        <div id="king"><img id="king" alt="" src={king}></img></div>
        
        <div id="RocketsInfo">
            {
              rockets.map((rocket)=>{
                  return(<div><Button onClick={()=>{setSelectedRocket(rocket)}}><strong>{rocket.name}</strong></Button>
                  
                  <Slide direction="left" in={selectedRocket===rocket} mountOnEnter unmountOnExit="true">
                     <Paper id="rocketInfo" elevation={4} >
                          {rocket.total_no} left<br/>
                           Range is {rocket.max_distance} megamiles <br/>
                           Zooms at a speed of {rocket.speed} megamiles/hour
                         
                          </Paper>
                       </Slide>
                      
                  </div>
                  
                  )
              }
              
              
              )
            }
            <Button disabled={Object.keys(selectedRocket).length === 0?true:false} onClick={()=>{setSelectedRocket({})}}><strong>Clear selection</strong></Button>
        </div>
        </div>
)
}