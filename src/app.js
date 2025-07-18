const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup",async(req,res)=>{
    //Creating a new Instance of the User model
    const user = new User({
        firstName:"Prerna",
        lastName:"Gour",
        emailId:"Prernagour2904@gmail.com",
        password:"Prerna@2904",
    })

   try{
     await user.save();
     res.send("Data Added Sucesfully");
   }
   catch{
    res.send(400).send("API Not Working");
   }
})

connectDB()
    .then(() => {
        console.log("Database Connected");
        app.listen(3000, () => {
            console.log("Server is Successfully Listening");
        });
    })
    .catch((err) => {
        console.error("Database Not Connected", err);
    });


