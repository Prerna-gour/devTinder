const validator = require("validator");

const validateSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not Valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not Valid");
    }
}

const validateEditProfileData = (req) =>{
    const allowedEditData = [
        "firstName",
        "lastName",
        "emailId",
        "password",
        "age",
        "gender",
        "photoUrl",
        "about",
        "skills"
    ];

    const isEditAllowed = Object.keys(req.body).every((field)=>
    allowedEditData.includes(field)
    );

    return isEditAllowed;
}

module.exports={validateSignUpData, validateEditProfileData};