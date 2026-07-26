const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();


app.use(cors());
app.use(express.json());



// ===============================
// MongoDB Connection
// ===============================

mongoose.connect(
    process.env.MONGO_URL
)
.then(()=>{

    console.log("MongoDB Connected");

    console.log(
        "Database:",
        mongoose.connection.name
    );

})
.catch((error)=>{

    console.log(
        "MongoDB Error:",
        error
    );

});




// ===============================
// Contact Model
// ===============================

const Contact = mongoose.model(

    "Contact",

    {

        name:{
            type:String,
            required:true
        },

        email:{
            type:String,
            required:true
        },

        phone:{
            type:String,
            required:true
        },

        message:{
            type:String,
            required:true
        }

    },

    "contacts"

);





// ===============================
// User Model
// ===============================

const User = mongoose.model(

    "User",

    {

        name:{
            type:String,
            required:true
        },


        email:{
            type:String,
            required:true,
            unique:true
        },


        password:{
            type:String,
            required:true
        }

    },

    "users"

);








// ===============================
// Contact API
// ===============================

app.post("/contact", async(req,res)=>{

    try{


        const contact = new Contact({

            name:req.body.name,

            email:req.body.email,

            phone:req.body.phone,

            message:req.body.message

        });



        const savedContact = await contact.save();



        console.log(
            "Contact Saved:",
            savedContact
        );



        res.json({

            message:"Message saved successfully"

        });



    }
    catch(error){


        console.log(
            "Contact Error:",
            error
        );


        res.status(500).json({

            message:"Contact failed"

        });


    }


});









// ===============================
// Signup API
// ===============================


app.post("/signup", async(req,res)=>{


    console.log(
        "========== SIGNUP API HIT =========="
    );


    console.log(
        "Signup Data:",
        req.body
    );



    try{


        const {

            name,

            email,

            password

        } = req.body;





        const userExist = await User.findOne({

            email:email

        });





        if(userExist){


            console.log(
                "User already exists"
            );


            return res.status(400).json({

                message:"User already exists"

            });


        }






        const hashPassword = await bcrypt.hash(

            password,

            10

        );






        const user = new User({

            name:name,

            email:email,

            password:hashPassword

        });






        const savedUser = await user.save();






        console.log(

            "New User Saved:",

            savedUser

        );







        res.json({

            message:"Signup successful"

        });





    }
    catch(error){


        console.log(

            "Signup Error:",

            error

        );


        res.status(500).json({

            message:"Signup failed"

        });


    }



});









// ===============================
// Login API
// ===============================


app.post("/login", async(req,res)=>{


    console.log(
        "========== LOGIN API HIT =========="
    );


    console.log(
        "Login Data:",
        req.body
    );



    try{


        const {

            email,

            password

        } = req.body;






        const user = await User.findOne({

            email:email

        });







        if(!user){


            console.log(
                "User Not Found"
            );


            return res.status(404).json({

                message:"User not found"

            });


        }








        const checkPassword = await bcrypt.compare(

            password,

            user.password

        );







        if(!checkPassword){


            console.log(
                "Wrong Password"
            );


            return res.status(400).json({

                message:"Wrong password"

            });


        }








        const token = jwt.sign(

            {

                id:user._id,

                email:user.email

            },


            process.env.JWT_SECRET || "redline_secret_key",


            {

                expiresIn:"1d"

            }

        );








        console.log(

            "Login Successful:",

            email

        );








        res.json({

            message:"Login successful",

            token:token,


            user:{

                name:user.name,

                email:user.email

            }

        });







    }
    catch(error){


        console.log(

            "Login Error:",

            error

        );


        res.status(500).json({

            message:"Login failed"

        });


    }



});








// ===============================
// Test API
// ===============================

app.get("/",(req,res)=>{


    res.send(

        "Redline Backend Running"

    );


});








// ===============================
// Server Start
// ===============================


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{


    console.log(

        "Server running on port",

        PORT

    );


});
