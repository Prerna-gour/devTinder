// models/connectionRequest.js
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //this is realtion with User Schema
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        required: true,
        enum: ["ignore", "interested", "accepeted", "rejected"]
    }
}, {
    timestamps: true
});

connectionRequestSchema.index({fromUserId : 1 , toUserId : 1});

connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;
    //check if the fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send Request to Yourself");
    }
    next();

})

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
