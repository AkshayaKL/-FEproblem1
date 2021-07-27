import axios from 'axios';

const baseURL ='https://findfalcone.herokuapp.com';
const axiosInstance = axios.create({
	baseURL: baseURL,
		headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	}, 

});

export default class falconServices{
 getPlanetData(){

    return axiosInstance.get('/planets',{
        headers:{
          "Content-Type": "application/json",
        }
      })
}

 getVehicleData(){
     return axiosInstance.get('/vehicles',{
        headers:{
           
            "Content-Type": "application/json",
          }
     })
}

 getFinalStatus(data){
       console.log(data);
        return axiosInstance.post('/find',data,{
           headers:{
                "Accept" : "application/json",
                "Content-Type": "application/json",
              }
        })
}

getToken(){
    return axiosInstance.post("/token", {
        headers: {
            "Content-Type": "multipart/form-data",
            
          },
        
    });    
}

}

