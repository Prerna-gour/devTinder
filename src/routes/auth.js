const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrpty = require("bcrypt");
const {userAuth} = require("../middlewares/auth");


const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        //Validation of Data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;
        //Encrypt Password
        const passwordHash = await bcrpty.hash(password, 10);

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

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentails");
        }
        const isPasswodValid = await bcrpty.compare(password, user.password);

        if (isPasswodValid) {

            const token = await user.getJWT();
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

authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    }).send("Logout Successfully");
})

module.exports = authRouter;