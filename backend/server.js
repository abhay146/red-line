const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect("mongodb+srv://admin:admin@abhay.pgysgqx.mongodb.net/?appName=Abhay")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((error) => {
    console.log(error);
});


// Database Schema
const Contact = mongoose.model("Contact", {
    name: String,
    email: String,
    phone: String,
    message: String
});


// Contact Form API
app.post("/contact", async (req, res) => {

    try {

        const contact = new Contact(req.body);

        await contact.save();

        console.log("Data Saved:", req.body);

        res.json({
            message: "Message saved successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
