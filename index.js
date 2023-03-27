const express=require("express")

const {connection}=require("./configs/db")
const {userrouter}=require("./routes/user.route")
const {weatherrouter}=require("./routes/weather.route")
const {authenticate}=require("./middleware/Authentication.middleware")
require("dotenv").config()
const cors=require("cors")
http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apikey}

const app=express()
app.use(cors({
    origin:"*"
}))

app.use(express.json())
const redis = require("redis");
const winston = require('winston');
const client = redis.createClient();

// store data in Redis
client.set("key", "value", (err, reply) => {
  console.log(reply);
});

// retrieve data from Redis
client.get("key", (err, reply) => {
  console.log(reply);
});

client.setex(token, expirationTimeInSeconds, "blacklisted", (err, reply) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Token blacklisted:", token);
    }
  });

  client.get(token, (err, reply) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    } else if (reply === "blacklisted") {
      res.status(401).json({ message: "Unauthorized" });
    } else {
        app.post("/logout", (req, res) => {
            
            const token = req.headers.authorization.split(" ")[1];
          
           
            client.setex(token, expirationTimeInSeconds, "blacklisted", (err, reply) => {
              if (err) {
                console.error(err);
                res.status(500).json({ message: "Internal server error" });
              } else {
                
                res.json({ message: "Logout successful" });
              }
            });
          });
    }
  });

  const request=require("request")
  const apikey="7d717017b9a25ca9f724586636ec727e"
  
app.get("/",(req,res)=>{
    res.send("Home Page")
})
app.use("/users",userrouter)


app.use(authenticate)

app.get("/weather",  async (req,res) =>{
    const key = `weather:${city}`;
  let data = await client.getAsync(key);

  if (!data) {
   
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`);
      const json = await response.json();
      data = JSON.stringify(json);

      
      client.set(key, data, 'EX', WEATHER_EXPIRATION_TIME);
    } catch (err) {
     
      winston.error(`Error fetching weather data for ${city}: ${err}`);
      throw err;
    }
  }

  return JSON.parse(data);
})
app.post("/weather",(req,res)=>{
    let city=req.body.city
    let url=`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apikey}`
    request(url,function(err,res,body){
        if(err){
            res.send("please try again")
        }else{
            let weather=JSON.parse(body)
            if(weather.main==undefined){
                res.send("please try again")
            }else{
                res.send(weather)
            }
        }
    })
})


app.listen(8080 ,async()=>{
    try{
        await connection
        console.log("connected to db")
    }catch(err){
        console.log("coonection failed")
        console.log(err)
    }
})