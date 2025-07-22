const mongoose = require("mongoose");
const validator  = require("validator");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Mail Address");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validator(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter Strong Password"+ value);
            }
        }
    },
    age: {
        type: String,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender Data is not Valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/imgres?q=dummy%20user%20image&imgurl=https%3A%2F%2Fsriit.ac.in%2Ftool%2Fplugins%2Fimages%2Fusers%2F4.jpg&imgrefurl=https%3A%2F%2Fsriit.ac.in%2Ftool%2Fplugins%2Fimages%2Fusers%2F&docid=1G1F0UzseHikKM&tbnid=DhFnQfv70T5ClM&vet=12ahUKEwj5gfju9MqOAxVXRmcHHRdqBYAQM3oECH8QAA..i&w=600&h=600&hcb=2&ved=2ahUKEwj5gfju9MqOAxVXRmcHHRdqBYAQM3oECH8QAA",
        validator(value){
            if(!validator.isURL(value)){
                throw new Error("Photo URL is not Correct");
            }
        }
    },
    about: {
        type: String,
        default: "This is Default about of the Person"
    },
    skills: {
        type: [String]
        //Because there are multiple Skills
    }

}, {
    timestamps: true
});

// userSchema.methods.getJWT = async function(){
//     const user = this;
//     const token = await jwt.sign({_id :user._id},"Secret@Key");

//     return token;
// }
//(Name of model, schema);

module.exports = mongoose.model("User", userSchema);