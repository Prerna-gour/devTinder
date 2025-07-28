const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

// POST: Send connection request via URL params
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Validate status value
        if (!["ignore", "interested"].includes(status)) {
            return res.status(400).send("Use Not Exist");
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message : "User Not Found"});
        }

        const existingRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }],

        });

        if(existingRequest){
            return res.status(200).status("Already Exist");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const savedRequest = await connectionRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        console.error("Error sending request:", err.message);
        res.status(500).json({ error: "Connection request not sent" });
    }
});

module.exports = requestRouter;
