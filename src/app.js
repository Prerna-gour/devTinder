const express = require("express");
const { adminAuth } = require("./middlewares/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
    res.send("Get All Data");
});

app.get("/admin/getAll", (req, res) => {
    res.send("Get All route is working");
});

app.get("/user", (req, res) => {
    res.send("Yes Working 1");
});

app.listen(3000, () => {
    console.log("Server is Successfully Listening");
});
