const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const User = require("../models/user")

userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "LastName", "photoUrl", "age", "about", "skills"]).populate("toUserId", ["firstName", "LastName", "photoUrl", "age", "about", "skills"]);
        //also you can write it like array or json

        const data = connectionRequest.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id) {
                return row.fromUserId;
            }
        });

        res.send(data);


    } catch (err) {
        res.status(400).send("Cannot Find Request");
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "LastName", "photoUrl", "age", "about", "skills"]);


        res.json({ data: connectionRequest })

    } catch (err) {
        res.status(400).send("Error");
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsers = new Set();

        connectionRequest.forEach((req) => {
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString());
        });

        // Also hide the logged-in user
        hideUsers.add(loggedInUser._id.toString());

        const users = await User.find({
            _id: { $nin: Array.from(hideUsers) }
        }).select("firstName lastName age about skills")
            .skip(skip)
            .limit(limit);

        res.send(users);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;