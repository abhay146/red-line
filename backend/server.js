// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();

// app.use(cors());
// app.use(express.json());


// // MongoDB Connection
// // mongoose.connect("mongodb+srv://abhaysingh840019_db_user:shiva6789@cluster0.oqbmbcm.mongodb.net/?appName=Cluster0")
// // .then(() => {
// //     console.log("MongoDB Connected");
// // })
// // .catch((error) => {
// //     console.log(error);
// // });

// mongoose.connect(
// process.env.MONGO_URL || 
// "mongodb+srv://abhaysingh840019_db_user:shiva6789@cluster0.oqbmbcm.mongodb.net/redlineDB"
// )
// .then(() => {
//     console.log("MongoDB Connected");
// })
// .catch((error)=>{
//     console.log(error);
// });



// // Database Schema
// const Contact = mongoose.model("Contact", {
//     name: String,
//     email: String,
//     phone: String,
//     message: String
// });


// // Contact Form API
// app.post("/contact", async (req, res) => {

//     try {

//         const contact = new Contact(req.body);

//         await contact.save();

//         console.log("Data Saved:", req.body);

//         res.json({
//             message: "Message saved successfully"
//         });

//     } catch (error) {

//         console.log(error);

//         res.status(500).json({
//             message: "Something went wrong"
//         });

//     }

// });


// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });


// 2
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

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
.then(() => {

    console.log("MongoDB Connected");

    console.log(
        "Database Name:",
        mongoose.connection.name
    );

})
.catch((error) => {

    console.log(
        "MongoDB Connection Error:",
        error
    );

});




// ===============================
// Contact Schema
// ===============================

const Contact = mongoose.model(
    "Contact",
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        }

    },
    "contacts"
);




// ===============================
// Contact API
// ===============================

app.post("/contact", async (req, res) => {

    try {


        const contact = new Contact({

            name: req.body.name,

            email: req.body.email,

            phone: req.body.phone,

            message: req.body.message

        });



        const savedContact = await contact.save();



        console.log(
            "======================"
        );

        console.log(
            "Database:",
            mongoose.connection.name
        );


        console.log(
            "Collection:",
            Contact.collection.name
        );


        console.log(
            "Saved Document:",
            savedContact
        );


        console.log(
            "======================"
        );



        res.status(200).json({

            message: "Message saved successfully"

        });



    } catch(error) {


        console.log(
            "Save Error:",
            error
        );


        res.status(500).json({

            message:"Something went wrong"

        });


    }

});




// ===============================
// Server Start
// ===============================

app.listen(3000,()=>{

    console.log(
        "Server running on port 3000"
    );

});


/// new data 


// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");


// const app = express();


// app.use(cors());
// app.use(express.json());



// // =========================
// // MongoDB Connection
// // =========================


// mongoose.connect("mongodb+srv://abhaysingh840019_db_user:@shiva6789@cluster0.oqbmbcm.mongodb.net/?appName=Cluster0")

// .then(() => {

//     console.log("MongoDB Connected");

// })

// .catch((error)=>{

//     console.log(error);

// });




// // =========================
// // Contact Schema
// // =========================


// const Contact = mongoose.model("Contact", {

//     name:String,

//     email:String,

//     phone:String,

//     message:String

// });





// // =========================
// // User Schema
// // =========================


// const User = mongoose.model("User", {

//     name:String,

//     email:String,

//     password:String

// });






// // =========================
// // Contact Form API
// // =========================


// app.post("/contact", async(req,res)=>{


//     try{


//         const contact = new Contact(req.body);


//         await contact.save();


//         console.log("Contact Saved:", req.body);



//         res.json({

//             message:"Message saved successfully"

//         });


//     }

//     catch(error){


//         console.log(error);


//         res.status(500).json({

//             message:"Something went wrong"

//         });


//     }


// });









// // =========================
// // Signup API
// // =========================


// app.post("/signup", async(req,res)=>{


//     try{


//         const {

//             name,

//             email,

//             password


//         } = req.body;





//         const existingUser = await User.findOne({

//             email:email

//         });





//         if(existingUser){


//             return res.json({

//                 message:"User already exists"

//             });


//         }






//         // Password Hash

//         const hashPassword = await bcrypt.hash(

//             password,

//             10

//         );







//         const user = new User({


//             name:name,


//             email:email,


//             password:hashPassword


//         });






//         await user.save();






//         res.json({

//             message:"Signup successful"

//         });




//     }


//     catch(error){


//         console.log(error);


//         res.status(500).json({

//             message:"Signup failed"

//         });


//     }



// });











// // =========================
// // Login API
// // =========================


// app.post("/login", async(req,res)=>{


//     try{


//         const {

//             email,

//             password


//         } = req.body;






//         const user = await User.findOne({

//             email:email

//         });







//         if(!user){


//             return res.json({

//                 message:"User not found"

//             });


//         }








//         const passwordCheck = await bcrypt.compare(

//             password,

//             user.password

//         );








//         if(!passwordCheck){


//             return res.json({

//                 message:"Wrong password"

//             });


//         }







//         const token = jwt.sign(


//             {

//                 id:user._id,

//                 email:user.email

//             },


//             "redline_secret_key",


//             {

//                 expiresIn:"1d"

//             }


//         );







//         res.json({


//             message:"Login successful",


//             token:token



//         });





//     }


//     catch(error){


//         console.log(error);


//         res.status(500).json({

//             message:"Login failed"

//         });


//     }



// });









// // =========================
// // Server Start
// // =========================


// app.listen(3000,()=>{


//     console.log("Server running on port 3000");


// });

