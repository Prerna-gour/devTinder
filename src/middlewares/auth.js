const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req,res,next) =>{
try{
    const {token} =  req.cookies;
    if(!token){
        throw new Error("Token is Not Valid");
    }
    const decodeData = await jwt.verify(token,"Secret@Key");
    const {_id} = decodeData;

    const user = await User.findById(_id);
    
    if(!_id){
        throw new Error("User not Present");
    }
    req.user = user;
    
    next();
}
catch(err){
    res.status(400).send("Error "+ err.message);
}

}

module.exports = {userAuth};