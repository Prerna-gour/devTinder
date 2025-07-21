const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const user = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    //Creating a new Instance of the User model
    const user = new User(req.body)

    try {
        await user.save();
        res.send("Data Added Sucesfully");
    }
    catch {
        res.send(400).send("API Not Working");
    }
});

app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    console.log(User.emailId);
    try {

        const user = await User.find({ emailId: userEmail });
        res.send(user)
    }
    catch {
        res.status(400).send("Something went wrong");
    }
});

app.get("/feed", async (req, res) => {
    try {
        const users = await user.find({});
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Not Getting Feed Data");
    }
});

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId);
        res.send("User Deleted");
    }
    catch (err) {
        res.status(400).send("User Not Deleted");
    }
});

app.patch("/user", async(req,res)=>{
    const userId = req.body.userId;
    const data = req.body;
    try{
        await User.findByIdAndUpdate(userId, data,{runValidators:true});
        res.send("User Updated");
    }
    catch(err){
        res.status(400).send("Something Went Wrong"+ err);
    }
});

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


