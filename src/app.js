const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrpty = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");
const { validateSignUpData } = require("./utils/validation");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        //Validation of Data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;
        //Encrypt Password
        const passwordHash = await bcrpty.hash(password, 10);
        console.log(passwordHash);

        //Creating a new Instance of the User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        })
        await user.save();
        res.send("Data Added Sucesfully");
    }
    catch (err) {
        res.status(400).send("SignUp API Not Working: " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentails");
        }
        const isPasswodValid = await bcrpty.compare(password, user.password);

        if (isPasswodValid) {

            const token = await jwt.sign({_id :user._id},"Secret@Key");
            res.cookie("token",token);
            res.send("Login Successfull");
        }
        else {
            throw new Error("Invalid Credentails");
        }
    } catch (err) {
        res.status(400).send("Not Loggin " + err.message);
    }
})

app.get("/profile", userAuth , async (req,res)=>{
   try{
    console.log("working");
    const user = req.user;
    res.send(user);
   }
   catch(err){
    res.status(400).send("Error " + err.message);
   }
})

app.post("/sendConnectionRequest",userAuth, async (req,res)=>{
    const user = req.user;
    res.send("Connection Request Sent by " + user.firstName);
})

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

app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        await User.findByIdAndUpdate(userId, data, { runValidators: true });
        res.send("User Updated");
    }
    catch (err) {
        res.status(400).send("Something Went Wrong" + err);
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


