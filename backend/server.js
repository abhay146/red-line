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
    process.env.MONGO_URL ||
    "mongodb+srv://abhaysingh840019_db_user:shiva6789@cluster0.oqbmbcm.mongodb.net/redlineDB"
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
// Contact Schema
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
// User Schema
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


        console.log(error);


        res.status(500).json({

            message:"Contact save failed"

        });


    }



});









// ===============================
// Signup API
// ===============================


app.post("/signup", async(req,res)=>{


    try{


        const {

            name,

            email,

            password


        } = req.body;




        // Check user already exists

        const existingUser = await User.findOne({

            email:email

        });





        if(existingUser){


            return res.status(400).json({

                message:"User already exists"

            });


        }







        // Password Encrypt

        const hashedPassword = await bcrypt.hash(

            password,

            10

        );








        const user = new User({

            name:name,

            email:email,

            password:hashedPassword

        });






        await user.save();






        console.log(
            "User Created:",
            email
        );





        res.json({

            message:"Signup successful"

        });





    }


    catch(error){


        console.log(error);


        res.status(500).json({

            message:"Signup failed"

        });


    }



});











// ===============================
// Login API
// ===============================


app.post("/login", async(req,res)=>{


    try{


        const {

            email,

            password


        } = req.body;








        const user = await User.findOne({

            email:email

        });








        if(!user){


            return res.status(404).json({

                message:"User not found"

            });


        }








        // Compare Password


        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );








        if(!passwordMatch){


            return res.status(400).json({

                message:"Wrong password"

            });


        }









        // Create JWT Token


        const token = jwt.sign(

            {

                id:user._id,

                email:user.email

            },


            "redline_secret_key",


            {

                expiresIn:"1d"

            }


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


        console.log(error);


        res.status(500).json({

            message:"Login failed"

        });


    }



});









// ===============================
// Test API
// ===============================


app.get("/",(req,res)=>{


    res.send("Redline Backend Running");


});








// ===============================
// Server Start
// ===============================


app.listen(3000,()=>{


    console.log(
        "Server running on port 3000"
    );


});
