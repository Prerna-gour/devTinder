const express = require("express");

const app = express();

app.use("/test",(req,res)=>{
    res.send("Hello From Server");
})

app.listen(3000,()=>{
    console.log("Server is Succesfully Listening");
});


